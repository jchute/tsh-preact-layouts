import { createCondition, createKeyField, createList, createTextField } from "../createField";
import {
  getBracket,
  getBracketRound,
  getBracketRounds,
  getBracketSet,
  getBracketSets,
} from "@State/selectors";

/**
 * TSH's bracket view. Components about a round take `bracketRound` (starting at 1), plus `losers`
 * for the losers side. Components about a set also take `bracketSet` (starting at 0, top to bottom)
 * and `team` (1 or 2) for which side of the set.
 *
 * Each side's details are in the bracket's seeded slots, read with the team and person components
 * and `source="bracket"`.
 */

/** Builds a text component that shows one property of the bracket. */
const bracketField = createKeyField(getBracket);

/**
 * Builds a text component that shows one side's value from a set's [side 1, side 2] pair.
 *
 * @param {string} key The pair's property on TSH's set, e.g. "score".
 */
const sideField = (key) =>
  createTextField((tsh, { team = 1, ...props }) => getBracketSet(tsh, props)?.[key]?.[team - 1]);

/** The phase the bracket shows, e.g. "Top 8". */
export const BracketPhase = bracketField("phase");

/** The pool within the phase, when there is one. */
export const BracketPhaseGroup = bracketField("phaseGroup");

/** Repeats its children for each round, passing the `bracketRound` index. Takes `losers`. */
export const BracketRounds = createList(getBracketRounds);

/** The round's name, e.g. "Winners Semi-Final". */
export const BracketRoundName = createTextField((tsh, props) => getBracketRound(tsh, props)?.name);

/** Repeats its children for each set in the round, passing the `bracketSet` index. */
export const BracketSets = createList(getBracketSets);

/** The name of the player or team on that side of the set. */
export const BracketSetName = sideField("playerName");

/** Games won by that side of the set. */
export const BracketSetScore = sideField("score");

/** Renders its children only once the set has been played. */
export const IfBracketSetCompleted = createCondition(
  (tsh, props) => getBracketSet(tsh, props)?.completed,
);
