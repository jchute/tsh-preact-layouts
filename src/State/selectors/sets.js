import { DEFAULTS } from "./defaults";
import { startAtOne } from "./helpers";
import { getScoreboard } from "./scoreboard";

/**
 * Previous and upcoming sets: a team's run at this tournament, its results at past tournaments,
 * the head-to-head between the current teams, every completed set on the stream, and the station
 * and stream queues.
 */

/**
 * Returns a team's sets so far at this tournament, newest first.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.team] Which scoreboard team.
 * @param {number|string} [props.scoreboard] Which scoreboard.
 * @returns {object} The sets, keyed by index.
 */
export const getLastSets = (tsh, { team = DEFAULTS.team, ...props } = {}) =>
  getScoreboard(tsh, props)?.last_sets?.[team] ?? {};

/**
 * Returns one of a team's sets so far at this tournament.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.lastSet] Which set.
 * @param {number|string} [props.team] Which scoreboard team.
 * @param {number|string} [props.scoreboard] Which scoreboard.
 * @returns {object|undefined} The set.
 */
export const getLastSet = (tsh, { lastSet = DEFAULTS.lastSet, ...props } = {}) =>
  getLastSets(tsh, props)[lastSet];

/**
 * Returns a team's placements at past tournaments, newest first.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.team] Which scoreboard team.
 * @param {number|string} [props.scoreboard] Which scoreboard.
 * @returns {object} The placements, keyed by index.
 */
export const getHistory = (tsh, { team = DEFAULTS.team, ...props } = {}) =>
  getScoreboard(tsh, props)?.history_sets?.[team] ?? {};

/**
 * Returns one of a team's placements at a past tournament.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.historyEntry] Which placement.
 * @param {number|string} [props.team] Which scoreboard team.
 * @param {number|string} [props.scoreboard] Which scoreboard.
 * @returns {object|undefined} The placement.
 */
export const getHistoryEntry = (tsh, { historyEntry = DEFAULTS.historyEntry, ...props } = {}) =>
  getHistory(tsh, props)[historyEntry];

/**
 * Returns previous sets between the two current teams, possibly at other tournaments.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.scoreboard] Which scoreboard.
 * @returns {object} The sets.
 */
export const getRecentSets = (tsh, props) =>
  startAtOne(getScoreboard(tsh, props)?.recent_sets?.sets);

/**
 * Returns one previous set between the two current teams.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.recentSet] Which set.
 * @param {number|string} [props.scoreboard] Which scoreboard.
 * @returns {object|undefined} The set.
 */
export const getRecentSet = (tsh, { recentSet = DEFAULTS.recentSet, ...props } = {}) =>
  getRecentSets(tsh, props)[recentSet];

/**
 * Returns the sets TSH has recorded as completed, newest first.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object} The sets, keyed by index.
 */
export const getCompletedSets = (tsh) => tsh?.completed_sets ?? {};

/**
 * Returns one completed set.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.completedSet] Which set.
 * @returns {object|undefined} The set.
 */
export const getCompletedSet = (tsh, { completedSet = DEFAULTS.completedSet } = {}) =>
  getCompletedSets(tsh)[completedSet];

/**
 * @typedef {object} QueueProps
 * @property {"station"|"stream"} [queue] Which queue: the scoreboard's station (default), or the
 * start.gg stream queue.
 * @property {string} [stream] Which stream's queue, by its start.gg name.
 * username set in TSH.
 * @property {number|string} [scoreboard] Which scoreboard, for the station queue.
 */

/**
 * Returns the upcoming sets on the scoreboard's station, after the one being played. Sets TSH
 * couldn't load are left empty.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.scoreboard] Which scoreboard.
 * @returns {object} The queued sets.
 */
export const getStationQueue = (tsh, props) => getScoreboard(tsh, props)?.station_queue ?? {};

/**
 * Returns a stream's queue on start.gg, in the order start.gg lists it, which can include the set
 * being played. TSH refreshes it whenever a set or station is loaded.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {QueueProps} [props]
 * @returns {object} The queued sets.
 */
export const getStreamQueue = (tsh, { stream } = {}) => {
  const queues = tsh?.streamQueue ?? {};
  const name = (stream ?? tsh?.currentStream ?? "").toLowerCase();
  const key = Object.keys(queues).find((streamName) => streamName.toLowerCase() === name);

  return key != null ? startAtOne(queues[key]) : {};
};

/**
 * Returns the station queue, or the stream queue with `queue="stream"`.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {QueueProps} [props]
 * @returns {object} The queued sets.
 */
export const getQueue = (tsh, { queue = "station", ...props } = {}) =>
  queue === "stream" ? getStreamQueue(tsh, props) : getStationQueue(tsh, props);

/**
 * Returns one upcoming set: its round, phase, best of, station and `team`s, which have the same
 * shape as the scoreboard's.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {QueueProps & { queuedSet?: number|string }} [props] `queuedSet` picks the set, 1 being
 * the first in the queue.
 * @returns {object|null|undefined} The set.
 */
export const getQueuedSet = (tsh, { queuedSet = DEFAULTS.queuedSet, ...props } = {}) =>
  getQueue(tsh, props)[queuedSet];
