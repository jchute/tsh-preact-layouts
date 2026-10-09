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

/** File extensions a layout can be written in. */
const LAYOUT_EXTENSIONS = [".jsx", ".js", ".tsx", ".ts"];

/** Layout names already reported as duplicates, so each is only warned about once. */
const reportedDuplicates = new Set();

/**
 * Returns every layout within this project, sorted by name. A layout is any top-level entry in
 * the layouts directory that is either:
 *
 *   - a folder with an index file:  `Game/index.jsx` (or .js, .tsx, .ts)
 *   - a single file:                `Game.jsx` (or .js, .tsx, .ts)
 *
 * Names starting with `_` or `.`, and files with extra dots such as `Game.test.jsx`, are skipped.
 *
 * @returns {{ name: string, file: string }[]} Each layout's name and its entry file, relative to
 * the layouts directory with forward slashes.
 */
const getLayouts = () => {
  const layouts = new Map();

  // Folders first, so they take priority over a file with the same name
  const entries = fs
    .readdirSync(layoutsDir, { withFileTypes: true })
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()));

  for (const entry of entries) {
    // Get the extension of an layout if it's a file
    const extension = entry.isDirectory() ? "" : path.extname(entry.name);

    // Get the name of the layout
    const name = path.basename(entry.name, extension);

    // Skip files and folders starting with `_` or `.`, and files with extra dots such as `Game.test.jsx`
    if (/^[_.]/.test(name) || name.includes(".")) {
      continue;
    }

    // Find the index file (or component file)for the layout
    const file = entry.isDirectory()
      ? LAYOUT_EXTENSIONS.map((ext) => `${entry.name}/index${ext}`).find((index) =>
          fs.existsSync(path.join(layoutsDir, index)),
        )
      : LAYOUT_EXTENSIONS.includes(extension) && entry.name;

    if (!file) {
      continue;
    }

    // Skip if the layout is already defined
    if (layouts.has(name)) {
      if (!reportedDuplicates.has(name)) {
        reportedDuplicates.add(name);
        console.warn(
          `[layouts] "${name}" is defined twice; using ${layouts.get(name)}, ignoring ${file}.`,
        );
      }

      continue;
    }

    layouts.set(name, file);
  }

  return [...layouts]
    .map(([name, file]) => ({ name, file }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Finds the component out of a layout module, so layouts can export however.
 *
 * Checks, in order:
 *   - The default export
 *   - The export named after the layout
 *   - The only exported function
 *
 * Returns null (with a warning) when none of those match.
 *
 * @param {object} module The layout module's exports.
 * @param {string} name The layout's name.
 * @returns {Function|null} The layout component.
 */
const pickLayoutComponent = (module, name) => {
  if (typeof module.default === "function") {
    return module.default;
  }

  if (typeof module[name] === "function") {
    return module[name];
  }

  const components = Object.values(module).filter((value) => typeof value === "function");

  if (components.length === 1) {
    return components[0];
  }

  console.warn(
    `Layout "${name}" needs a default export, an export named "${name}", or exactly one exported component.`,
  );

  return null;
};

/**
 * Creates a Vite virtual module whose default export maps every layout's name to its component.
 *
 * For example, if the directory contains:
 *
 *   src/Layouts/
 *     Game/index.jsx      (export const Game = ...)
 *     HeadToHead.jsx      (export default ...)
 *
 * The virtual module will effectively contain:
 *
 *   import * as layout0 from "@Layouts/Game/index.jsx";
 *   import * as layout1 from "@Layouts/HeadToHead.jsx";
 *
 *   export default {
 *     "Game": pickLayoutComponent(layout0, "Game"),
 *     "HeadToHead": pickLayoutComponent(layout1, "HeadToHead"),
 *   };
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

      const layouts = getLayouts();

      return [
        ...layouts.map(({ file }, index) => `import * as layout${index} from "@Layouts/${file}";`),
        `const pickLayoutComponent = ${pickLayoutComponent.toString()};`,
        "export default {",
        ...layouts.map(({ name }, index) => {
          return `  ${JSON.stringify(name)}: pickLayoutComponent(layout${index}, ${JSON.stringify(name)}),`;
        }),
        "};",
      ].join("\n");
    },

    /**
     * Watches for layouts being added or removed while the dev server is running.
     *
     * Only top-level entries (e.g. `Game.jsx` or `Game/`) and their direct children
     * (e.g. `Game/index.jsx`) affect the module, so deeper changes are left to normal HMR.
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

      for (const { name: layout } of getLayouts()) {
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
