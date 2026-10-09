import { normalizePath } from "vite";
import path from "path";
import { highlight } from "./node/log.js";
import { getLayoutExports, getLayoutPath, getLayouts } from "./node/scanLayouts.js";
import { findLayoutExport, layoutExportHint } from "./runtime/resolveLayoutExport.js";

/** Browser-side module the generated code imports to pick each layout's component. */
const PICKER_ID = normalizePath(path.resolve(__dirname, "runtime/resolveLayoutExport.js"));

/** The ID of the virtual module. */
const LAYOUTS_ID = "virtual:layouts";

/** The resolved ID of the virtual module. */
const RESOLVED_LAYOUTS_ID = `\0${LAYOUTS_ID}`;

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
 *   import { pickLayoutComponent } from "/.../plugins/layouts/runtime/resolveLayoutExport.js";
 *   import * as layout0 from "/.../src/Layouts/Game/index.jsx";
 *   import * as layout1 from "/.../src/Layouts/HeadToHead.jsx";
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
 * @param {object} options
 * @param {string} options.directory Absolute path of the folder that holds the layouts.
 * @returns {import("vite").Plugin} Vite plugin definition.
 */
export const LayoutVirtualModule = ({ directory }) => {
  /** The layouts found when the virtual module was last generated. */
  let layouts = [];

  return {
    name: "tsh-layouts-virtual-index",

    /**
     * Resolves the virtual module's import ID.
     *
     * `virtual:layouts` does not exist as a physical file. This tells Vite
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

      const result = getLayouts(directory);
      layouts = result.layouts;
      result.errors.forEach((error) => this.warn(highlight(error)));

      return [
        `import { pickLayoutComponent } from ${JSON.stringify(PICKER_ID)};`,
        ...layouts.map(({ file }, index) => {
          return `import * as layout${index} from ${JSON.stringify(getLayoutPath(directory, file))};`;
        }),
        "export default {",
        ...layouts.map(({ name }, index) => {
          return `  ${JSON.stringify(name)}: pickLayoutComponent(layout${index}, ${JSON.stringify(name)}),`;
        }),
        "};",
      ].join("\n");
    },

    /**
     * Warns, at build time, about layouts the browser won't be able to pick a component from.
     *
     * Uses findLayoutExport, so it can flag layouts that still work in the browser. Only runs in
     * builds, as the dev server doesn't record a module's exports.
     */
    buildEnd() {
      for (const { name, file } of layouts) {
        const exports = getLayoutExports(this, directory, file);

        if (!exports || findLayoutExport(exports, name)) {
          continue;
        }

        const found = exports.length ? exports.join(", ") : "none";

        this.warn(
          highlight(
            `Layout "${name}" (${file}) may render nothing: it ${layoutExportHint(name)}. Found exports: ${found}.`,
          ),
        );
      }
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
        const relative = path.relative(directory, file);

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
