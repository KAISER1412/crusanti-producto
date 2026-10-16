import { catalogTimeZone, formatCountdown, formatOfferDate, formatPrice, getCountdownParts, getOfferCountdown, getOfferPricing, getOfferSelection } from "../catalog";

const timeZoneLabel = catalogTimeZone;

function OfferDates({ start, end }) {
  return (
    <p className="offer-dates">
      <span>Inicio: {start}</span><span aria-hidden="true"> · </span><span>fin: {end}</span>
      <span className="offer-timezone">Hora local: {timeZoneLabel}</span>
    </p>
  );
}

export default function OfferStatus({ product, compact = false, now = Date.now() }) {
  const countdown = getOfferCountdown(product, now);
  if (!countdown) return null;

  const { state } = countdown;
  const selection = getOfferSelection(product, now);
  const offer = selection?.offer || product;
  const pricing = getOfferPricing(product, state, now);
  const labels = {
    active: "Oferta vigente",
    upcoming: "Próxima oferta",
    finished: "Oferta finalizada",
    invalid: "Fechas por confirmar",
  };
  const start = formatOfferDate(offer.offerStart);
  const end = formatOfferDate(offer.offerEnd);
  const countdownLabel = state === "upcoming" ? "La oferta comienza en" : "La oferta termina en";
  const countdownParts = getCountdownParts(countdown.secondsRemaining);

  if (state === "finished") {
    return (
      <div className={`offer-panel offer-finished${compact ? " offer-compact" : ""}`}>
        <div className="offer-heading">
          <span className="offer-dot" aria-hidden="true" />
          <span>{labels.finished}</span>
        </div>
        <OfferDates start={start} end={end} />
      </div>
    );
  }

  return (
    <div className={`offer-panel offer-${state}${compact ? " offer-compact" : ""}`}>
      <div className="offer-heading">
        <span className="offer-dot" aria-hidden="true" />
        <span>{labels[state]}</span>
        {state === "active" && pricing ? <strong>{pricing.discountPercent}% OFF</strong> : null}
      </div>
      <OfferDates start={start} end={end} />
      {state === "upcoming" && pricing ? (
        <div className="offer-future-price" aria-label={`Al comenzar: precio original ${formatPrice(pricing.originalPrice)}, precio de oferta ${formatPrice(pricing.finalPrice)}, descuento ${pricing.discountPercent} por ciento`}>
          <span className="offer-future-price-label">Precio promocional al comenzar</span>
          <del>{formatPrice(pricing.originalPrice)}</del>
          <strong>{formatPrice(pricing.finalPrice)}</strong>
          <b className="discount-pill">-{pricing.discountPercent}%</b>
        </div>
      ) : null}
      {state === "invalid" ? <p>Verifica las fechas antes de aplicar una oferta.</p> : null}
      {state === "upcoming" || state === "active" ? (
        <div className="offer-countdown" role="timer" aria-label={`${countdownLabel} ${formatCountdown(countdown.secondsRemaining)}`} aria-live="off">
          <span className="offer-countdown-label">{countdownLabel}</span>
          <div className="offer-countdown-units" aria-hidden="true">
            {countdownParts?.map(({ value, label }) => (
              <span className="offer-countdown-unit" key={label}>
                <strong>{value}</strong><span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
