let settings = null;

// Default options for settings.json
const defaultSettings = {
  data_path: {
    dev: "../../out/program_state.json",
    prod: "../../out/program_state.json",
  },
  images: {
    facebook_logo: "facebook.png",
    organizer_logo: "organizer.png",
    twitch_logo: "twitch.png",
    twitter_logo: "twitter.png",
    venue_logo: "venue.png",
    youtube_logo: "youtube.png",
  },
  text: {
    banner: "",
    facebook: "",
    twitch: "",
    twitter: "",
    youtube: "",
  },
  styles: {
    dev_body: "rebeccapurple",
  },
};

// Utility function to merge objects
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

// Create a mapping of filename to URL
const imageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, module]) => {
    const filename = path.split("/").pop();
    return [filename, module.default || module];
  }),
);

// Helper function to resolve image paths
const resolveImagePath = (path) => {
  if (!path) return null;

  return imageMap[path] || path;
};

// Load the settings.json file from ./src
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

    // Update the settings
    const json = await response.json();

    // Merge with defaults
    settings = deepMerge(defaultSettings, json);

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
