import { createContext, h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { getSettings } from "./settings";

/** TSH.score entry used when none is specified on the page, a Scoreboard, or a field. */
export const DEFAULT_SCOREBOARD = 1;

/** Live TSH payload plus which scoreboard (TSH.score entry) fields should read by default. */
export const TSHContext = createContext({ tsh: null, scoreboard: DEFAULT_SCOREBOARD });

/**
 * Returns the TSH payload and default scoreboard from context. Null tsh until the first update.
 *
 * @returns {{ tsh: object|null, scoreboard: number|string }}
 */
export const useTSH = () => useContext(TSHContext);

/**
 * Sets the default scoreboard for this tree so children do not need `scoreboard` on every field.
 * Use this only to override the page default. A field can still pass `scoreboard` to read a
 * different TSH.score entry.
 *
 * @example
 * <Scoreboard scoreboard={2}>
 *   <DisplayName team={1} />
 * </Scoreboard>
 *
 * @param {object} props
 * @param {number|string} props.scoreboard Which TSH.score entry children should read.
 * @param {import("preact").ComponentChildren} props.children
 */
export const Scoreboard = ({ scoreboard, children }) => {
  const { tsh } = useContext(TSHContext);

  if (scoreboard == null) {
    return children;
  }

  return h(TSHContext.Provider, { value: { tsh, scoreboard } }, children);
};

/** The most recent program_state.json payload. */
let latestTSHPayload = null;

/** Whether polling has begun, so it only ever runs once per page. */
let startedPolling = false;

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
const startTSHPolling = async ({ interval = 64 } = {}) => {
  if (startedPolling) {
    return;
  }

  startedPolling = true;

  // Get the Settings
  const settings = await getSettings();

  // Determine the URL based on the import mode
  const url = import.meta.env.DEV ? settings.data_path?.dev : settings.data_path?.build;

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
      if (latestTSHPayload && data.timestamp <= (latestTSHPayload.timestamp || 0)) {
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
      setTimeout(poll, interval);
    }
  };

  poll();
};

/**
 * Keeps TSH's full program_state.json up to date, starting the polling if nothing else has.
 *
 * @returns {object|null} The full payload, or null until TSH's first update arrives.
 */
export const useTSHPolling = () => {
  const [tsh, setTSH] = useState(getLatestTSHData);

  useEffect(() => {
    startTSHPolling();
    setTSH(getLatestTSHData());

    const handler = (e) => setTSH(e.detail.data);

    document.addEventListener("tsh_update", handler);
    return () => document.removeEventListener("tsh_update", handler);
  }, []);

  return tsh;
};
