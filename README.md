# Catálogo Crusanti México (React)

Frontend independiente con React, Vite y Tailwind CSS. El backend Express de PayPal Sandbox permanece separado en `backend/`. Esta carpeta se generó como una migración de trabajo; el proyecto original permanece intacto.

## Requisitos

- Node.js 20.19 o posterior (o 22.12 o posterior) y npm para Vite 8. El backend conserva el requisito Node.js 18 o posterior.
- Windows PowerShell.
- Para pagar en Sandbox: credenciales de una aplicación PayPal Sandbox y una cuenta compradora de prueba.

## Configuración inicial en Windows

Abre una terminal PowerShell en esta carpeta. Crea una configuración local de Sandbox a partir del ejemplo solo si `backend/.env` todavía no existe. Completa sus valores en tu equipo; no los publiques ni los pongas en variables `VITE_*`.

```powershell
if (-not (Test-Path .\backend\.env)) { Copy-Item .\backend\.env.example .\backend\.env }
```

Este comando conserva intacto cualquier `.env` que ya exista. El archivo local está excluido de Git y no se incluyó en la migración. Sin credenciales Sandbox locales, la API puede responder, pero informará que PayPal no está configurado.

Prepara también la URL pública del backend para Vite:

```powershell
if (-not (Test-Path .\.env.local)) { Copy-Item .\.env.example .\.env.local }
```

`VITE_API_BASE_URL` solo contiene la URL del backend. No agregues credenciales privadas ni un `PAYPAL_CLIENT_SECRET` a una variable `VITE_*`.

## Iniciar los servidores

Abre dos terminales PowerShell en la carpeta de migración.

Terminal 1, backend:

```powershell
Set-Location .\backend
npm ci
npm start
```

Terminal 2, frontend:

```powershell
npm ci
npm run dev
```

Abre `http://127.0.0.1:5500`. Vite está configurado para usar ese host y puerto, que coincide con el origen local de `backend/.env.example`. Si el archivo `backend/.env` tiene otro `FRONTEND_ORIGIN`, actualízalo para que coincida exactamente con la dirección que aparece en el navegador y reinicia el backend. `localhost` y `127.0.0.1` cuentan como orígenes distintos.

Para compilar y servir una vista previa:

```powershell
npm run build
npm run preview
```

## Catálogo e inventario

`backend/catalog.json` es la fuente única de productos para React y el servidor. El frontend lo incorpora al compilar; los precios, moneda, fechas y existencias que muestra corresponden a ese archivo. El backend vuelve a validar el identificador, el precio vigente y el stock al crear cada orden. Después de cambiar `catalog.json`, vuelve a compilar o iniciar Vite para cargar los cambios del catálogo.

Una existencia `null` se muestra como pendiente y no habilita PayPal. En la ficha se puede elegir la cantidad disponible; el frontend muestra el total seleccionado y el backend vuelve a calcular el importe con el precio vigente del catálogo. El inventario del servidor es estático y no se descuenta al capturar un pago; se necesita inventario persistente antes de usar el catálogo para ventas reales.

Las ofertas se interpretan en `America/Mexico_City`, igual que en el servidor. La interfaz distingue ofertas próximas, vigentes, finalizadas y fechas inválidas.

## PayPal Sandbox

El frontend consulta `GET /api/config` y usa `POST /api/orders`, `POST /api/orders/:orderId/capture` y `GET /api/orders/:orderId/receipt`. No envía precios al servidor. Las solicitudes de creación llevan una clave de idempotencia para evitar órdenes duplicadas ante reintentos. El comprobante PDF se genera solo tras volver a verificar la captura en PayPal. El Client Secret permanece en `backend/.env`; el Client ID solo llega al navegador cuando la API informa que Sandbox está configurado. La interfaz muestra éxito únicamente cuando la captura verificada por el servidor tiene estado `COMPLETED`.

Sin credenciales Sandbox completas, el catálogo funciona y el panel de compra explica el estado de configuración. Para probar una compra, usa una cuenta compradora Sandbox desde PayPal Developer Dashboard. No uses credenciales Live.

Comprobación manual de la configuración pública:

```powershell
Invoke-RestMethod http://127.0.0.1:3001/api/config
```

La respuesta debe ser JSON e incluir la moneda y los indicadores de configuración. Nunca copies la salida completa de una terminal a un lugar público si incluye datos de configuración.

## Estructura

- `src/`: interfaz React y componentes.
- `backend/`: API Express, catálogo comercial y configuración de ejemplo.
- `public/img/`: imágenes del catálogo servidas por Vite en la ruta `/img/`.
- `.env.example`: URL pública que usa Vite para llegar al backend.

Las imágenes actualmente referenciadas por los productos se copiaron desde el catálogo original. Si agregas productos, conserva las rutas existentes en `catalog.json` y agrega los archivos reales a `public/img/`.

## Ofertas, imágenes y diagnóstico de pagos

Las fechas del catálogo se guardan como `AAAA-MM-DDTHH:mm:ss` sin sufijo de zona. Se interpretan como hora local de `America/Mexico_City`, que es la zona indicada por `backend/catalog.json`; no se convierten como UTC. El contador toma una sola señal de reloj compartida por la interfaz y se actualiza cada segundo. Las fechas comerciales del catálogo no se ajustan automáticamente.

En cada tarjeta, pulsa **Ver producto** para abrir la ficha. La ficha ocupa aproximadamente el 94% del ancho y el 90% de la altura de la ventana; en pantallas pequeñas muestra sus columnas en una sola columna y permite desplazarse por el contenido. Mueve el cursor sobre la imagen principal para usar el zoom 2.5×. Pulsa **Ampliar** para abrir el visor completo; usa Escape para cerrarlo y las flechas izquierda/derecha para cambiar de foto. En pantalla táctil, pulsa **Ampliar**.

Vite usa `http://127.0.0.1:5500` y React consulta `http://127.0.0.1:3001` por defecto. El CORS de `backend/.env.example` acepta exactamente ese origen. Si `GET /api/config` responde con `configured: false`, la API sí está accesible pero no tiene credenciales Sandbox configuradas. Si no hay respuesta, inicia el backend o revisa `VITE_API_BASE_URL` y que `FRONTEND_ORIGIN` coincida exactamente con la dirección abierta en el navegador. La petición de API expira a los 8 segundos y la carga del SDK de PayPal a los 15; la interfaz ofrece reintento.

Para comprobar el catálogo y el visor con teclado/táctil, abre `http://127.0.0.1:5500` en un navegador. Para comprobar una transacción, además se necesita una cuenta compradora Sandbox. La API solo informa éxito cuando el backend verifica la captura como `COMPLETED`.
