import catalog from "../backend/catalog.json";
import {
  formatCountdown,
  getCountdownParts,
  formatOfferDate as formatDate,
  getOfferCountdown as getCountdown,
  getOfferSelection as getSelection,
  getOfferState as getState,
  hasConfiguredOffer,
  parseCatalogDate as parseDate,
} from "./offerTime";

export const products = catalog.products;
export const currency = catalog.currency;
export const catalogTimeZone = catalog.timeZone;

export function parseCatalogDate(value) {
  return parseDate(value, catalogTimeZone);
}

export function getOfferState(product, now = Date.now()) {
  return getState(product, now, catalogTimeZone);
}

export function getOfferSelection(product, now = Date.now()) {
  return getSelection(product, now, catalogTimeZone);
}

export function getOfferCountdown(product, now = Date.now()) {
  return getCountdown(product, now, catalogTimeZone);
}

export function formatOfferDate(value) {
  return formatDate(value, catalogTimeZone);
}

export { formatCountdown, getCountdownParts, hasConfiguredOffer };

export function formatPrice(value) {
  if (value == null || !Number.isFinite(Number(value))) return "Precio por confirmar";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function discountedPrice(product, offer = getOfferSelection(product)?.offer) {
  const price = Number(product?.price);
  const discountPercent = Number(offer?.discountPercent);
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent >= 100) {
    return null;
  }
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}

export function getOfferPricing(product, offerState = getOfferState(product), now = Date.now()) {
  if (offerState !== "active" && offerState !== "upcoming") return null;
  const selection = getOfferSelection(product, now);
  if (!selection || selection.state !== offerState) return null;

  const originalPrice = Number(product?.price);
  const finalPrice = discountedPrice(product, selection.offer);
  if (!Number.isFinite(originalPrice) || finalPrice == null || finalPrice <= 0 || finalPrice >= originalPrice) return null;

  // Report the rate represented by the displayed original and discounted prices.
  const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  if (discountPercent <= 0 || discountPercent >= 100) return null;

  return { originalPrice, finalPrice, discountPercent };
}

export function displayPrice(product, offerState = getOfferState(product), now = Date.now()) {
  const pricing = getOfferPricing(product, offerState, now);
  return offerState === "active" && pricing ? pricing.finalPrice : product.price;
}

export function categoryGroup(category = "") {
  const normalized = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized.includes("grua")) return "Grúas";
  if (normalized.includes("elevacion")) return "Elevación";
  if (normalized.includes("carga")) return "Carga";
  if (normalized.includes("accesorio")) return "Accesorios";
  if (normalized.includes("herramienta")) return "Herramientas";
  if (normalized.includes("maquinaria")) return "Maquinaria";
  return "Equipos industriales";
}

export function imageUrl(path) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, "").replace(/^\.\//, "");

  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

export function productSearchText(product) {
  return [
    product.id,
    product.name,
    product.category,
    product.description,
    ...Object.entries(product.features || {}).flat(),
  ].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
