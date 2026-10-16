import { useState } from "react";
import { displayPrice, formatPrice, getOfferPricing, getOfferState, imageUrl } from "../catalog";
import Icon from "./Icon";
import OfferStatus from "./OfferStatus";

export default function ProductCard({ product, onOpen, now }) {
  const [imageFailed, setImageFailed] = useState(false);
  const offerState = getOfferState(product, now);
  const offerPricing = getOfferPricing(product, offerState, now);
  const hasKnownStock = Number.isSafeInteger(product.stock);

  return (
    <article className="product-card flex flex-col">
      <div className="product-card-media">
        {product.mainImage && !imageFailed ? (
          <img
            src={imageUrl(product.mainImage)}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="image-placeholder" role="img" aria-label={`Imagen pendiente para ${product.name}`}>
            <Icon name="box" size={32} /><span>Imagen pendiente</span>
          </div>
        )}
        <span className={`stock-chip${!hasKnownStock ? " is-unknown" : product.stock > 0 ? " is-available" : " is-sold-out"}`}>
          <i aria-hidden="true" />{!hasKnownStock ? "Stock por confirmar" : product.stock > 0 ? "Disponible" : "Agotado"}
        </span>
        {product.isDemo ? <span className="demo-chip">Demostración</span> : null}
      </div>

      <div className="product-card-content">
        <div className="product-card-meta"><span>{product.category}</span><span>{product.id}</span></div>
        <h3>{product.name}</h3>
        <p className="product-summary">{product.description}</p>

        <div className="product-card-price">
          <div>
            {offerState === "active" && offerPricing ? <del>{formatPrice(offerPricing.originalPrice)}</del> : null}
            <strong>{formatPrice(displayPrice(product, offerState, now))}</strong>
          </div>
          {offerState === "active" && offerPricing ? <span className="discount-pill">-{offerPricing.discountPercent}%</span> : null}
        </div>

        <OfferStatus product={product} compact now={now} />
        <div className="product-card-bottom">
          <span className="stock-copy">
            <Icon name="box" size={15} />{hasKnownStock ? `${product.stock} unidades` : "Cantidad por confirmar"}
          </span>
          <button className="button button-outline" type="button" onClick={() => onOpen(product)} aria-label={`Ver detalle de ${product.name}`}>
            Ver producto <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
