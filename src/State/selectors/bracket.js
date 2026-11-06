import { DEFAULTS } from "./defaults";
import { startAtOne } from "./helpers";

/**
 * TSH's bracket view. TSH keys winners rounds 1, 2, 3... and losers rounds -1, -2, -3..., so
 * these selectors take `losers` to pick a side of the bracket, and `bracketRound` to pick a
 * round on that side. `bracketSet` picks a set in the round.
 */

/**
 * @typedef {{
 *   losers?: boolean,
 *   bracketRound?: number,
 *   bracketSet?: number,
 *   bracketSide?: number,
 * }} BracketProps
 */

/**
 * Returns the bracket's phase details (`phase`, `phaseGroup`) and its rounds.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The bracket.
 */
export const getBracket = (tsh) => tsh?.bracket;

/**
 * Returns the winners rounds, or the losers rounds, keyed 1, 2, 3... in the order they're played.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {BracketProps} [props] `losers` picks the losers side.
 * @returns {object} The rounds.
 */
export const getBracketRounds = (tsh, { losers = false } = {}) => {
  const rounds = getBracket(tsh)?.bracket?.rounds ?? {};

  return Object.fromEntries(
    Object.entries(rounds)
      .filter(([key]) => Number(key) < 0 === losers)
      .map(([key, round]) => [Math.abs(Number(key)), round]),
  );
};

/**
 * Returns one round of the bracket.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {BracketProps} [props]
 * @returns {object|undefined} The round.
 */
export const getBracketRound = (
  tsh,
  { bracketRound = DEFAULTS.bracketRound, losers = false } = {},
) => getBracket(tsh)?.bracket?.rounds?.[losers ? -bracketRound : bracketRound];

/**
 * Returns the sets in one round of the bracket, top to bottom.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {BracketProps} [props]
 * @returns {object} The sets.
 */
export const getBracketSets = (tsh, props) => startAtOne(getBracketRound(tsh, props)?.sets);

/**
 * Returns one set in a round of the bracket.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {BracketProps} [props]
 * @returns {object|undefined} The set.
 */
export const getBracketSet = (tsh, { bracketSet = DEFAULTS.bracketSet, ...props } = {}) =>
  getBracketSets(tsh, props)[bracketSet];

/**
 * Returns the bracket slot playing on one side of a set: the `team` to pass with
 * `source="bracket"` to read that side's details.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {BracketProps} [props] `bracketSide` picks the side, 1 or 2. Defaults to 1.
 * @returns {number|undefined} The slot, or undefined for a bye or a side not yet decided.
 */
export const getBracketSetSlot = (tsh, { bracketSide = DEFAULTS.bracketSide, ...props } = {}) => {
  const slot = getBracketSet(tsh, props)?.playerId?.[bracketSide - 1];

  return slot > 0 ? slot : undefined;
};
