import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";
import fs from "fs";

/** The main folder that holds each preact layout. */
const layoutsDir = path.resolve(__dirname, "src/Layouts");

/** Import name application code uses for the generated layouts index. */
const LAYOUTS_ID = "virtual:layouts";

/** Internal ID for the layouts index. The `\0` prefix tells other plugins not to process it. */
const RESOLVED_LAYOUTS_ID = `\0${LAYOUTS_ID}`;

/**
 * Returns the names of all layouts within this project.
 *
 * @returns {string[]} Names of the layouts within this project.
 */
const getLayouts = () => {
  return fs.readdirSync(layoutsDir).filter((file) => {
    return fs.statSync(path.join(layoutsDir, file)).isDirectory();
  });
};

/**
 * Creates a Vite virtual module that exports every layout found in the layouts directory.
 *
 * For example, if the directory contains:
 *
 *   src/Layouts/
 *     Game/
 *     HeadToHead/
 *
 * The virtual module will effectively contain:
 *
 *   export { Game } from "@Layouts/Game";
 *   export { HeadToHead } from "@Layouts/HeadToHead";
 *
 * This allows the application to import all layouts from a single module without
 * having to manually maintain an index file.
 *
 * In development, adding or removing a layout invalidates the module and reloads the page.
 *
 * @returns {import("vite").Plugin} Vite plugin definition.
 */
const LayoutVirtualModule = () => {
  return {
    name: "tsh-layouts-virtual-index",

    /**
     * Resolves the virtual module's import ID.
     *
     * `virtual:layout` does not exist as a physical file. This tells Vite
     * that our plugin owns the module ID.
     *
     * @param {string} id Module ID being resolved.
     * @returns {string|undefined} The virtual module ID when matched.
     */
    resolveId(id) {
      if (id === LAYOUTS_ID) return RESOLVED_LAYOUTS_ID;
    },

    /**
     * Generates the contents of the virtual module.
     *
     * The generated module is not written to disk. Vite receives this string
     * as though it were the contents of a real JS file.
     *
     * @param {string} id Module ID being loaded
     * @returns {string|undefined} Generated module source.
     */
    load(id) {
      if (id !== RESOLVED_LAYOUTS_ID) {
        return;
      }

      return getLayouts()
        .map((name) => {
          return `export { ${name} } from "@Layouts/${name}"`;
        })
        .join("\n");
    },

    /**
     * Watches for layouts being added or removed while the dev server is running.
     *
     * Only top-level layout directories and their direct children (e.g. `Game/index.jsx`)
     * affect the module, so deeper changes are left to normal HMR.
     *
     * @param {import("vite").ViteDevServer} server The running dev server, used for its file watcher.
     */
    configureServer(server) {
      const onChange = (file) => {
        const relative = path.relative(layoutsDir, file);

        if (!relative || relative.startsWith("..") || relative.split(path.sep).length > 2) {
          return;
        }

        const mod = server.moduleGraph.getModuleById(RESOLVED_LAYOUTS_ID);

        if (mod) {
          server.moduleGraph.invalidateModule(mod);
        }

        server.ws.send({ type: "full-reload" });
      };

      for (const event of ["add", "unlink", "addDir", "unlinkDir"]) {
        server.watcher.on(event, onChange);
      }
    },
  };
};

/**
 * Creates a Vite plugin that generates one HTML entry point per layout.
 *
 * Each generated HTML file is identical to `index.html` except that the root
 * application element receives a `data-layout` attribute identifying its layout:
 *
 *   <div id="app">  ->  <div id="app" data-layout="Game">
 *
 * @returns {import("vite").Plugin} Vite plugin definition.
 */
const LayoutHTMLGenerator = () => {
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

      for (const layout of getLayouts()) {
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
          Layout: layout,
          File: fileName,
          Status: "✅ Emitted",
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

export default defineConfig({
  base: "./",
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  plugins: [preact(), LayoutVirtualModule(), LayoutHTMLGenerator()],
  root: "./src",
  resolve: {
    alias: {
      "@Assets": path.resolve(__dirname, "./src/Assets"),
      "@Components": path.resolve(__dirname, "./src/Components"),
      "@Layouts": path.resolve(__dirname, "./src/Layouts"),
      "@State": path.resolve(__dirname, "./src/State"),
      "@Utils": path.resolve(__dirname, "./src/Utils"),
    },
  },
});
