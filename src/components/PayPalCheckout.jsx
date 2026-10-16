import { useEffect, useRef, useState } from "react";
import { displayPrice, formatPrice } from "../catalog";
import Icon from "./Icon";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://127.0.0.1:3001" : "")).replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 8000;
const SDK_TIMEOUT_MS = 15000;
let paypalSdkPromise;

function createIdempotencyKey() {
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function withTimeout(promise, milliseconds, code) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(code)), milliseconds);
    }),
  ]).finally(() => window.clearTimeout(timer));
}

async function requestJson(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("invalid_response");
    }
    if (!response.ok) throw new Error(data?.error || `http_${response.status}`);
    return data;
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("backend_timeout");
    if (error instanceof TypeError) throw new Error("backend_unavailable");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function loadPaypalSdk(config) {
  if (window.paypal && typeof window.paypal.Buttons === "function") return Promise.resolve(window.paypal);
  if (paypalSdkPromise) return paypalSdkPromise;

  paypalSdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("#crusanti-paypal-sdk");
    const script = existing || document.createElement("script");
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (error) reject(error);
      else resolve(window.paypal);
    };
    const timer = window.setTimeout(() => finish(new Error("paypal_sdk_timeout")), SDK_TIMEOUT_MS);
    script.id = "crusanti-paypal-sdk";
    script.async = true;
    script.onload = () => window.paypal?.Buttons
      ? finish()
      : finish(new Error("paypal_sdk_unavailable"));
    script.onerror = () => finish(new Error("paypal_sdk_unavailable"));
    if (!existing) {
      const query = new URLSearchParams({
        "client-id": config.clientId,
        currency: config.currency,
        intent: "capture",
        components: "buttons",
        "disable-funding": "card",
      });
      script.src = `https://www.paypal.com/sdk/js?${query.toString()}`;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    document.querySelector("#crusanti-paypal-sdk")?.remove();
    paypalSdkPromise = undefined;
    throw error;
  });

  return paypalSdkPromise;
}

function paymentMessage(error) {
  const messages = {
    paypal_receipt_verification_failed: "El servidor no pudo verificar el pago para generar el comprobante.",
    backend_timeout: `La API ${API_BASE} no respondió en 8 segundos. Revisa que el backend esté iniciado y vuelve a intentar.`,
    backend_unavailable: `No se pudo conectar con ${API_BASE}. Inicia el backend y comprueba que FRONTEND_ORIGIN permita exactamente la dirección abierta en el navegador.`,
    backend_origin_rejected: "El backend rechazó el origen de esta página. Comprueba que FRONTEND_ORIGIN coincida exactamente con la URL del navegador.",
    origin_not_allowed: "El backend rechazó el origen de esta página. Comprueba que FRONTEND_ORIGIN coincida exactamente con la URL del navegador.",
    invalid_response: "El backend respondió con datos no válidos. Comprueba que esté ejecutando la API de Crusanti.",
    paypal_not_configured: `El backend respondió en ${API_BASE}, pero PayPal Sandbox no está configurado allí. Configura credenciales Sandbox en backend/.env y reinicia el backend; el Client Secret no debe ir en una variable VITE_*.`,
    product_not_found: "El producto no está en el catálogo del servidor. Recarga la página para actualizar los datos.",
    product_availability_unknown: "La disponibilidad está por confirmar; no se puede iniciar el pago.",
    insufficient_stock: "El servidor indicó que no hay existencias suficientes. Actualiza el catálogo antes de continuar.",
    paypal_order_creation_failed: "PayPal no pudo crear la orden Sandbox. Revisa la configuración y vuelve a intentarlo.",
    paypal_capture_verification_failed: "El servidor no confirmó la captura. El pago no se marcó como exitoso.",
    paypal_sdk_timeout: "La carga del SDK de PayPal tardó demasiado. Revisa la conexión o vuelve a intentarlo.",
    paypal_sdk_unavailable: "No se pudo cargar PayPal. Revisa la conexión, bloqueadores o proxy y vuelve a intentarlo.",
  };
  return messages[error?.message] || "No se pudo inicializar el pago Sandbox. Reintenta o revisa la configuración del backend.";
}

export default function PayPalCheckout({ product, offerState, now }) {
  const hostRef = useRef(null);
  const idempotencyKeyRef = useRef(null);
  if (!idempotencyKeyRef.current) idempotencyKeyRef.current = createIdempotencyKey();
  const quantityRef = useRef(1);
  const [attempt, setAttempt] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState({ state: "loading", message: "Conectando con el backend de pagos..." });
  const [captureOrderId, setCaptureOrderId] = useState(null);
  // Los productos DEMO con stock desconocido permiten una sola unidad exclusivamente para pruebas Sandbox.
  const demoSingleUnit = product.isDemo === true && product.stock == null;
  const canPurchase = demoSingleUnit || (Number.isSafeInteger(product.stock) && product.stock > 0);
  const maxQuantity = demoSingleUnit ? 1 : product.stock;
  const displayedUnitPrice = displayPrice(product, offerState, now);

  useEffect(() => {
    quantityRef.current = 1;
    setQuantity(1);
    idempotencyKeyRef.current = createIdempotencyKey();
  }, [product.id]);

  useEffect(() => {
    let active = true;
    let buttons;
    const host = hostRef.current;

    if (host) host.replaceChildren();

    const initialize = async () => {
      if (!canPurchase) {
        setView({ state: "unavailable", message: "El inventario no está confirmado; el pago permanece desactivado." });
        return;
      }

      setView({ state: "loading", message: "Conectando con el backend de pagos..." });
      setCaptureOrderId(null);
      try {
        const config = await requestJson("/api/config");
        if (!config.configured || !config.clientId || !config.currency) {
          setView({ state: "error", message: paymentMessage(new Error("paypal_not_configured")) });
          return;
        }
        const paypal = await loadPaypalSdk(config);
        if (!active || !host) return;

        buttons = paypal.Buttons({
          fundingSource: paypal.FUNDING.PAYPAL,
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
          createOrder: async () => {
            setView({ state: "loading", message: "Creando una orden segura en el servidor..." });
            try {
              const result = await requestJson("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Idempotency-Key": idempotencyKeyRef.current,
                },
                body: JSON.stringify({ productId: product.id, quantity: quantityRef.current }),
              });
              if (typeof result.id !== "string" || !result.id) throw new Error("paypal_order_creation_failed");
              return result.id;
            } catch (error) {
              setView({ state: "error", message: paymentMessage(error) });
              throw error;
            }
          },
          onApprove: async (data) => {
            if (!active) return;
            setCaptureOrderId(data.orderID);
            setView({ state: "loading", message: "PayPal aprobó la orden. Verificando la captura en el servidor..." });
            try {
              const result = await requestJson(`/api/orders/${encodeURIComponent(data.orderID)}/capture`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "{}",
              });
              if (result.verified !== true || result.status !== "COMPLETED") {
                throw new Error("paypal_capture_verification_failed");
              }
              setView({ state: "success", message: `¡Compra exitosa! El servidor confirmó el pago de prueba. Referencia: ${result.orderId}.` });
            } catch (error) {
              setView({ state: "capture-error", message: paymentMessage(error) });
            }
          },
          onCancel: () => {
            idempotencyKeyRef.current = createIdempotencyKey();
            setView({ state: "cancelled", message: "Compra cancelada. No se confirmó ningún pago; puedes volver a intentarlo." });
          },
          onError: (error) => setView({ state: "error", message: paymentMessage(error) }),
        });

        await withTimeout(Promise.resolve(buttons.render(host)), SDK_TIMEOUT_MS, "paypal_sdk_timeout");
        if (active) setView({ state: "ready", message: "Selecciona PayPal para continuar con el pago de prueba." });
      } catch (error) {
        if (active) setView({ state: "error", message: paymentMessage(error) });
      }
    };

    void initialize();
    return () => {
      active = false;
      if (buttons && typeof buttons.close === "function") {
        try { Promise.resolve(buttons.close()).catch(() => {}); } catch { /* SDK cleanup */ }
      }
    };
  }, [product.id, product.stock, canPurchase, attempt]);

  const retryCapture = async () => {
    if (!captureOrderId) return;
    setView({ state: "loading", message: "Revisando de nuevo la captura en el servidor..." });
    try {
      const result = await requestJson(`/api/orders/${encodeURIComponent(captureOrderId)}/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (result.verified !== true || result.status !== "COMPLETED") {
        throw new Error("paypal_capture_verification_failed");
      }
      setView({ state: "success", message: `¡Compra exitosa! El servidor confirmó el pago de prueba. Referencia: ${result.orderId}.` });
    } catch (error) {
      setView({ state: "capture-error", message: paymentMessage(error) });
    }
  };

  const updateQuantity = (event) => {
  const value = Number(event.target.value);
  if (!Number.isSafeInteger(value) || value < 1 || !canPurchase) return;

  const nextQuantity = Math.min(value, maxQuantity);
  quantityRef.current = nextQuantity;
  idempotencyKeyRef.current = createIdempotencyKey();
  setQuantity(nextQuantity);
};

const continueShopping = () => {
  window.location.assign("/");
};

const buyAgain = () => {
  quantityRef.current = 1;
  setQuantity(1);
  setCaptureOrderId(null);
  idempotencyKeyRef.current = createIdempotencyKey();

  setView({
    state: "loading",
    message: "Preparando una nueva compra de prueba...",
  });

  setAttempt((value) => value + 1);
};
  return (
    <section className="checkout-panel" aria-labelledby="checkout-title" aria-busy={view.state === "loading"}>
      <div className="checkout-title-row">
        <div><span className="checkout-kicker">Proceso de pago</span><h3 id="checkout-title">PayPal Sandbox</h3></div>
        <span className="sandbox-tag">PRUEBA</span>
      </div>
      <p className="checkout-description">{demoSingleUnit ? "Producto de demostración: se permite una unidad para probar PayPal Sandbox; esto no confirma existencias reales." : "El servidor confirma el precio y el inventario antes de crear la orden."}</p>
      <div className="checkout-summary">
        <label htmlFor={`checkout-quantity-${product.id}`}>Cantidad</label>
        <input
          id={`checkout-quantity-${product.id}`}
          type="number"
          min="1"
          max={canPurchase ? maxQuantity : undefined}
          step="1"
          value={quantity}
          onChange={updateQuantity}
          disabled={!canPurchase || view.state === "loading" || Boolean(captureOrderId)}
          inputMode="numeric"
        />
        <span>Precio unitario</span><strong>{formatPrice(displayedUnitPrice)}</strong>
        <span>Total seleccionado</span><strong>{formatPrice(displayedUnitPrice * quantity)}</strong>
      </div>
      <div className="paypal-button-host" ref={hostRef} />
      <p className={`payment-message message-${view.state}`} role="status" aria-live="polite">{view.message}</p>
      {view.state === "success" && (
  <div className="checkout-result checkout-result-success" role="status" aria-live="polite">
    <span className="checkout-result-icon" aria-hidden="true">✓</span>
    <h4>¡Compra exitosa!</h4>
    <p>{view.message}</p>
    <div className="checkout-result-actions">
      <button type="button" className="checkout-action-primary" onClick={continueShopping}>
        Continuar comprando
      </button>
      <button type="button" className="checkout-action-secondary" onClick={buyAgain}>
        Volver a comprar
      </button>
    </div>
  </div>
)}

{view.state === "cancelled" && (
  <div className="checkout-result checkout-result-cancelled" role="status" aria-live="polite">
    <span className="checkout-result-icon" aria-hidden="true">×</span>
    <h4>Compra cancelada</h4>
    <p>Cancelaste el proceso de compra. No se confirmó ningún pago.</p>
    <div className="checkout-result-actions">
      <button type="button" className="checkout-action-primary" onClick={buyAgain}>
        Volver a intentar
      </button>
      <button type="button" className="checkout-action-secondary" onClick={continueShopping}>
        Continuar comprando
      </button>
    </div>
  </div>
)}
      {view.state === "error" || view.state === "cancelled" ? (
  <button
    className="text-button retry-button"
    type="button"
    onClick={() => {
      idempotencyKeyRef.current = createIdempotencyKey();
      setAttempt((value) => value + 1);
    }}
  >
    Reintentar conexión <span aria-hidden="true">↻</span>
  </button>
) : null}
      {view.state === "capture-error" ? (
        <button className="text-button retry-button" type="button" onClick={retryCapture}>
          Reintentar verificación <Icon name="arrow" size={14} />
        </button>
      ) : null}
      <p className="checkout-footnote">La confirmación aparece solo después de verificar la captura en el servidor.</p>
    </section>
  );
}
