const formatters = new Map();

function getFormatter(timeZone) {
  if (!formatters.has(timeZone)) {
    formatters.set(timeZone, new Intl.DateTimeFormat("en", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }));
  }
  return formatters.get(timeZone);
}

export function parseCatalogDate(value, timeZone = "America/Mexico_City") {
  // Catalog date strings have no UTC offset: interpret them as wall-clock
  // times in the catalog's configured IANA time zone.
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;

  const desired = match.slice(1).map(Number);
  const desiredAsUtc = Date.UTC(
    desired[0], desired[1] - 1, desired[2], desired[3], desired[4], desired[5],
  );
  let timestamp = desiredAsUtc;
  let formatter;
  try {
    formatter = getFormatter(timeZone);
  } catch {
    return null;
  }

  for (let pass = 0; pass < 3; pass += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(timestamp)).map(({ type, value: part }) => [type, part]),
    );
    const renderedAsUtc = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour), Number(parts.minute), Number(parts.second),
    );
    timestamp += desiredAsUtc - renderedAsUtc;
  }

  const check = Object.fromEntries(
    formatter.formatToParts(new Date(timestamp)).map(({ type, value: part }) => [type, part]),
  );
  const actual = [check.year, check.month, check.day, check.hour, check.minute, check.second].map(Number);
  if (desired.some((part, index) => part !== actual[index])) return null;
  return new Date(timestamp);
}

function configuredOffers(product) {
  if (!product || typeof product !== "object") return [];
  const hasLegacyOffer = ["discountPercent", "offerStart", "offerEnd"]
    .some((key) => product[key] !== undefined && product[key] !== null && product[key] !== "");
  const legacyOffers = hasLegacyOffer ? [product] : [];
  const scheduledOffers = Array.isArray(product.offers)
    ? product.offers
    : product.offers == null || product.offers === "" ? [] : [product.offers];
  return [...legacyOffers, ...scheduledOffers];
}

export function hasConfiguredOffer(product) {
  return configuredOffers(product).length > 0;
}

export function getOfferSelection(product, now = Date.now(), timeZone = "America/Mexico_City") {
  const configured = configuredOffers(product);
  if (!configured.length) return null;
  if (!Number.isFinite(now)) return { state: "invalid", offer: null, start: null, end: null };

  const seen = new Set();
  const valid = [];
  for (const offer of configured) {
    if (!offer || typeof offer !== "object") continue;
    const discountPercent = Number(offer.discountPercent);
    const start = parseCatalogDate(offer.offerStart, timeZone);
    const end = parseCatalogDate(offer.offerEnd, timeZone);
    if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent >= 100 ||
        !start || !end || end.getTime() <= start.getTime()) continue;

    const key = `${offer.offerStart}\u0000${offer.offerEnd}\u0000${discountPercent}`;
    if (seen.has(key)) continue;
    seen.add(key);
    valid.push({ offer, start, end });
  }

  if (!valid.length) return { state: "invalid", offer: null, start: null, end: null };

  const active = valid.filter(({ start, end }) => start.getTime() <= now && now < end.getTime());
  if (active.length) {
    const selected = active.reduce((best, candidate) => (
      candidate.start.getTime() > best.start.getTime() ? candidate : best
    ), active[0]);
    return { ...selected, state: "active" };
  }

  const upcoming = valid.filter(({ start }) => start.getTime() > now);
  if (upcoming.length) {
    const selected = upcoming.reduce((best, candidate) => (
      candidate.start.getTime() < best.start.getTime() ? candidate : best
    ), upcoming[0]);
    return { ...selected, state: "upcoming" };
  }

  const selected = valid.reduce((best, candidate) => (
    candidate.end.getTime() > best.end.getTime() ? candidate : best
  ), valid[0]);
  return { ...selected, state: "finished" };
}

export function getOfferState(product, now = Date.now(), timeZone = "America/Mexico_City") {
  return getOfferSelection(product, now, timeZone)?.state ?? "none";
}

export function getOfferCountdown(product, now = Date.now(), timeZone = "America/Mexico_City") {
  const selection = getOfferSelection(product, now, timeZone);
  if (!selection) return null;
  if (selection.state === "finished") return { state: selection.state, target: null, secondsRemaining: 0 };
  if (selection.state === "invalid") return { state: selection.state, target: null, secondsRemaining: null };

  const target = selection.state === "upcoming" ? selection.start : selection.end;
  return {
    state: selection.state,
    target,
    secondsRemaining: Math.max(0, Math.ceil((target.getTime() - now) / 1000)),
  };
}

export function formatCountdown(seconds) {
  if (!Number.isFinite(seconds)) return "";
  const total = Math.max(0, Math.ceil(seconds));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;
  const pad = (part) => String(part).padStart(2, "0");
  return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
}

export function getCountdownParts(seconds) {
  if (!Number.isFinite(seconds)) return null;
  const total = Math.max(0, Math.ceil(seconds));
  const pad = (part) => String(part).padStart(2, "0");
  return [
    { value: String(Math.floor(total / 86400)), label: "días" },
    { value: pad(Math.floor((total % 86400) / 3600)), label: "horas" },
    { value: pad(Math.floor((total % 3600) / 60)), label: "minutos" },
    { value: pad(total % 60), label: "segundos" },
  ];
}

export function formatOfferDate(value, timeZone = "America/Mexico_City") {
  const date = parseCatalogDate(value, timeZone);
  if (!date) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-MX", {
    timeZone,
    dateStyle: "long",
    timeStyle: "medium",
    hourCycle: "h23",
  }).format(date);
}
