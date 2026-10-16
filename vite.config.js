import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  // El repositorio publicado en GitHub Pages se llama "crusanti-producto".
  // En desarrollo local se conserva la raíz para que las rutas sigan funcionando.
 base: command === "build" ? "/crusanti-producto./" : "/",  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
}));
