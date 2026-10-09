import { normalizePath } from "vite";
import path from "path";
import fs from "fs";

/**
 * Returns all layouts sorted by name.
 * A layout is any top-level entry in the layouts directory that is either:
 *
 *   - a folder with an index file, ie. `Game/index.jsx`
 *   - a single file, ie. `Game.jsx`
 *
 * The following methods will allow you to prevent certain layouts from being included:
 *
 *   - Layouts starting with `_` (`_Game.jsx`)
 *   - Layouts starting with `.` (`.Game.jsx`)
 *   - Layouts with extra dots (`Game.test.jsx`)
 *
 * @param {string} directory Absolute path of the folder that holds layouts.
 * @returns {
 *   errors: string[] - Any errors that occurred while getting the layouts
 *   layouts: {
 *     name: string - The layout's name
 *     file: string - The layout's entry file, relative to the layouts directory with forward slashes
 *   }[]
 * }
 */
export const getLayouts = (directory) => {
  const errors = [];
  const layouts = new Map();

  // Get all potential layout entries
  const entries = fs
    .readdirSync(directory, { withFileTypes: true })
    // Sort by directory first; folders take priority over files with the same name
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()));

  for (const entry of entries) {
    // Get the extension of a layout entry if it's a file
    const extension = entry.isDirectory() ? "" : path.extname(entry.name);

    // Get the name of the layout; the file basename or the directory name
    const name = path.basename(entry.name, extension);

    // Patterns to allow developers to hide certain layouts from being included
    if (name.startsWith("_") || name.includes(".")) {
      continue;
    }

    // Find the index file (or component file) for the layout
    const allowedExtensions = [".jsx", ".js", ".tsx", ".ts"];
    const file = entry.isDirectory()
      ? allowedExtensions
          .map((ext) => `${entry.name}/index${ext}`)
          .find((index) => fs.existsSync(path.join(directory, index)))
      : allowedExtensions.includes(extension) && entry.name;

    // Skip if the layout entry is not a valid file
    if (!file) {
      errors.push(
        entry.isDirectory()
          ? `No valid index file found for layout "${name}"`
          : `Invalid file extension for layout "${name}"`,
      );

      continue;
    }

    // Skip if the layout is already defined
    if (layouts.has(name)) {
      errors.push(`Layout "${name}" is defined twice; using ${layouts.get(name)}.`);
      continue;
    }

    layouts.set(name, file);
  }

  return {
    errors,
    layouts: [...layouts]
      .map(([name, file]) => ({ name, file }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
};

/**
 * Returns the absolute, forward-slashed path of a layout's entry file.
 *
 * @param {string} directory Absolute path of the folder that holds the layouts.
 * @param {string} file The layout's entry file, relative to the layouts directory.
 * @returns {string} The entry file's module path.
 */
export const getLayoutPath = (directory, file) => normalizePath(path.join(directory, file));

/**
 * Returns the export names of a layout's entry file.
 *
 * @param {import("vite").PluginContext} context The plugin context (`this` in a hook).
 * @param {string} directory Absolute path of the folder that holds the layouts.
 * @param {string} file The layout's entry file, relative to the layouts directory.
 * @returns {string[]|null} The export names, or null when unknown (e.g. on the dev server).
 */
export const getLayoutExports = (context, directory, file) =>
  context.getModuleInfo(getLayoutPath(directory, file))?.exports ?? null;
