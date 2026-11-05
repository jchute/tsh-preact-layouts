/**
 * Determines the export the browser will most likely use, from export names alone.
 *
 * This is a best guess and may not be correct, for example if the default export is not a function.
 *
 * @param {string[]} exports The layout module's export names.
 * @param {string} name The layout's name.
 * @returns {string|null} The export name, or null when none clearly matches.
 */
export const findLayoutExport = (exports, name) => {
  // Use the default export if it exists
  if (exports.includes("default")) {
    return "default";
  }

  // Use the named export if it exists
  if (exports.includes(name)) {
    return name;
  }

  // If there is only one export, use it
  return exports.length === 1 ? exports[0] : null;
};

/**
 * Determine the component to use within a layout module.
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
  // Use the default export if it is a function
  if (typeof module.default === "function") {
    return module.default;
  }

  // Use the named export if it is a function
  if (typeof module[name] === "function") {
    return module[name];
  }

  // Find only exported functions
  const components = Object.values(module).filter((value) => typeof value === "function");

  // If there is only one exported function, use it
  if (components.length === 1) {
    return components[0];
  }

  console.warn(
    `Layout "${name}" needs a default export, an export named "${name}", or exactly one exported component.`,
  );

  return null;
};
