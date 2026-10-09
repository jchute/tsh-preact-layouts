import { getSettings } from "./SettingsLoader";

/** The most recent program_state.json payload. */
let latest = null;

/** Whether polling has begun, so it only ever runs once per page. */
let started = false;

/** URL of TSH's root folder, which its asset paths are relative to. Known once polling starts. */
let assetBase = null;

/**
 * Returns the newest copy of TSH's full state, for reading data outside of a `tsh_update` event.
 *
 * @returns {object|null} The program_state.json payload, or null if nothing has loaded yet.
 */
export const getLatestTSHData = () => latest;

/**
 * Turns a TSH asset path (flags, character icons, logos), which is relative to the TSH root
 * e.g. "./assets/...", into a full URL the browser can load.
 *
 * @param {string} [asset] The path as TSH provides it.
 * @returns {string|null} The URL, or null if there is no path or polling hasn't started yet.
 */
export const resolveAsset = (asset) => {
  return asset && assetBase ? new URL(asset, assetBase).href : null;
};

/**
 * Starts checking TSH's program_state.json for changes, firing a `tsh_update` event on `document`
 * with `{ data, oldData }` whenever it is updated. Calling it again does nothing.
 *
 * @param {object} [options]
 * @param {number} [options.interval] Milliseconds to wait between checks.
 */
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

  // program_state.json lives in TSH's `out/` folder, so the TSH root is one level above it
  assetBase = new URL("../", new URL(url, window.location.href)).href;

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
