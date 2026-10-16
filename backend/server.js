"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const { currentPrice } = require("./offerPricing");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "catalog.json"), "utf8"));
const productsById = new Map(catalog.products.map(product => [product.id, product]));
const paypalClientId = (process.env.PAYPAL_CLIENT_ID || "").trim();
const paypalClientSecret = (process.env.PAYPAL_CLIENT_SECRET || "").trim();
const paypalConfigured = Boolean(paypalClientId && paypalClientSecret);
const paypalApiBase = "https://api-m.sandbox.paypal.com";
const frontendOrigin = normalizeFrontendOrigin(process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5500");
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "0.0.0.0";
const app = express();
const safeLogCodes = new Set([
  "paypal-not-configured", "paypal-auth-unreachable", "paypal-auth-failed",
  "paypal-api-unreachable", "paypal-api-failed", "paypal-order-create-invalid",
  "paypal-order-invalid", "paypal-order-product-invalid", "paypal-order-amount-invalid",
  "paypal-order-id-mismatch", "paypal-order-not-approved", "paypal-capture-invalid",
  "paypal-capture-not-verified", "paypal-capture-not-completed", "product-not-found",
  "invalid-quantity", "product-availability-unknown", "insufficient-stock",
  "invalid-order-id", "invalid-idempotency-key", "idempotency-key-conflict",
  "invalid-json", "request-too-large", "origin-not-allowed"
]);
const safeOAuthErrors = new Set([
  "invalid_request", "invalid_client", "invalid_grant", "unauthorized_client",
  "unsupported_grant_type", "invalid_scope", "temporarily_unavailable", "server_error"
]);

function getSafePaypalDiagnostics(result) {
  const diagnostics = {};
  if (result && typeof result.name === "string" && /^[A-Z][A-Z0-9_]{0,63}$/.test(result.name)) {
    diagnostics.name = result.name;
  }
  if (result && typeof result.error === "string" && safeOAuthErrors.has(result.error)) {
    diagnostics.error = result.error;
  }
  const issue = result && Array.isArray(result.details)
    ? result.details.find(item => item && typeof item.issue === "string" && /^[A-Z][A-Z0-9_]{0,63}$/.test(item.issue))
    : null;
  if (issue) diagnostics.issue = issue.issue;
  if (result && typeof result.debug_id === "string" && /^[A-Za-z0-9-]{8,64}$/.test(result.debug_id)) {
    diagnostics.debugId = result.debug_id;
  }
  return Object.keys(diagnostics).length ? diagnostics : null;
}

function logPaymentFailure(operation, error) {
  const code = error && safeLogCodes.has(error.message) ? error.message : "unexpected-error";
  const status = error && Number.isInteger(error.status) && error.status >= 100 && error.status <= 599
    ? ` (HTTP ${error.status})`
    : "";
  const details = error && error.paypalDiagnostics ? ` details=${JSON.stringify(error.paypalDiagnostics)}` : "";
  console.error(`[PayPal Sandbox] ${operation} failed: ${code}${status}${details}`);
}

let accessTokenCache = null;
const captureRequestsInFlight = new Map();
const expectedOrders = new Map();
const orderCreations = new Map();

function normalizeFrontendOrigin(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("FRONTEND_ORIGIN must be an absolute HTTP(S) origin.");
  }
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.origin !== value.replace(/\/$/, "")) {
    throw new Error("FRONTEND_ORIGIN must contain only the frontend origin, without a path.");
  }
  return parsed.origin;
}

function toCents(value) {
  if (typeof value !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(value)) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

async function getAccessToken() {
  if (!paypalConfigured) throw new Error("paypal-not-configured");
  if (accessTokenCache && accessTokenCache.expiresAt > Date.now() + 30000) return accessTokenCache.value;

  const authorization = Buffer.from(`${paypalClientId}:${paypalClientSecret}`, "utf8").toString("base64");
  let response;
  try {
    response = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
  } catch {
    throw new Error("paypal-auth-unreachable");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || typeof result.access_token !== "string") {
    const error = new Error("paypal-auth-failed");
    error.status = response.status;
    error.paypalDiagnostics = getSafePaypalDiagnostics(result);
    throw error;
  }
  accessTokenCache = {
    value: result.access_token,
    expiresAt: Date.now() + Number(result.expires_in || 0) * 1000
  };
  return accessTokenCache.value;
}

async function paypalRequest(endpoint, options = {}) {
  const accessToken = await getAccessToken();
  let response;
  try {
    response = await fetch(`${paypalApiBase}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error("paypal-api-unreachable");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error("paypal-api-failed");
    error.status = response.status;
    error.paypalDiagnostics = getSafePaypalDiagnostics(result);
    throw error;
  }
  return result;
}

function getVerifiedOrderProduct(order, expectation) {
  if (!order || !Array.isArray(order.purchase_units) || order.purchase_units.length !== 1) {
    throw new Error("paypal-order-invalid");
  }
  const unit = order.purchase_units[0];
  const product = productsById.get(unit.custom_id);
  if (!expectation || !product || unit.reference_id !== product.id || product.id !== expectation.productId) {
    throw new Error("paypal-order-product-invalid");
  }
  const orderAmountCents = toCents(unit.amount && unit.amount.value);
  if (unit.amount.currency_code !== catalog.currency || orderAmountCents !== expectation.amountCents) {
    throw new Error("paypal-order-amount-invalid");
  }
  return { unit, product, orderAmountCents };
}

function getCompletedCapture(order, verifiedOrder) {
  const captures = verifiedOrder.unit.payments && verifiedOrder.unit.payments.captures;
  if (!Array.isArray(captures) || captures.length !== 1) throw new Error("paypal-capture-invalid");
  const capture = captures[0];
  const captureAmountCents = toCents(capture.amount && capture.amount.value);
  if (capture.status !== "COMPLETED" || captureAmountCents !== verifiedOrder.orderAmountCents ||
      !capture.amount || capture.amount.currency_code !== catalog.currency || typeof capture.id !== "string") {
    throw new Error("paypal-capture-not-verified");
  }
  return { verified: true, status: "COMPLETED", orderId: order.id, captureId: capture.id };
}

async function createPaypalOrder(productId, quantity, idempotencyKey) {
  const product = productsById.get(productId);

  if (!product) {
    throw new Error("product-not-found");
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new Error("invalid-quantity");
  }

  
const permiteStockDesconocido =
  ["DEMO-02", "DEMO-03"].includes(product.id) &&
  product.stock === null;

if (!permiteStockDesconocido) {
  if (!Number.isSafeInteger(product.stock) || product.stock < quantity) {
    throw new Error(
      product.stock === null
        ? "product-availability-unknown"
        : "insufficient-stock"
    );
  }
}


  const price = currentPrice(product, new Date(), catalog.timeZone);
  const totalCents = Math.round(price * 100) * quantity;

  if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
    throw new Error("paypal-order-amount-invalid");
  }

  const amount = (totalCents / 100).toFixed(2);

  const order = await paypalRequest("/v2/checkout/orders", {
    method: "POST",
    headers: {
      "PayPal-Request-Id": idempotencyKey
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: product.id,
          custom_id: product.id,
          description: product.name,
          amount: {
            currency_code: catalog.currency,
            value: amount
          }
        }
      ]
    })
  });

  
if (
  !order ||
  typeof order.id !== "string" ||
  order.status !== "CREATED"
) {
  console.error("[PayPal Sandbox] Respuesta de creación:", {
    tieneRespuesta: Boolean(order),
    tieneId: Boolean(order && typeof order.id === "string"),
    estado: order && typeof order.status === "string" ? order.status : "sin-estado",
    campos: order && typeof order === "object" ? Object.keys(order) : []
  });

  throw new Error("paypal-order-create-invalid");
}


  expectedOrders.set(order.id, {
    productId,
    quantity,
    amountCents: totalCents
  });

  return { id: order.id };
}

async function captureAndVerifyOrder(orderId) {
  const expectation = expectedOrders.get(orderId);

  if (!expectation) {
    throw new Error("paypal-order-invalid");
  }

  const order = await paypalRequest(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    { method: "GET" }
  );

  // Si PayPal ya completó el pago, verificarlo sin intentar capturarlo otra vez.
  if (order.status === "COMPLETED") {
    const completedDetails = getVerifiedOrderProduct(order, expectation);
    const result = getCompletedCapture(order, completedDetails);
    expectedOrders.delete(orderId);
    return result;
  }

  if (order.status !== "APPROVED") {
    throw new Error("paypal-order-not-approved");
  }

  getVerifiedOrderProduct(order, expectation);

  const captureResult = await paypalRequest(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    { method: "POST", body: JSON.stringify({}) }
  );

  if (
    captureResult.status !== "COMPLETED" ||
    !Array.isArray(captureResult.purchase_units)
  ) {
    throw new Error("paypal-capture-not-completed");
  }

  const verifiedOrder = await paypalRequest(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    { method: "GET" }
  );

  if (verifiedOrder.status !== "COMPLETED") {
    throw new Error("paypal-capture-not-verified");
  }

  const verifiedDetails = getVerifiedOrderProduct(
    verifiedOrder,
    expectation
  );

  const result = getCompletedCapture(verifiedOrder, verifiedDetails);

  expectedOrders.delete(orderId);

  return result;
}
app.disable("x-powered-by");
app.use((req, res, next) => {
  const origin = req.get("Origin");
  if (origin && origin !== frontendOrigin) {
    logPaymentFailure("request", new Error("origin-not-allowed"));
    return res.status(403).json({ error: "origin_not_allowed" });
  }
  if (origin === frontendOrigin) {
    res.setHeader("Access-Control-Allow-Origin", frontendOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key");
  }
  if (req.method === "OPTIONS") return origin === frontendOrigin ? res.sendStatus(204) : res.sendStatus(403);
  next();
});
app.use(express.json({ limit: "10kb", strict: true }));

app.get("/api/config", (req, res) => {
  res.json({
    configured: paypalConfigured,
    clientIdConfigured: Boolean(paypalClientId),
    clientId: paypalConfigured ? paypalClientId : null,
    currency: catalog.currency
  });
});

app.post("/api/orders", async (req, res) => {
  if (req.get("Origin") !== frontendOrigin) {
    logPaymentFailure("order-create", new Error("origin-not-allowed"));
    return res.status(403).json({ error: "origin_not_allowed" });
  }
  const idempotencyKey = req.get("Idempotency-Key");
  if (typeof idempotencyKey !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
    logPaymentFailure("order-create", new Error("invalid-idempotency-key"));
    return res.status(400).json({ error: "invalid_idempotency_key" });
  }
  const { productId, quantity } = req.body || {};
  if (typeof productId !== "string" || !productsById.has(productId)) {
    logPaymentFailure("order-create", new Error("product-not-found"));
    return res.status(404).json({ error: "product_not_found" });
  }
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    logPaymentFailure("order-create", new Error("invalid-quantity"));
    return res.status(400).json({ error: "invalid_quantity" });
  }
  
const product = productsById.get(productId);

const permiteStockDesconocido =
  ["DEMO-02", "DEMO-03"].includes(product.id) &&
  product.stock === null;

if (!permiteStockDesconocido) {
  if (!Number.isSafeInteger(product.stock) || product.stock < 0) {
    logPaymentFailure("order-create", new Error("product-availability-unknown"));
    return res.status(409).json({ error: "product_availability_unknown" });
  }

  if (quantity > product.stock) {
    logPaymentFailure("order-create", new Error("insufficient-stock"));
    return res.status(409).json({ error: "insufficient_stock" });
  }
}

  if (!paypalConfigured) {
    logPaymentFailure("order-create", new Error("paypal-not-configured"));
    return res.status(503).json({ error: "paypal_not_configured" });
  }
  try {
    res.status(201).json(await createPaypalOrder(productId, quantity, idempotencyKey));
  } catch (error) {
    logPaymentFailure("order-create", error);
    const localErrors = ["product-not-found", "invalid-quantity", "product-availability-unknown", "insufficient-stock", "idempotency-key-conflict"];
    const isLocalError = localErrors.includes(error && error.message);
    const status = isLocalError && Number.isInteger(error.status) ? error.status : 502;
    const safeError = isLocalError
      ? error.message.replaceAll("-", "_")
      : "paypal_order_creation_failed";
    res.status(status).json({ error: safeError });
  }
});

app.post("/api/orders/:orderId/capture", async (req, res) => {
  if (req.get("Origin") !== frontendOrigin) {
    logPaymentFailure("capture", new Error("origin-not-allowed"));
    return res.status(403).json({ error: "origin_not_allowed" });
  }
  if (!paypalConfigured) {
    logPaymentFailure("capture", new Error("paypal-not-configured"));
    return res.status(503).json({ error: "paypal_not_configured" });
  }
  const orderId = req.params.orderId;
  if (!/^[A-Za-z0-9-]{1,64}$/.test(orderId)) {
    logPaymentFailure("capture", new Error("invalid-order-id"));
    return res.status(400).json({ error: "invalid_order_id" });
  }
  try {
    res.json(await captureAndVerifyOrder(orderId));
  } catch (error) {
    logPaymentFailure("capture", error);
    res.status(502).json({ error: "paypal_capture_verification_failed" });
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error && error.type === "entity.parse.failed") {
    logPaymentFailure("request", new Error("invalid-json"));
    return res.status(400).json({ error: "invalid_json" });
  }
  if (error && error.type === "entity.too.large") {
    logPaymentFailure("request", new Error("request-too-large"));
    return res.status(413).json({ error: "request_too_large" });
  }
  logPaymentFailure("request", error);
  return res.status(500).json({ error: "internal_server_error" });
});

app.listen(port, host, () => {
  console.log(`Crusanti PayPal Sandbox API listening at http://${host}:${port}`);
  if (!paypalConfigured) console.log("Sandbox credentials are not configured; checkout stays disabled.");
});
