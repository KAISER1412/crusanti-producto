// Configura aquí el número oficial completo con código de país, solo dígitos.
// No se incluye un número mientras no haya uno confirmado en el proyecto.
export const CRUSANTI_OFFICIAL_WHATSAPP_NUMBER = "";

export const WHATSAPP_MESSAGE = "Hola, estoy interesado en los productos de Crusanti México. Me gustaría recibir más información y asesoría. Gracias.";

const whatsappNumber = /^\d+$/.test(CRUSANTI_OFFICIAL_WHATSAPP_NUMBER)
  ? CRUSANTI_OFFICIAL_WHATSAPP_NUMBER
  : "";

export const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
