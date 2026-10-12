import { DEFAULTS } from "./defaults";
import { getScore } from "./score";

/**
 * Previous and upcoming sets: a team's run at this tournament, its results at past tournaments,
 * the head-to-head between the current teams, every completed set on the stream, and the station
 * queue.
 */

/**
 * Returns a team's sets so far at this tournament, newest first.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.team] Which scoreboard team. Defaults to 1.
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object} The sets, keyed by index.
 */
export const getLastSets = (tsh, { team = DEFAULTS.team, ...props } = {}) =>
  getScore(tsh, props)?.last_sets?.[team] ?? {};

/**
 * Returns one of a team's sets so far at this tournament.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.lastSet] Which set. Defaults to 1.
 * @param {number|string} [props.team] Which scoreboard team. Defaults to 1.
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object|undefined} The set.
 */
export const getLastSet = (tsh, { lastSet = DEFAULTS.lastSet, ...props } = {}) =>
  getLastSets(tsh, props)[lastSet];

/**
 * Returns a team's placements at past tournaments, newest first.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.team] Which scoreboard team. Defaults to 1.
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object} The placements, keyed by index.
 */
export const getHistory = (tsh, { team = DEFAULTS.team, ...props } = {}) =>
  getScore(tsh, props)?.history_sets?.[team] ?? {};

/**
 * Returns one of a team's placements at a past tournament.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.historyEntry] Which placement. Defaults to 1.
 * @param {number|string} [props.team] Which scoreboard team. Defaults to 1.
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object|undefined} The placement.
 */
export const getHistoryEntry = (tsh, { historyEntry = DEFAULTS.historyEntry, ...props } = {}) =>
  getHistory(tsh, props)[historyEntry];

/**
 * Returns previous sets between the two current teams, possibly at other tournaments, as an array
 * starting at 0.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object[]} The sets.
 */
export const getRecentSets = (tsh, props) => getScore(tsh, props)?.recent_sets?.sets ?? [];

/**
 * Returns one previous set between the two current teams.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.recentSet] Which set. Defaults to 0.
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
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
 * @param {number|string} [props.completedSet] Which set. Defaults to 1.
 * @returns {object|undefined} The set.
 */
export const getCompletedSet = (tsh, { completedSet = DEFAULTS.completedSet } = {}) =>
  getCompletedSets(tsh)[completedSet];

/**
 * Returns the upcoming sets on the scoreboard's station, after the one being played. Sets TSH
 * couldn't load are left empty.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object} The queued sets, keyed by index starting at 1.
 */
export const getStationQueue = (tsh, props) => getScore(tsh, props)?.station_queue ?? {};

/**
 * Returns one upcoming set on the scoreboard's station: its round, phase, best of, station and
 * `team`s, which have the same shape as the scoreboard's.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.queuedSet] Which set, 1 being the next. Defaults to 1.
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object|null|undefined} The set.
 */
export const getQueuedSet = (tsh, { queuedSet = DEFAULTS.queuedSet, ...props } = {}) =>
  getStationQueue(tsh, props)[queuedSet];
