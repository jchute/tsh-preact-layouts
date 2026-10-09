/**
 * Shared description of how a layout module must export its component.
 * Used by the browser picker and by Node-side build warnings.
 *
 * @param {string} name The layout's name.
 * @returns {string} Hint text that follows "Layout …".
 */
export const layoutExportHint = (name) =>
  ` needs a default export, an export named "${name}", or exactly one exported component`;

/**
 * Determines the export the browser will most likely use, from export names alone.
 *
 * This is a best guess and may not be correct.
 *
 * @param {string[]} exports The layout module's export names.
 * @param {string} name The layout's name.
 * @returns {string|null} The export name, or null when none clearly matches.
 */
export const findLayoutExport = (exports, name) => {
  if (exports.includes("default")) {
    return "default";
  }

  if (exports.includes(name)) {
    return name;
  }

  return exports.length === 1 ? exports[0] : null;
};

/**
 * Determine the component to use within a layout module.
 * Runs in the browser: the generated `virtual:layouts` module imports this function.
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
export const pickLayoutComponent = (module, name) => {
  if (typeof module.default === "function") {
    return module.default;
  }

  if (typeof module[name] === "function") {
    return module[name];
  }

  // Find only exported functions
  const components = Object.values(module).filter((value) => typeof value === "function");

  // If there is only one exported function, use it
  if (components.length === 1) {
    return components[0];
  }

  console.warn(`Layout "${name}" ${layoutExportHint(name)}.`);

  return null;
};
