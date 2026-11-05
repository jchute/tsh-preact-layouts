import { DEFAULTS } from "./defaults";

/**
 * The scoreboard contains the set being played on stream,
 * its games and results, and the bracket type.
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
export const getScoreboard = (tsh, { scoreboard = DEFAULTS.scoreboard } = {}) =>
  tsh?.score?.[scoreboard];

/**
 * Returns the bracket type.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {string|undefined} The bracket type.
 */
export const getBracketType = (tsh) => tsh?.score?.bracket_type;

/**
 * Returns every game of the scoreboard's set, from TSH's game tracker. Each is the stage chosen
 * for it, plus `t1_win`, `t2_win` and `tie` for its result. Empty when the game tracker is turned
 * off in TSH.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ scoreboard?: number|string }} [props]
 * @returns {object} The games.
 */
export const getGames = (tsh, props) => getScoreboard(tsh, props)?.stages ?? {};

/**
 * Returns one game of the set.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ game?: number, scoreboard?: number|string }} [props] `game` starts at 1.
 * @returns {object|undefined} The game.
 */
export const getGame = (tsh, { game = DEFAULTS.game, ...props } = {}) => getGames(tsh, props)[game];

/**
 * Returns which team won a game of the set.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ game?: number, scoreboard?: number|string }} [props]
 * @returns {1|2|undefined} The winning team, or undefined before it's decided or for a tie.
 */
export const getGameWinner = (tsh, props) => {
  const game = getGame(tsh, props);

  if (game?.t1_win) {
    return 1;
  }

  return game?.t2_win ? 2 : undefined;
};
