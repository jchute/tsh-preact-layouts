import { DEFAULTS } from "./defaults";

/**
 * TSH.score:
 *
 * The score object holds a global property for the bracket type
 * as well as a global object for the ruleset.
 *
 * There is also an entry added for each scoreboard labeled by their position ("1", "2", etc.)
 */

/**
 * Returns a single scoreboard object.
 *
 * Each scoreboard object contains round and phase data, team data, stream data, and more.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.scoreboard] Which scoreboard. Defaults to the first.
 * @returns {object|undefined} The scoreboard.
 */
export const getScore = (tsh, { scoreboard = DEFAULTS.scoreboard } = {}) =>
  tsh?.score?.[scoreboard];

/**
 * Returns the ruleset selected in TSH: its name, stage lists, ban count and so on.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The ruleset.
 */
export const getRuleset = (tsh) => tsh?.score?.ruleset;

/**
 * Returns the ruleset's starter (neutral) stages, or its counterpick stages, as an array.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {boolean} [props.counterpick] Whether to return counterpick stages instead.
 * @param {boolean} [props.all] Whether to return all stages, including counterpick stages.
 * @returns {object[]} The stages.
 */
export const getStages = (tsh, { counterpick = false, all = false } = {}) => {
  const ruleset = getRuleset(tsh);
  const neutralStages = ruleset?.neutralStages ?? [];
  const counterpickStages = ruleset?.counterpickStages ?? [];

  if (all) {
    return [...neutralStages, ...counterpickStages];
  }

  return counterpick ? counterpickStages : neutralStages;
};

/**
 * Returns one of the ruleset's stages.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number} [props.stage] Which stage. Defaults to 0.
 * @param {boolean} [props.counterpick] Whether to read the counterpick list.
 * @returns {object|undefined} The stage.
 */
export const getStage = (tsh, { stage = DEFAULTS.stage, ...props } = {}) =>
  getStages(tsh, props)[stage];
