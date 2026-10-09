import { getLayoutExports, getLayouts } from "./node/scanLayouts.js";
import { findLayoutExport } from "./runtime/resolveLayoutExport.js";

/**
 * Creates a Vite plugin that generates one HTML entry point per layout.
 *
 * Each generated HTML file is identical to `index.html` except that the root
 * application element receives a `data-layout` attribute identifying its layout:
 *
 *   <div id="app">  ->  <div id="app" data-layout="Game">
 *
 * @param {object} options
 * @param {string} options.directory Absolute path of the folder that holds the layouts.
 * @returns {import("vite").Plugin} Vite plugin definition.
 */
export const LayoutHTMLGenerator = ({ directory }) => {
  return {
    name: "tsh-layouts-html-generator",
    enforce: "post",
    apply: "build",

    /**
     * Called after Vite has generated the final bundle.
     *
     * Finds the generated index.html, creates a copy for every layout, adds
     * that layout's `data-layout` attribute to #app, and emits the result
     * as a separate HTML asset.
     *
     * @param {object} _ Rollup output options. Unused.
     * @param {import("rollup").OutputBundle} bundle Generated bundle.
     */
    generateBundle(_, bundle) {
      const index = bundle["index.html"];

      if (!index) {
        this.error("No HTML file found in bundle");
      }

      const results = [];

      const { layouts } = getLayouts(directory);
      for (const { name: layout, file: sourceFile } of layouts) {
        const exports = getLayoutExports(this, directory, sourceFile);
        const layoutExport = exports && findLayoutExport(exports, layout);

        // Matches `<div ... id="app" ...>`, preserving every other attribute
        const source = index.source.replace(/<div\b([^>]*\sid=["']app["'][^>]*)>/i, (_, attrs) => {
          // Remove an existing data-layout attribute so it isn't duplicated
          const cleanAttrs = attrs.replace(/\s+data-layout=["'][^"']*["']/i, "").trimEnd();

          return `<div${cleanAttrs} data-layout="${layout}">`;
        });

        // Each layout gets its own HTML entry point.
        const fileName = `${layout}.html`;

        this.emitFile({
          type: "asset",
          fileName,
          source,
        });

        results.push({
          "Layout Name": layout,
          "Source File": sourceFile,
          "Generated File": fileName,
          "Layout Export": layoutExport ?? "—",
          Status: layoutExport ? "✅ Emitted" : "⚠️  No component",
        });
      }

      // Print a useful summary after the build.
      if (results.length > 0) {
        console.log("\n Layouts Generated.");
        console.table(results);
      }
    },
  };
};
