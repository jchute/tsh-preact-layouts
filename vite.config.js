import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";
import { LayoutHTMLGenerator, LayoutVirtualModule } from "./plugins/layouts/index.js";

const layoutsDirectory = path.resolve(__dirname, "src/Layouts");

export default defineConfig({
  base: "./",
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  plugins: [
    preact(),
    LayoutVirtualModule({ directory: layoutsDirectory }),
    LayoutHTMLGenerator({ directory: layoutsDirectory }),
  ],
  root: "./src",
  resolve: {
    alias: {
      "@Assets": path.resolve(__dirname, "./src/Assets"),
      "@Components": path.resolve(__dirname, "./src/Components"),
      "@Layouts": layoutsDirectory,
      "@State": path.resolve(__dirname, "./src/State"),
      "@Utils": path.resolve(__dirname, "./src/Utils"),
    },
  },
});
