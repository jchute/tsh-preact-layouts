import { getSettings } from "./SettingsLoader";

let data = {};
let oldData = {};

// Start listening to changes in TSH
export const startTSHPolling = async ({ interval = 64 } = {}) => {
  // Get the Settings
  const settings = await getSettings();

  // Determine the URL based on the import mode
  const url = import.meta.env.DEV ? settings.data_path?.dev : settings.data_path?.prod;

  // If, for some reason, no URL was given - we can't pull the data
  if (!url) {
    console.error("No state file defined in settings.json");
    return;
  }

  // Try to pull data from TSH repeatedly
  setInterval(async () => {
    try {
      // Store the previous result, so we only update when needed
      oldData = data;

      // Pull the data from TSG
      const response = await fetch(url, { cache: "no-store" });

      // If the response failed, throw error
      if (!response.ok) {
        throw new Error("Failed to fetch TSH data");
      }

      // Update our data
      data = await response.json();

      // Skip if data didn't change
      if (data.timestamp <= (oldData?.timestamp || 0)) {
        return;
      }

      // Setup a new Event
      const event = new CustomEvent("tsh_update", {
        detail: {
          data,
          oldData,
        },
      });

      // Trigger the new event
      document.dispatchEvent(event);
    } catch (e) {
      console.error("TSH polling error:", e);
    }
  }, interval);
};
