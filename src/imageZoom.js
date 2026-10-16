export const ZOOM_FACTOR = 3.5;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function calculateZoomPosition({
  imageRect,
  naturalWidth,
  naturalHeight,
  clientX,
  clientY,
  viewportWidth,
  viewportHeight,
}) {
  if (
    !imageRect?.width || !imageRect?.height ||
    !naturalWidth || !naturalHeight ||
    !Number.isFinite(clientX) || !Number.isFinite(clientY)
  ) return null;

  // Map the pointer into the actual pixels rendered by object-fit: contain.
  const imageScale = Math.min(imageRect.width / naturalWidth, imageRect.height / naturalHeight);
  const displayedWidth = naturalWidth * imageScale;
  const displayedHeight = naturalHeight * imageScale;
  const imageOffsetX = (imageRect.width - displayedWidth) / 2;
  const imageOffsetY = (imageRect.height - displayedHeight) / 2;
  const pointerX = clientX - imageRect.left - imageOffsetX;
  const pointerY = clientY - imageRect.top - imageOffsetY;

  // Ignore the letterbox bands around non-square images.
  if (pointerX < 0 || pointerY < 0 || pointerX > displayedWidth || pointerY > displayedHeight) return null;

  const panelGap = 12;
  const panelMargin = 8;
  const rightCandidate = imageRect.right + panelGap;
  const maxPanelSide = Math.max(1, Math.min(480, viewportWidth - panelMargin * 2, viewportHeight - panelMargin * 2));
  const rightPanelSide = Math.min(maxPanelSide, Math.max(0, viewportWidth - panelMargin - rightCandidate));
  const leftPanelSide = Math.min(maxPanelSide, Math.max(0, imageRect.left - panelGap - panelMargin));

  // Keep the zoom in a separate square panel. Scaling it to the full source
  // image made wide photos too large to fit beside the gallery, so the fallback
  // placed the panel over the main image. Preserve the 3.5x crop at any size.
  const useLeftPanel = rightPanelSide < Math.min(180, maxPanelSide) && leftPanelSide > rightPanelSide;
  const panelSide = Math.max(1, useLeftPanel ? leftPanelSide : rightPanelSide);
  const panelWidth = panelSide;
  const panelHeight = panelSide;
  const panelContentSide = Math.max(1, panelSide - 2);
  const panelLeft = useLeftPanel
    ? imageRect.left - panelGap - panelSide
    : clamp(rightCandidate, panelMargin, viewportWidth - panelSide - panelMargin);
  const panelTop = clamp(imageRect.top, panelMargin, viewportHeight - panelSide - panelMargin);

  // All crop math stays in rendered-image CSS pixels, then drives both the lens
  // and the panel background from the same source rectangle.
  const selectionSide = Math.min(displayedWidth, displayedHeight, panelContentSide / ZOOM_FACTOR);
  const selectionLeft = clamp(pointerX - selectionSide / 2, 0, displayedWidth - selectionSide);
  const selectionTop = clamp(pointerY - selectionSide / 2, 0, displayedHeight - selectionSide);
  const zoomViewportSize = selectionSide * ZOOM_FACTOR;

  return {
    selectionLeft: imageOffsetX + selectionLeft,
    selectionTop: imageOffsetY + selectionTop,
    selectionWidth: selectionSide,
    selectionHeight: selectionSide,
    zoomViewportSize,
    panelLeft,
    panelTop,
    panelWidth,
    panelHeight,
    backgroundWidth: displayedWidth * ZOOM_FACTOR,
    backgroundHeight: displayedHeight * ZOOM_FACTOR,
    backgroundX: -selectionLeft * ZOOM_FACTOR,
    backgroundY: -selectionTop * ZOOM_FACTOR,
  };
}
