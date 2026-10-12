import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { getSettings } from "./settings";

/**
 * Live TSH payload plus the scope: props (`scoreboard`, `team`, `player`...) that every field
 * inside reads unless it passes its own. The page sets the first scope, and scope wrappers like
 * `<Team>` add to it. Anything left unset falls back to `DEFAULTS` in the selectors.
 */
export const TSHContext = createContext({ tsh: null, scope: {} });

/**
 * Returns the TSH payload and the current scope from context. Null tsh until the first update.
 *
 * @returns {{ tsh: object|null, scope: object }}
 */
export const useTSH = () => useContext(TSHContext);

/** The most recent program_state.json payload. */
let latestTSHPayload = null;

/** Stops the running poll loop, or null when nothing is polling. */
let stopPolling = null;

/** URL of TSH's root folder, which its asset paths are relative to. Known once polling starts. */
let assetBase = null;

/**
 * Returns the newest copy of TSH's full state, for reading data outside of a `tsh_update` event.
 *
 * @returns {object|null} The program_state.json payload, or null if nothing has loaded yet.
 */
const getLatestTSHData = () => latestTSHPayload;

/**
 * Turns a TSH asset path (flags, character icons, logos), which is relative to the TSH root
 * e.g. "./assets/...", into a full URL the browser can load.
 *
 * @param {string} [asset] The path as TSH provides it.
 * @returns {string|null} The URL, or null if there is no path, it isn't a valid URL, or polling
 * hasn't started yet.
 */
export const resolveAsset = (asset) => {
  if (!asset || !assetBase) {
    return null;
  }

  try {
    return new URL(asset, assetBase).href;
  } catch {
    return null;
  }
};

/**
 * Starts checking TSH's program_state.json for changes, firing a `tsh_update` event on `document`
 * with `{ data, oldData }` whenever it is updated. Calling it while it's running does nothing.
 *
 * @param {object} [options]
 * @param {number} [options.interval] Milliseconds to wait between checks.
 * @returns {() => void} Stops the polling.
 */
const startTSHPolling = ({ interval = 64 } = {}) => {
  if (stopPolling) {
    return stopPolling;
  }

  let stopped = false;
  let timer = null;
  let url = null;

  // Try to pull data from TSH repeatedly
  const poll = async () => {
    try {
      const response = await fetch(url, { cache: "no-store" });

      // If the response failed, throw error
      if (!response.ok) {
        throw new Error(`Failed to fetch TSH data (${response.status})`);
      }

      const data = await response.json();

      // Skip if data didn't change, or polling stopped while the request was out
      if (stopped || (latestTSHPayload && data.timestamp <= (latestTSHPayload.timestamp || 0))) {
        return;
      }

      const oldData = latestTSHPayload ?? {};
      latestTSHPayload = data;

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
      if (!stopped) {
        timer = setTimeout(poll, interval);
      }
    }
  };

  const start = async () => {
    // Get the Settings
    const settings = await getSettings();

    // Determine the URL based on the import mode
    url = import.meta.env.DEV ? settings.data_path?.dev : settings.data_path?.build;

    // If, for some reason, no URL was given - we can't pull the data
    if (!url) {
      console.error("No state file defined in settings.json");
      return;
    }

    // program_state.json lives in TSH's `out/` folder, so the TSH root is one level above it
    assetBase = new URL("../", new URL(url, window.location.href)).href;

    if (!stopped) {
      poll();
    }
  };

  start();

  stopPolling = () => {
    stopped = true;
    clearTimeout(timer);
    stopPolling = null;
  };

  return stopPolling;
};

/**
 * Keeps TSH's full program_state.json up to date, starting the polling if nothing else has.
 *
 * @returns {object|null} The full payload, or null until TSH's first update arrives.
 */
export const useTSHPolling = () => {
  const [tsh, setTSH] = useState(getLatestTSHData);

  useEffect(() => {
    const stop = startTSHPolling();
    setTSH(getLatestTSHData());

    const handler = (e) => setTSH(e.detail.data);

    document.addEventListener("tsh_update", handler);
    return () => {
      stop();
      document.removeEventListener("tsh_update", handler);
    };
  }, []);

  return tsh;
};
