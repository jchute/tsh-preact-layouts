import { getSettings } from "./SettingsLoader";

let latest = null;
let started = false;

// The most recent program_state.json payload, or null if nothing has loaded yet
export const getLatestTSHData = () => latest;

// Start listening to changes in TSH
export const startTSHPolling = async ({ interval = 64 } = {}) => {
  if (started) {
    return;
  }

  started = true;

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
  const poll = async () => {
    try {
      const response = await fetch(url, { cache: "no-store" });

      // If the response failed, throw error
      if (!response.ok) {
        throw new Error(`Failed to fetch TSH data (${response.status})`);
      }

      const data = await response.json();

      // Skip if data didn't change
      if (latest && data.timestamp <= (latest.timestamp || 0)) {
        return;
      }

      const oldData = latest ?? {};
      latest = data;

      // Trigger the new event
      document.dispatchEvent(
        new CustomEvent("tsh_update", {
          detail: {
            data,
            oldData,
          },
        }),
      );
    } catch (e) {
      console.error("TSH polling error:", e);
    } finally {
      setTimeout(poll, interval);
    }
  };

  poll();
};
