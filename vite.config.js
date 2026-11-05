import path from "path";
import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import { LayoutHTMLGenerator, LayoutVirtualModule } from "./plugins/layouts";

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
      "@Notices": path.resolve(__dirname, "./src/Notices"),
      "@State": path.resolve(__dirname, "./src/State"),
      "@Utils": path.resolve(__dirname, "./src/Utils"),
    },
  },
});
