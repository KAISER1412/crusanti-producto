# Crusanti México — publicación en GitHub Pages

Esta versión conserva el diseño, catálogo, imágenes y fichas del proyecto. Incluye una configuración para compilar el frontend bajo la ruta del repositorio `KAISER1412/crusanti-producto` y publicarlo mediante GitHub Actions.

## Publicar la página sin usar terminal

1. Entra al repositorio `KAISER1412/crusanti-producto` en GitHub.
2. Sube los archivos de esta carpeta y acepta reemplazar los archivos anteriores cuando GitHub lo pregunte. **No subas archivos `.env` reales ni la carpeta `node_modules`.**
3. En el repositorio abre **Settings → Pages**. En **Build and deployment**, selecciona **GitHub Actions** como origen.
4. Abre la pestaña **Actions**. Espera a que termine en verde el flujo **Publicar catálogo Crusanti México en GitHub Pages**.
5. Abre `https://kaiser1412.github.io/crusanti-producto/`. Si ya había una publicación anterior, recarga con `Ctrl+F5`.

El flujo se ejecuta automáticamente al actualizar la rama `main`. Si la pestaña Actions muestra un error, entra en el flujo rojo y comparte una captura del error; no hace falta usar terminal.

## Importante sobre PayPal

GitHub Pages solo sirve archivos del frontend; **no ejecuta Node.js ni el servidor de PayPal**. El catálogo, el diseño, las imágenes, el tema y los filtros pueden publicarse desde GitHub Pages, pero para que el pago funcione hay que alojar `backend/` en un servicio para Node.js (por ejemplo, Render).

Cuando el backend esté publicado:

1. En el repositorio abre **Settings → Secrets and variables → Actions → Variables**.
2. Crea la variable `VITE_API_BASE_URL` con la URL pública HTTPS del backend, por ejemplo `https://TU-SERVICIO.onrender.com` (sin `/` al final). No uses esa URL de ejemplo literalmente; utiliza la que te asigne el servicio.
3. En la configuración del servicio backend agrega las variables `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `FRONTEND_ORIGIN=https://kaiser1412.github.io` y `HOST=0.0.0.0`. Configura también `PORT` solo si el proveedor lo requiere; normalmente lo asigna automáticamente.
4. Vuelve a ejecutar el flujo de GitHub Actions desde **Actions → Publicar catálogo Crusanti México en GitHub Pages → Run workflow**.

**Nunca guardes `PAYPAL_CLIENT_SECRET` en GitHub Pages, en una variable que empiece por `VITE_`, ni en un archivo que vayas a subir al repositorio.** Las credenciales de prueba de PayPal deben mantenerse solo en la configuración privada del backend.

## Qué se cambió

- Se configuró la ruta de publicación `/crusanti-producto/` para GitHub Pages.
- Se fijó Vite en el puerto local `5173`, sin afectar la ruta de publicación.
- En producción, el frontend ya no intenta conectarse al `127.0.0.1` del visitante cuando falta configurar el backend.
- El servidor Node.js escucha en `0.0.0.0`, necesario para alojarlo en un servicio web.
- El ZIP preparado excluye `.git`, `node_modules`, `dist` y los archivos `.env` reales.
