/** The loaded settings, cached after the first `getSettings` call. */
let settings = null;

/**
 * Default options for settings.json, used for anything the file leaves out.
 *
 * - `data_path`: where TSH's program_state.json is, relative to the page, in dev and in a build.
 * - `styles.dev_body`: page background in dev, so transparent overlays are easier to see.
 */
const defaultSettings = {
  data_path: {
    dev: "../../out/program_state.json",
    prod: "../../out/program_state.json",
  },
  styles: {
    dev_body: "rebeccapurple",
  },
};

/**
 * Combines two settings objects, with `source` winning. Nested objects are merged key by key
 * rather than replaced, while arrays and other values are replaced outright.
 *
 * @param {object} target The base values, left unchanged.
 * @param {object} source The overriding values.
 * @returns {object} A new merged object.
 */
const deepMerge = (target, source) => {
  const result = structuredClone(target);
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

/**
 * Loads settings.json and fills any gaps with the defaults. The result is cached, and the
 * defaults are used alone if the file is missing or invalid.
 *
 * @returns {Promise<object>} The settings.
 */
export const getSettings = async () => {
  if (settings) {
    return settings;
  }

  try {
    // Fetch the settings
    const url = import.meta.env.DEV ? "/settings.json" : "../src/settings.json";
    const response = await fetch(url, { cache: "no-store" });

    // If the response failed, throw error
    if (!response.ok) {
      throw new Error("settings.json fetch failed");
    }

    // Merge with defaults
    settings = deepMerge(defaultSettings, await response.json());
  } catch (e) {
    // If an error, return the defaults
    console.error("Failed to load settings.json:", e);
    settings = defaultSettings;
  }

  return settings;
};
