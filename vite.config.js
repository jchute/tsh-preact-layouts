import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";
import fs from "fs";

/** Folder holding one subfolder per overlay screen. */
const screensDir = path.resolve(__dirname, "src/Screens");

/** Import name application code uses for the generated screen index. */
const SCREENS_ID = "virtual:screens";

/** Internal ID for the screen index. The `\0` prefix tells other plugins not to process it. */
const RESOLVED_SCREENS_ID = `\0${SCREENS_ID}`;

/**
 * Returns the names of all directories within a parent folder.
 *
 * @param {string} parent Directory to search.
 * @returns {string[]} Names of the directories within the parent folder.
 */
const getDirectories = (parent) => {
  return fs.readdirSync(parent).filter((file) => {
    return fs.statSync(path.join(parent, file)).isDirectory();
  });
};

/**
 * Creates a Vite virtual module that exports every screen found in `src/Screens`.
 *
 * For example, if the directory contains:
 *
 *   src/Screens/
 *     Scoreboard/
 *     HeadToHead/
 *
 * The virtual module will effectively contain:
 *
 *   export { Scoreboard } from "@Screens/Scoreboard";
 *   export { HeadToHead } from "@Screens/HeadToHead";
 *
 * This allows application code to import all screen from a single module without
 * having to manually maintain an index file.
 *
 * In development, adding or removing a screen invalidates the module and reloads the page.
 *
 * @returns {import("vite").Plugin} Vite plugin definition.
 */
const ScreenVirtualModule = () => {
  return {
    name: "tsh-screens-virtual-index",

    /**
     * Resolves the virtual module's import ID.
     *
     * `virtual:screen` does not exist as a physical file. This tells Vite
     * that our plugin owns the module ID.
     *
     * @param {string} id Module ID being resolved.
     * @returns {string|undefined} The virtual module ID when matched.
     */
    resolveId(id) {
      if (id === SCREENS_ID) return RESOLVED_SCREENS_ID;
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
      if (id !== RESOLVED_SCREENS_ID) {
        return;
      }

      return getDirectories(screensDir)
        .map((name) => {
          return `export { ${name} } from "@Screens/${name}"`;
        })
        .join("\n");
    },

    /**
     * Watches for screens being added or removed while the dev server is running.
     *
     * Only top-level screen directories and their direct children (e.g. `Game/index.jsx`)
     * affect the module, so deeper changes are left to normal HMR.
     *
     * @param {import("vite").ViteDevServer} server The running dev server, used for its file watcher.
     */
    configureServer(server) {
      const onChange = (file) => {
        const relative = path.relative(screensDir, file);

        if (!relative || relative.startsWith("..") || relative.split(path.sep).length > 2) {
          return;
        }

        const mod = server.moduleGraph.getModuleById(RESOLVED_SCREENS_ID);

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
 * Creates a Vite plugin that generates one HTML entry point per screen.
 *
 * Each generated HTML file is identical to `index.html` except that the root
 * application element receives a `data-screen` attribute identifying its screen:
 *
 *   <div id="app">  ->  <div id="app" data-screen="Scoreboard">
 *
 * @returns {import("vite").Plugin} Vite plugin definition.
 */
const ScreenHTMLGenerator = () => {
  return {
    name: "tsh-screens-html-generator",
    enforce: "post",
    apply: "build",

    /**
     * Called after Vite has generated the final bundle.
     *
     * Finds the generated index.html, creates a copy for every screen, adds
     * that screen's `data-screen` attribute to #app, and emits the result
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

      for (const screen of getDirectories(screensDir)) {
        // Matches `<div ... id="app" ...>`, preserving every other attribute
        const source = index.source.replace(/<div\b([^>]*\sid=["']app["'][^>]*)>/i, (_, attrs) => {
          // Remove an existing data-screen attribute so it isn't duplicated
          const cleanAttrs = attrs.replace(/\s+data-screen=["'][^"']*["']/i, "").trimEnd();

          return `<div${cleanAttrs} data-screen="${screen}">`;
        });

        // Each screen gets its own HTML entry point.
        const fileName = `${screen}.html`;

        this.emitFile({
          type: "asset",
          fileName,
          source,
        });

        results.push({
          Screen: screen,
          File: fileName,
          Status: "✅ Emitted",
        });
      }

      // Print a useful summary after the build.
      if (results.length > 0) {
        console.log("\n Screens Generated.");
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
  plugins: [preact(), ScreenVirtualModule(), ScreenHTMLGenerator()],
  root: "./src",
  resolve: {
    alias: {
      "@Assets": path.resolve(__dirname, "./src/Assets"),
      "@Components": path.resolve(__dirname, "./src/Components"),
      "@Screens": path.resolve(__dirname, "./src/Screens"),
      "@State": path.resolve(__dirname, "./src/State"),
      "@Utils": path.resolve(__dirname, "./src/Utils"),
    },
  },
});
