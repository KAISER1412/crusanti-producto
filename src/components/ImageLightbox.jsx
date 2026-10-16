import { useEffect, useRef, useState } from "react";
import { imageUrl } from "../catalog";
import Icon from "./Icon";

export default function ImageLightbox({
  open,
  images,
  imageIndex,
  productName,
  returnFocusRef,
  onChange,
  onClose,
}) {
  const contentRef = useRef(null);
  const closeButtonRef = useRef(null);
  const pointerStartedOutsideRef = useRef(false);
  const callbacksRef = useRef(null);
  const [failedImage, setFailedImage] = useState(null);
  const [closing, setClosing] = useState(false);
  const image = images[imageIndex];
  const imageFailed = Boolean(image && failedImage === image);
  callbacksRef.current = { imageIndex, imageCount: images.length, onChange, onClose };

  useEffect(() => {
    if (!open) setClosing(false);
  }, [open]);

  useEffect(() => {
    if (!closing) return undefined;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => callbacksRef.current?.onClose(), reducedMotion ? 0 : 180);
    return () => window.clearTimeout(timeout);
  }, [closing]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      const current = callbacksRef.current;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        setClosing(true);
      } else if (event.key === "ArrowLeft" && current.imageCount > 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        current.onChange((current.imageIndex + current.imageCount - 1) % current.imageCount);
      } else if (event.key === "ArrowRight" && current.imageCount > 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        current.onChange((current.imageIndex + 1) % current.imageCount);
      } else if (event.key === "Tab") {
        const focusable = [...(contentRef.current?.querySelectorAll("button:not([disabled])") || [])];
        if (!focusable.length) {
          event.preventDefault();
          contentRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !contentRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !contentRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => {
        const focusTarget = returnFocusRef?.current || previouslyFocused;
        focusTarget?.focus?.({ preventScroll: true });
      });
    };
  }, [open, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      className={`image-lightbox${closing ? " is-closing" : ""}`}
      onPointerDownCapture={(event) => {
        pointerStartedOutsideRef.current = event.target === event.currentTarget;
      }}
      onPointerCancel={() => { pointerStartedOutsideRef.current = false; }}
      onClick={(event) => {
        const outsideClick = event.target === event.currentTarget && pointerStartedOutsideRef.current;
        pointerStartedOutsideRef.current = false;
        event.stopPropagation();
        if (outsideClick) setClosing(true);
      }}
    >
      <div
        ref={contentRef}
        className="image-lightbox-content"
        role="dialog"
        aria-modal="true"
        aria-label={`Visor de imágenes de ${productName}`}
        tabIndex={-1}
        onClick={(event) => {
          event.stopPropagation();
          if (!event.target.closest?.("img, .image-lightbox-control")) setClosing(true);
        }}
      >
        <button
          ref={closeButtonRef}
          className="image-lightbox-control image-lightbox-close"
          type="button"
          aria-label="Cerrar visor de imágenes"
          title="Cerrar"
          onClick={() => setClosing(true)}
        >
          <Icon name="close" size={22} />
        </button>

        {images.length > 1 ? (
          <button
            className="image-lightbox-control image-lightbox-previous"
            type="button"
            aria-label="Ver imagen anterior"
            title="Imagen anterior"
            onClick={() => onChange((imageIndex + images.length - 1) % images.length)}
          >
            <Icon name="chevron-left" size={28} />
          </button>
        ) : null}

        <figure className="image-lightbox-stage">
          {image && !imageFailed ? (
            <img
              src={imageUrl(image)}
              alt={`${productName}, imagen ${imageIndex + 1} de ${images.length}`}
              draggable="false"
              onError={() => setFailedImage(image)}
            />
          ) : (
            <div className="image-lightbox-error" role="status">
              <Icon name="box" size={36} />
              <span>{image ? "No se pudo cargar esta imagen." : "No hay una imagen disponible para mostrar."}</span>
            </div>
          )}
        </figure>

        {images.length > 1 ? (
          <button
            className="image-lightbox-control image-lightbox-next"
            type="button"
            aria-label="Ver imagen siguiente"
            title="Imagen siguiente"
            onClick={() => onChange((imageIndex + 1) % images.length)}
          >
            <Icon name="chevron-right" size={28} />
          </button>
        ) : null}

        <div className="image-lightbox-counter" aria-live="polite">
          {images.length ? `${imageIndex + 1} / ${images.length}` : "0 / 0"}
        </div>
      </div>
    </div>
  );
}
