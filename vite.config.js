import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  // Ruta del repositorio en GitHub Pages.
  base: command === "build" ? "/crusanti-producto./" : "/",

  plugins: [react(), tailwindcss()],

  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
}));
