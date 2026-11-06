import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { getSettings } from "./settings";

/** The live TSH payload. Null until TSH's first update. */
export const TSHDataContext = createContext(null);

/**
 * Returns the live TSH payload from context.
 *
 * @returns {object|null} The full payload, or null until TSH's first update arrives.
 */
export const useTSH = () => useContext(TSHDataContext);

/** The most recent program_state.json payload. */
let latestTSHPayload = null;

/** Stops the running poll loop, or null when nothing is polling. */
let stopPolling = null;

/** How many mounted `useTSHPolling` hooks need the poll loop running. */
let subscribers = 0;

/** URL of TSH's root folder, which its asset paths are relative to. Known once polling starts. */
let assetBase = null;

/**
 * Get the full URL of a TSH asset path (flags, character icons, logos) for the browser to load.
 *
 * @param {string} [asset] The relative path as TSH provides it. e.g. "./assets/..."
 * @returns {string|null} The URL, or null.
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
 * Starts polling TSH's program_state.json for changes.
 *
 * This will fire a `tsh_update` event on `document` with `{ data, oldData }` whenever it is updated.
 * After a failed check, the wait doubles up to `maxInterval` before trying again.
 *
 * @param {object} [options]
 * @param {number} [options.interval] Milliseconds to wait between checks.
 * @param {number} [options.maxInterval] Longest wait, in milliseconds, while checks are failing.
 * @returns {() => void} Stops the polling.
 */
const startTSHPolling = ({ interval = 64, maxInterval = 2000 } = {}) => {
  if (stopPolling) {
    return stopPolling;
  }

  let stopped = false;
  let timer = null;
  let url = null;
  let delay = interval;
  let failing = false;

  // Try to pull data from TSH repeatedly
  const poll = async () => {
    try {
      const response = await fetch(url, { cache: "no-store" });

      // If the response failed, throw error
      if (!response.ok) {
        throw new Error(`Failed to fetch TSH data (${response.status})`);
      }

      const data = await response.json();

      if (failing) {
        console.info("TSH polling recovered.");
      }

      failing = false;
      delay = interval;

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
      // TSH was mid-write, so the file was cut short: retry quietly
      if (e instanceof SyntaxError) {
        return;
      }

      // Log once per outage rather than on every retry
      if (!failing) {
        console.error("TSH polling error:", e);
      }

      failing = true;
      delay = Math.min(delay * 2, maxInterval);
    } finally {
      if (!stopped) {
        timer = setTimeout(poll, delay);
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
  const [tsh, setTSH] = useState(latestTSHPayload);

  useEffect(() => {
    const stop = startTSHPolling();
    subscribers++;
    setTSH(latestTSHPayload);

    const handler = (e) => setTSH(e.detail.data);

    document.addEventListener("tsh_update", handler);
    return () => {
      subscribers--;

      if (subscribers === 0) {
        stop();
      }

      document.removeEventListener("tsh_update", handler);
    };
  }, []);

  return tsh;
};
