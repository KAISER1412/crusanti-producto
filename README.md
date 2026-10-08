# Cat&aacute;logo Crusanti M&eacute;xico

Los datos viven en el arreglo `products` de [script.js](script.js). El cat&aacute;logo y las fichas se generan desde esos objetos; no hay que repetir productos en `index.html`.

## Agregar un producto

1. Abre `script.js` y busca `const products = [`.
2. Agrega un objeto dentro del arreglo, separado de los otros por una coma.
3. Asigna un `id` &uacute;nico y completa: `nombre`, `categoria`, `mainImage`, `gallery`, `descripcion`, `caracteristicas`, `precioAnterior`, `descuento`, `stock` y `fechaFinOferta`. A&ntilde;ade tambi&eacute;n `buyMessage` para el texto preparado en WhatsApp.
4. Coloca las fotos f&iacute;sicamente en `C:/proyecto/crusanti-producto/img/` y escribe las rutas relativas `img/...` en `mainImage` y `gallery`. Consulta [img/README.md](img/README.md).
5. Guarda `script.js` y recarga la p&aacute;gina.

Usa fechas ISO con zona horaria, por ejemplo `"2026-10-06T23:59:59-06:00"`. Cada contador lee la fecha del objeto correspondiente y usa la hora actual del navegador.

## Eliminar un producto

Elimina su objeto completo del arreglo `products` en `script.js`, cuidando la coma entre los objetos restantes, y recarga la p&aacute;gina. No hace falta editar `index.html` ni otra lista.

No se agregaron carrito, pagos, backend, API ni panel administrativo. **Comprar** conserva el enlace `wa.me`, el n&uacute;mero y el mensaje preparados en `script.js`.
