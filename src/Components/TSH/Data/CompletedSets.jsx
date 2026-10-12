import { createKeyField, createList, createScope, createTextField } from "../createField";
import { getCompletedSet, getCompletedSets } from "@State/selectors";
import { joinScores } from "@Utils/format";

/**
 * Sets TSH has recorded as completed, such as for a results ticker. Every component here takes
 * `completedSet` (1 being the most recent). Components about one side show the winner by default,
 * or the loser with `loser`.
 */

/** Builds a text component that shows one property of the set. */
const completedSetField = createKeyField(getCompletedSet);

/**
 * Builds a text component that shows a property of the winner, or of the loser with `loser`.
 *
 * @param {string} key The property, without its "winner_" / "loser_" prefix.
 */
const sideField = (key) => {
  return createTextField((tsh, { loser = false, ...props }) => {
    return getCompletedSet(tsh, props)?.[`${loser ? "loser" : "winner"}_${key}`] || undefined;
  });
};

/** Sets `completedSet` for everything inside. Takes `loser` too. */
export const CompletedSet = createScope("completedSet");

/** Repeats its children for each completed set, newest first, passing the `completedSet` index. */
export const CompletedSets = createList(getCompletedSets);

/** The winner's name with their sponsor, e.g. "YTS | Jonch". Use `loser` for the loser's. */
export const CompletedSetName = sideField("team_name");

/** The winner's seed, or the loser's with `loser`. Empty when unseeded. */
export const CompletedSetSeed = sideField("seed");

/** The bracket phase the set was in, e.g. "Top 8". */
export const CompletedSetPhase = completedSetField("phase_name");

/** The round the set was in, e.g. "Grand Final". */
export const CompletedSetRound = completedSetField("round_name");

/** Game count with the winner's score first, e.g. "3 - 1". Takes `separator`. */
export const CompletedSetScore = createTextField((tsh, { separator = " - ", ...props }) => {
  const set = getCompletedSet(tsh, props);

  return joinScores([set?.winner_score, set?.loser_score], separator);
});
