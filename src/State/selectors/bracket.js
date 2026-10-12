/**
 * TSH's bracket view. TSH keys winners rounds 1, 2, 3... and losers rounds -1, -2, -3..., so
 * these selectors take `losers` to pick a side of the bracket, and `bracketRound` (starting at 1)
 * to pick a round on that side.
 */

/**
 * @typedef {{ losers?: boolean, bracketRound?: number, bracketSet?: number }} BracketProps
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
export const getBracketRound = (tsh, { bracketRound = 1, losers = false } = {}) =>
  getBracket(tsh)?.bracket?.rounds?.[losers ? -bracketRound : bracketRound];

/**
 * Returns the sets in one round of the bracket, top to bottom, keyed from 0.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {BracketProps} [props]
 * @returns {object} The sets.
 */
export const getBracketSets = (tsh, props) => getBracketRound(tsh, props)?.sets ?? {};

/**
 * Returns one set in a round of the bracket.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {BracketProps} [props]
 * @returns {object|undefined} The set.
 */
export const getBracketSet = (tsh, { bracketSet = 0, ...props } = {}) =>
  getBracketSets(tsh, props)[bracketSet];
