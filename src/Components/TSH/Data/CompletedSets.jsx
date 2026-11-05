import { createKeyField, createList, createTextField } from "../createField";
import { joinScores, NAME_SEPARATOR, SCORE_SEPARATOR } from "@Utils/format";
import { getCompletedSet, getCompletedSets } from "@State/selectors";

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
const winnerOrLoserField = (key) => {
  return createTextField((tsh, { loser = false, ...props }) => {
    return getCompletedSet(tsh, props)?.[`${loser ? "loser" : "winner"}_${key}`] || undefined;
  });
};

/** Repeats its children for each completed set, newest first, passing the `completedSet` index. */
export const CompletedSets = createList(getCompletedSets);

/** The winner's name with their sponsor, e.g. "YTS | Jonch". Use `loser` for the loser's. */
export const CompletedSetName = winnerOrLoserField("team_name");

/**
 * Every player's gamertag on the winning side, e.g. "Jonch / Stag", or the losing side's with
 * `loser`. `playerNamesSeparator` changes the text between them.
 */
export const CompletedSetPlayerNames = createTextField(
  (tsh, { loser = false, playerNamesSeparator = NAME_SEPARATOR, ...props }) => {
    const players = getCompletedSet(tsh, props)?.[`${loser ? "loser" : "winner"}_team`] ?? {};

    return (
      Object.values(players)
        .map((player) => player?.gamertag)
        .filter(Boolean)
        .join(playerNamesSeparator) || undefined
    );
  },
);

/** The winner's seed, or the loser's with `loser`. Empty when unseeded. */
export const CompletedSetSeed = winnerOrLoserField("seed");

/** The bracket phase the set was in, e.g. "Top 8". */
export const CompletedSetPhase = completedSetField("phase_name");

/** The round the set was in, e.g. "Grand Final". */
export const CompletedSetRound = completedSetField("round_name");

/** Game count with the winner's score first, e.g. "3 - 1". Takes `scoreSeparator`. */
export const CompletedSetScore = createTextField(
  (tsh, { scoreSeparator = SCORE_SEPARATOR, ...props }) => {
    const set = getCompletedSet(tsh, props);

    return joinScores([set?.winner_score, set?.loser_score], scoreSeparator);
  },
);
