# API PayPal Sandbox de Crusanti México

API local Node.js/Express. Conserva PayPal Orders v2 y lee precios, moneda, ofertas e inventario desde `catalog.json`. No acepta importes enviados por el navegador y no devuelve el Client Secret.

## Configuración en Windows

Desde la raíz de la migración, crea `backend/.env` desde `.env.example` solo si todavía no existe y completa las credenciales Sandbox en tu equipo. No copies ni muestres secretos en el frontend o en mensajes. El archivo `.env` no se incluye en la carpeta de entrega ni en Git.

El origen local predeterminado del frontend es `http://127.0.0.1:5500`. `FRONTEND_ORIGIN` debe coincidir exactamente con el origen abierto en el navegador. Después, en PowerShell:

```powershell
Set-Location .\backend
npm ci
npm start
```

## Endpoints existentes

- `GET /api/config`: estado Sandbox, Client ID público cuando está configurado y moneda del catálogo.
- `POST /api/orders` con `{ "productId": "grua-cr20", "quantity": 1 }`: crea una orden CAPTURE calculada desde `catalog.json`.
- `POST /api/orders/:orderId/capture`: consulta y verifica la orden, captura y solo responde como completada si PayPal confirma `COMPLETED` con importe y moneda coincidentes.
- `GET /api/orders/:orderId/receipt`: vuelve a verificar la orden y genera un comprobante PDF solo si PayPal confirma la captura `COMPLETED`.

El frontend envía `Idempotency-Key` al crear una orden. Repetir la misma solicitud con la misma clave, producto y cantidad devuelve la misma orden; reutilizarla con otro producto o cantidad se rechaza. La API conserva la validación de stock y rechaza cantidades mayores al inventario. Los productos con `stock: null` no se pueden comprar. Las existencias son estáticas: la captura no las descuenta ni las persiste. No reinicies el backend entre crear, capturar y descargar el comprobante, ya que la relación entre la orden, el producto y la cantidad se conserva en memoria.

## Configurar ofertas

Las promociones se administran en `catalog.json`, dentro del producto correspondiente. Se pueden seguir usando los campos actuales `discountPercent`, `offerStart` y `offerEnd`. Para programar varias ofertas para el mismo producto, agrega una lista opcional `offers`; cada elemento usa esos mismos tres campos. La lista complementa la oferta antigua, y una oferta repetida con el mismo porcentaje y las mismas fechas se cuenta una sola vez.

`offerStart` y `offerEnd` usan el formato `YYYY-MM-DDTHH:mm:ss` y se interpretan en la zona horaria `timeZone` del catalogo (`America/Mexico_City` en la configuracion actual). La fecha final debe ser posterior a la inicial. El intervalo incluye el inicio y excluye el fin: al llegar exactamente a `offerEnd`, la promocion ya termino. Configura descuentos mayores que 0 y menores que 100, y usa ventanas que no se traslapen.

El catalogo selecciona la oferta activa; si no hay una, muestra la proxima oferta programada sin aplicar aun su descuento. Despues de la ultima oferta, el precio vuelve al precio base. Las fechas o descuentos invalidos nunca se aplican. El frontend recalcula el estado cada segundo, y el backend vuelve a verificar la oferta al crear cada orden. No se crean precios ni descuentos automaticamente: agrega solo promociones autorizadas con sus fechas y porcentaje confirmados. Despues de editar `catalog.json`, reconstruye el frontend y reinicia el backend para cargar los datos nuevos.

`PAYPAL_CLIENT_SECRET` debe permanecer exclusivamente en `backend/.env`. No lo pongas en `VITE_*`, archivos del frontend, registros ni mensajes. Usa solo credenciales Sandbox.
