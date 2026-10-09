/** The loaded settings, cached after the first `getSettings` call. */
let settings = null;

/**
 * Default options for settings.json, used for anything the file leaves out.
 *
 * - `data_path`: where TSH's program_state.json is, relative to the page, in dev and in a build.
 * - `images`: named images for screens to use, either a filename in src/Assets/Images or a URL.
 * - `styles.dev_body`: page background in dev, so transparent overlays are easier to see.
 */
const defaultSettings = {
  data_path: {
    dev: "../../out/program_state.json",
    prod: "../../out/program_state.json",
  },
  images: {},
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

// Import all images from the assets/images directory
const imageModules = import.meta.glob("@Assets/Images/*.(png|jpg|jpeg|gif|svg|webp)", {
  eager: true,
});

/** Bundled URL for every image in src/Assets/Images, keyed by filename, e.g. "logo.png". */
const imageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, module]) => {
    const filename = path.split("/").pop();
    return [filename, module.default || module];
  }),
);

/**
 * Turns an image from settings.json into a usable URL. Filenames of bundled images map to their
 * built URL, and anything else (e.g. an external link) is passed through as-is.
 *
 * @param {string} path A filename in src/Assets/Images, or a URL.
 * @returns {string|null} The image URL, or null when no path was given.
 */
const resolveImagePath = (path) => {
  if (!path) return null;

  return imageMap[path] || path;
};

/**
 * Loads settings.json and fills any gaps with the defaults. The result is cached, and the
 * defaults are used alone if the file is missing or invalid.
 *
 * @returns {Promise<object>} The settings, with `images` already resolved to URLs.
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

    // Resolve image paths in logo settings
    if (settings.images) {
      Object.keys(settings.images).forEach((key) => {
        settings.images[key] = resolveImagePath(settings.images[key]);
      });
    }
  } catch (e) {
    // If an error, return the defaults
    console.error("Failed to load settings.json:", e);
    settings = defaultSettings;
  }

  return settings;
};
