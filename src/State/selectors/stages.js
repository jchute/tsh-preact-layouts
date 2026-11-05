import { DEFAULTS } from "./defaults";
import { startAtOne } from "./helpers";
import { getGame, getScoreboard } from "./scoreboard";

/**
 * Stages, and the three places TSH keeps them:
 *
 * - The ruleset's stage list: its starters (neutral stages) or, with `counterpick`, its
 *   counterpicks. `all` gives both. `stage` picks one, starting at 1.
 * - The set's games (see `getGames`): each one's stage is the stage chosen for that game.
 *   `game` picks one, starting at 1.
 * - The stage strike: which stages are struck, whose turn it is and which stage was picked.
 *
 * `getStage` finds one stage from any of them, so the stage components work with all three:
 * a ruleset stage by default, the stage of a game with `game`, or the stage strike's pick with
 * `selected`.
 */

/**
 * @typedef {object} StageProps
 * @property {number} [stage] Which ruleset stage, starting at 1. Defaults to 1.
 * @property {boolean} [counterpick] Read the counterpick list instead of the starters.
 * @property {boolean} [all] Read the starters followed by the counterpicks.
 * @property {number} [game] Read the stage chosen for this game of the set instead.
 * @property {boolean} [selected] Read the stage picked in the stage strike instead.
 * @property {number|string} [scoreboard] Which scoreboard, for `game` and the stage strike.
 */

/**
 * Returns the ruleset selected in TSH: its name, stage lists, ban count and so on.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The ruleset.
 */
export const getRuleset = (tsh) => tsh?.score?.ruleset;

/**
 * Returns the ruleset's starter stages, its counterpick stages, or both.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {StageProps} [props]
 * @returns {object} The stages.
 */
export const getRulesetStages = (tsh, { counterpick = false, all = false } = {}) => {
  const ruleset = getRuleset(tsh);
  const starters = ruleset?.neutralStages ?? [];
  const counterpicks = ruleset?.counterpickStages ?? [];

  if (all) {
    return startAtOne([...starters, ...counterpicks]);
  }

  return startAtOne(counterpick ? counterpicks : starters);
};

/**
 * Returns TSH's stage strike state. Stages are referred to by their `codename`.
 *
 * - `currGame`: the game being struck for, starting at 0.
 * - `currPlayer`: the team striking or picking, 0 or 1, or -1 before rock-paper-scissors.
 * - `strikedStages`: the stages struck in each step for the current game.
 * - `strikedBy`: the stages each team struck for the current game.
 * - `stagesWon`: the stages each team has won a game on.
 * - `stagesPicked`: the stages already played.
 * - `selectedStage` and `selectedStageData`: the stage picked for the current game.
 * - `gentlemans`: both teams agreed on a stage, skipping the strikes.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ scoreboard?: number|string }} [props]
 * @returns {object|undefined} The stage strike.
 */
export const getStageStrike = (tsh, props) =>
  getScoreboard(tsh, props)?.stage_strike ?? tsh?.score?.[DEFAULTS.scoreboard]?.stage_strike;

/**
 * Returns one stage: from the ruleset by default, the stage of a game with `game`, or the stage
 * strike's pick with `selected`.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {StageProps} [props]
 * @returns {object|undefined} The stage, with its `codename`, names and image `path`.
 */
export const getStage = (
  tsh,
  { stage = DEFAULTS.stage, game, selected = false, ...props } = {},
) => {
  if (game != null) {
    return getGame(tsh, { ...props, game });
  }

  if (selected) {
    return getStageStrike(tsh, props)?.selectedStageData ?? undefined;
  }

  return getRulesetStages(tsh, props)[stage];
};

/**
 * Returns true when a stage has been struck for the current game.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {StageProps} [props]
 * @returns {boolean} Whether the stage is struck.
 */
export const isStageStruck = (tsh, props) => {
  const codename = getStage(tsh, props)?.codename;
  const struck = getStageStrike(tsh, props)?.strikedStages ?? [];

  return Boolean(codename) && struck.flat().includes(codename);
};

/**
 * Returns which team struck a stage for the current game.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {StageProps} [props]
 * @returns {1|2|undefined} The team, or undefined when the stage isn't struck.
 */
export const getStageStruckBy = (tsh, props) => {
  const codename = getStage(tsh, props)?.codename;
  const struckBy = getStageStrike(tsh, props)?.strikedBy ?? [];
  const team = codename ? struckBy.findIndex((stages) => stages?.includes(codename)) : -1;

  return team >= 0 ? team + 1 : undefined;
};

/**
 * Returns true when the ruleset's DSR or modified DSR rule stops a stage from being picked.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {StageProps} [props]
 * @returns {boolean} Whether the stage is banned.
 */
export const isStageBanned = (tsh, props) => {
  const codename = getStage(tsh, props)?.codename;
  const strike = getStageStrike(tsh, props);
  const ruleset = getRuleset(tsh);
  let banned = [];

  if (ruleset?.useDSR) {
    banned = strike?.stagesPicked ?? [];
  } else if (ruleset?.useMDSR && strike?.lastWinner >= 0) {
    banned = strike?.stagesWon?.[(strike.lastWinner + 1) % 2] ?? [];
  }

  return Boolean(codename) && banned.includes(codename);
};

/**
 * Returns true when a stage is the one picked in the stage strike.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {StageProps} [props]
 * @returns {boolean} Whether the stage is picked.
 */
export const isStageSelected = (tsh, props) => {
  const codename = getStage(tsh, props)?.codename;

  return Boolean(codename) && codename === getStageStrike(tsh, props)?.selectedStage;
};

/**
 * Returns the team whose turn it is to strike or pick a stage.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ scoreboard?: number|string }} [props]
 * @returns {1|2|undefined} The team, or undefined before rock-paper-scissors is decided.
 */
export const getStageStrikeTurn = (tsh, props) => {
  const team = getStageStrike(tsh, props)?.currPlayer;

  return team >= 0 ? team + 1 : undefined;
};

/**
 * Returns true when the stage strike is waiting for a stage to be picked rather than struck.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ scoreboard?: number|string }} [props]
 * @returns {boolean} Whether a stage is being picked.
 */
export const isStageStrikePicking = (tsh, props) => {
  const strike = getStageStrike(tsh, props);

  return Boolean(strike?.gentlemans || (strike?.currGame > 0 && strike?.currStep > 0));
};
