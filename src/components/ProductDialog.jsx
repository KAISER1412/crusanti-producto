import { useEffect, useRef, useState } from "react";
import { currency, displayPrice, formatPrice, getOfferPricing, getOfferState, imageUrl } from "../catalog";
import Icon from "./Icon";
import OfferStatus from "./OfferStatus";
import PayPalCheckout from "./PayPalCheckout";
import ImageLightbox from "./ImageLightbox";
import { calculateZoomPosition } from "../imageZoom";

export default function ProductDialog({ product, onClose, now }) {
  const dialogRef = useRef(null);
  const imageFrameRef = useRef(null);
  const mainImageRef = useRef(null);
  const touchGestureRef = useRef(null);
  const zoomPointerRef = useRef(null);
  const zoomPanelHoveredRef = useRef(false);
  const zoomHideTimeoutRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState(null);
  const [touchZoomActive, setTouchZoomActive] = useState(false);
  const gallery = product?.gallery?.length ? product.gallery : product?.mainImage ? [product.mainImage] : [];
  const selectedImage = gallery[imageIndex];
  const offerState = product ? getOfferState(product, now) : "invalid";
  const offerPricing = product ? getOfferPricing(product, offerState, now) : null;

  const cancelZoomHide = () => {
    if (zoomHideTimeoutRef.current !== null) {
      window.clearTimeout(zoomHideTimeoutRef.current);
      zoomHideTimeoutRef.current = null;
    }
  };

  const scheduleZoomHide = () => {
    cancelZoomHide();
    zoomHideTimeoutRef.current = window.setTimeout(() => {
      zoomHideTimeoutRef.current = null;
      if (zoomPanelHoveredRef.current) return;
      zoomPointerRef.current = null;
      setZoomPosition(null);
    }, 250);
  };

  const handleZoomPanelPointerEnter = (event) => {
    if (event.pointerType === "touch") return;
    zoomPanelHoveredRef.current = true;
    cancelZoomHide();
  };

  const handleZoomPanelPointerLeave = (event) => {
    if (event.pointerType === "touch") return;
    zoomPanelHoveredRef.current = false;
    if (!touchZoomActive) scheduleZoomHide();
  };

  const changeImage = (index) => {
    cancelZoomHide();
    zoomPanelHoveredRef.current = false;
    setImageIndex((index + gallery.length) % gallery.length);
    setImageFailed(false);
    zoomPointerRef.current = null;
    setZoomPosition(null);
  };

  const updateZoomAt = (clientX, clientY, pointerType = "mouse") => {
    zoomPointerRef.current = { clientX, clientY, pointerType };
    const image = mainImageRef.current;
    if (!selectedImage || imageFailed || !image?.naturalWidth || !image.naturalHeight) {
      setZoomPosition(null);
      return;
    }

    const nextZoomPosition = calculateZoomPosition({
      imageRect: image.getBoundingClientRect(),
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      clientX,
      clientY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
    if (!nextZoomPosition) {
      zoomPointerRef.current = null;
      setZoomPosition(null);
      return;
    }
    setZoomPosition(nextZoomPosition);
  };

  useEffect(() => {
    if (!zoomPosition) return undefined;
    const updateForViewport = () => {
      const pointer = zoomPointerRef.current;
      if (pointer) updateZoomAt(pointer.clientX, pointer.clientY, pointer.pointerType);
    };
    const dialog = dialogRef.current;
    window.addEventListener("resize", updateForViewport);
    dialog?.addEventListener("scroll", updateForViewport, { passive: true });
    return () => {
      window.removeEventListener("resize", updateForViewport);
      dialog?.removeEventListener("scroll", updateForViewport);
    };
    // The handler is replaced when the selected image or zoom state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(zoomPosition), imageIndex, imageFailed, touchZoomActive]);

  const handleImagePointerMove = (event) => {
    if (event.pointerType === "touch") {
      if (!touchZoomActive) return;
      const gesture = touchGestureRef.current;
      if (gesture && Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > 7) {
        gesture.moved = true;
      }
    }
    updateZoomAt(event.clientX, event.clientY, event.pointerType);
  };

  const handleImagePointerLeave = (event) => {
    if (event.pointerType !== "touch" && !touchZoomActive) {
      scheduleZoomHide();
    }
  };

  const handleImagePointerEnter = (event) => {
    if (event.pointerType === "touch") return;
    cancelZoomHide();
    handleImagePointerMove(event);
  };

  const toggleTouchZoom = () => {
    cancelZoomHide();
    zoomPanelHoveredRef.current = false;
    if (touchZoomActive) {
      setTouchZoomActive(false);
      zoomPointerRef.current = null;
      setZoomPosition(null);
      return;
    }
    setTouchZoomActive(true);
    window.requestAnimationFrame(() => {
      const frame = imageFrameRef.current?.getBoundingClientRect();
      if (frame) updateZoomAt(frame.left + frame.width / 2, frame.top + frame.height / 2, "touch");
    });
  };

  const showImageLightbox = () => {
    if (!selectedImage) return;
    cancelZoomHide();
    zoomPanelHoveredRef.current = false;
    zoomPointerRef.current = null;
    setZoomPosition(null);
    setTouchZoomActive(false);
    setLightboxOpen(true);
  };

  const openLightbox = (event) => {
    const touchGesture = touchGestureRef.current;
    touchGestureRef.current = null;
    if (event.target.closest?.("button")) return;
    if (touchGesture?.moved) {
      event.preventDefault();
      return;
    }
    showImageLightbox();
  };

  const closeLightbox = () => setLightboxOpen(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [product]);

  useEffect(() => {
    cancelZoomHide();
    setImageIndex(0);
    setImageFailed(false);
    setLightboxOpen(false);
    zoomPointerRef.current = null;
    setZoomPosition(null);
    setTouchZoomActive(false);
    touchGestureRef.current = null;
    zoomPanelHoveredRef.current = false;
    return () => cancelZoomHide();
  }, [product]);

  return (
    <dialog
      className={`product-dialog${lightboxOpen ? " is-lightbox-open" : ""}`}
      ref={dialogRef}
      aria-label={product ? `Ficha de ${product.name}` : "Ficha de producto"}
      onClose={onClose}
      onCancel={(event) => {
        if (lightboxOpen) {
          event.preventDefault();
          event.stopPropagation();
          closeLightbox();
        }
      }}
    >
      {product ? (
        <div className="dialog-shell">
          <div className="dialog-topbar">
            <span>Detalle del producto <i aria-hidden="true">/</i> Crusanti México</span>
            <button className="icon-button dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar ficha">
              <Icon name="close" />
            </button>
          </div>
          <div className="dialog-content">
            <div className="detail-gallery">
              <div className={`detail-gallery-stage${gallery.length > 1 ? " has-thumbnails" : ""}`}>
              <div
                ref={imageFrameRef}
                className={`detail-main-image${touchZoomActive ? " is-touch-zoom-active" : ""}`}
                role="group"
                tabIndex={selectedImage ? 0 : undefined}
                aria-label={`${product.name}, imagen ${imageIndex + 1} de ${gallery.length}. Pasa el cursor para ampliar o pulsa para abrir a pantalla completa.`}
                aria-describedby="detail-image-help detail-zoom-help"
                aria-haspopup="dialog"
                aria-keyshortcuts="Enter Space"
                onClick={openLightbox}
                onPointerEnter={handleImagePointerEnter}
                onPointerDownCapture={(event) => {
                  touchGestureRef.current = event.pointerType === "touch" && touchZoomActive
                    ? { startX: event.clientX, startY: event.clientY, moved: false }
                    : null;
                }}
                onPointerMove={handleImagePointerMove}
                onPointerLeave={handleImagePointerLeave}
                onPointerCancel={() => { touchGestureRef.current = null; }}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
                  event.preventDefault();
                  showImageLightbox();
                }}
              >
                {selectedImage && !imageFailed ? (
                  <img
                    ref={mainImageRef}
                    src={imageUrl(selectedImage)}
                    alt={`${product.name}, vista ${imageIndex + 1}`}
                    onLoad={() => {
                      const pointer = zoomPointerRef.current;
                      if (pointer) updateZoomAt(pointer.clientX, pointer.clientY, pointer.pointerType);
                    }}
                    onError={() => { setImageFailed(true); zoomPointerRef.current = null; setZoomPosition(null); }}
                  />
                ) : (
                  <div className="image-placeholder" role="img" aria-label={`Imagen pendiente para ${product.name}`}>
                    <Icon name="box" size={36} /><span>Imagen pendiente</span>
                  </div>
                )}
                {zoomPosition && selectedImage && !imageFailed ? (
                  <span
                    className="detail-zoom-selection"
                    aria-hidden="true"
                    style={{
                      left: zoomPosition.selectionLeft,
                      top: zoomPosition.selectionTop,
                      width: zoomPosition.selectionWidth,
                      height: zoomPosition.selectionHeight,
                    }}
                  />
                ) : null}
                <button
                  className="detail-zoom-toggle"
                  type="button"
                  aria-label={touchZoomActive ? "Desactivar zoom táctil" : "Activar zoom táctil"}
                  aria-describedby="detail-zoom-help"
                  aria-pressed={touchZoomActive}
                  onClick={toggleTouchZoom}
                >
                  <Icon name="search" size={15} />
                  <span>{touchZoomActive ? "Desactivar zoom" : "Activar zoom"}</span>
                </button>
                {selectedImage ? (
                  <button
                    className="detail-lightbox-toggle"
                    type="button"
                    aria-label={`Ampliar imagen de ${product.name}`}
                    title="Ampliar imagen"
                    onClick={showImageLightbox}
                  >
                    <Icon name="zoom" size={18} />
                  </button>
                ) : null}
                <span className="image-counter">{gallery.length ? `${String(imageIndex + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}` : "VISTA"}</span>
              </div>
              {gallery.length > 1 ? (
                <div className="gallery-thumbnails" role="group" aria-label="Miniaturas del producto">
                  {gallery.map((image, index) => (
                    <button
                      className={`gallery-thumb${imageIndex === index ? " is-selected" : ""}`}
                      key={image}
                      type="button"
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-pressed={imageIndex === index}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse" || event.pointerType === "pen") changeImage(index);
                      }}
                      onClick={() => changeImage(index)}
                    >
                      <img src={imageUrl(image)} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              ) : null}
              </div>
              <p className="visually-hidden" id="detail-image-help">Haz clic en la imagen o pulsa Enter o espacio para abrir el visor de pantalla completa.</p>
              <p className="visually-hidden" id="detail-zoom-help">En una pantalla táctil, activa el zoom y desliza un dedo sobre la imagen. Un toque sin deslizar abre el visor completo.</p>
              <div className="detail-image-note">
                <Icon name={gallery.length ? "check" : "box"} size={14} />
                {gallery.length ? "Imágenes del catálogo disponibles" : "Fotografías del producto pendientes de validación"}
              </div>
            </div>

            <div className="detail-information">
              <div className="detail-label-row"><span>{product.category}</span>{product.isDemo ? <span className="demo-chip">Demostración</span> : null}</div>
              <h2 id="product-detail-title">{product.name}</h2>
              <p className="detail-model">ID de catálogo <strong>{product.id}</strong></p>
              <p className="detail-description">{product.description}</p>

              <div className="detail-price-block">
                {offerState === "active" && offerPricing ? <del>{formatPrice(offerPricing.originalPrice)}</del> : null}
                <strong>{formatPrice(displayPrice(product, offerState, now))}</strong>
                <span className="detail-price-meta">Moneda: {currency}{offerState === "active" && offerPricing ? <b className="discount-pill">-{offerPricing.discountPercent}%</b> : null}</span>
              </div>

              <div className="detail-stock-row">
                <span className={`stock-indicator${!Number.isSafeInteger(product.stock) ? " is-unknown" : product.stock > 0 ? " is-available" : " is-unavailable"}`}><i aria-hidden="true" />
                  {product.stock == null ? "Existencia por confirmar" : product.stock > 0 ? "Disponible" : "Agotado"}
                </span>
                <strong>{product.stock == null ? "Cantidad pendiente" : `${product.stock} unidades`}</strong>
              </div>

              <OfferStatus product={product} now={now} />

              <section className="feature-section" aria-labelledby="features-title">
                <h3 id="features-title">Información del equipo</h3>
                <dl>
                  {Object.entries(product.features || {}).map(([label, value]) => (
                    <div className="feature-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
              </section>

              <PayPalCheckout product={product} offerState={offerState} now={now} />
            </div>
          </div>
          <div
            className={`detail-zoom-panel${zoomPosition ? " is-visible" : ""}`}
            aria-hidden="true"
            onPointerEnter={handleZoomPanelPointerEnter}
            onPointerLeave={handleZoomPanelPointerLeave}
            style={zoomPosition ? {
              left: zoomPosition.panelLeft,
              top: zoomPosition.panelTop,
              width: zoomPosition.panelWidth,
              height: zoomPosition.panelHeight,
            } : undefined}
          >
            {zoomPosition && selectedImage && !imageFailed ? (
              <span
                className="detail-zoom-panel-viewport"
                style={{
                  width: zoomPosition.zoomViewportSize,
                  height: zoomPosition.zoomViewportSize,
                  backgroundImage: `url("${imageUrl(selectedImage)}")`,
                  backgroundSize: `${zoomPosition.backgroundWidth}px ${zoomPosition.backgroundHeight}px`,
                  backgroundPosition: `${zoomPosition.backgroundX}px ${zoomPosition.backgroundY}px`,
                }}
              />
            ) : null}
          </div>
          <ImageLightbox
            open={lightboxOpen}
            images={gallery}
            imageIndex={imageIndex}
            productName={product.name}
            returnFocusRef={imageFrameRef}
            onChange={changeImage}
            onClose={closeLightbox}
          />
        </div>
      ) : null}
    </dialog>
  );
}
