import { createCondition, createList, createTextField } from "../createField";
import { DEFAULTS, getGame, getGames, getGameWinner } from "@State/selectors";

/**
 * The games of the current set, from TSH's game tracker, which has to be turned on in TSH's
 * settings. Every component here takes `game` (starting at 1). Each game's stage is shown with
 * the stage components: `<StageName game={1} />`.
 *
 * @example
 * <Games>
 *   {(game) => (
 *     <>
 *       <StageName game={game} />
 *       <IfGameWon game={game} team={1}>✔</IfGameWon>
 *     </>
 *   )}
 * </Games>
 */

/** Repeats its children for each game the set can last, passing the `game` index. */
export const Games = createList(getGames);

/** The team that won the game: 1 or 2. Empty before it's decided, or for a tie. */
export const GameWinner = createTextField(getGameWinner);

/** Renders its children only when `team` (default 1) won the game. */
export const IfGameWon = createCondition((tsh, { team = DEFAULTS.team, ...props }) => {
  return getGame(tsh, props)?.[`t${team}_win`];
});

/** Renders its children only when the game was a tie. */
export const IfGameTie = createCondition((tsh, props) => getGame(tsh, props)?.tie);

/** Renders its children only once the game has a result: a winner or a tie. */
export const IfGamePlayed = createCondition((tsh, props) => {
  const game = getGame(tsh, props);

  return game?.t1_win || game?.t2_win || game?.tie;
});
