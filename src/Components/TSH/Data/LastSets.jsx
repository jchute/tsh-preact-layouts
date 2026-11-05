import { createKeyField, createList, createTextField } from "../createField";
import { joinScores, SCORE_SEPARATOR } from "@Utils/format";
import { getLastSet, getLastSets } from "@State/selectors";

/**
 * A team's sets so far at this tournament, i.e. their run through the bracket. Every component
 * here takes `team` and `lastSet` (1 being the most recent). The characters played are shown with
 * the character components: `<CharacterName team={1} lastSet={1} opponent />`.
 *
 * TSH spells "opponent" as "oponent" in these keys.
 */

/** Builds a text component that shows one property of the set. */
const lastSetField = createKeyField(getLastSet);

/**
 * Builds a text component that shows a property of either side of the set. Shows the team's own
 * value by default, or the other side's with `opponent`.
 *
 * @param {string} key The property, without its "player_" / "oponent_" prefix.
 * @param {(value: any) => any} [clean] Tidies up the value, e.g. hiding TSH's 0 for "no seed".
 */
const ownOrOpponentField = (key, clean = (value) => value) => {
  return createTextField((tsh, { opponent = false, ...props }) => {
    return clean(getLastSet(tsh, props)?.[`${opponent ? "oponent" : "player"}_${key}`]);
  });
};

/** Repeats its children for each of the team's sets, newest first, passing the `lastSet` index. */
export const LastSets = createList(getLastSets);

/** The team's gamertag in that set, or the other side's with `opponent`. */
export const LastSetName = ownOrOpponentField("name");

/** The team's sponsor in that set, or the other side's with `opponent`. */
export const LastSetSponsor = ownOrOpponentField("team");

/** The team's seed, or the other side's with `opponent`. Empty when unseeded. */
export const LastSetSeed = ownOrOpponentField("seed", (seed) => seed || undefined);

/** The bracket phase the set was in, e.g. "Pools". */
export const LastSetPhase = lastSetField("phase_name");

/** The round the set was in, e.g. "Winners Round 2". */
export const LastSetRound = lastSetField("round_name");

/** Whether the team won that set: "W" or "L". Empty until both scores are known. */
export const LastSetResult = createTextField((tsh, props) => {
  const lastSet = getLastSet(tsh, props);
  const own = Number(lastSet?.player_score);
  const other = Number(lastSet?.oponent_score);

  if (lastSet?.player_score == null || lastSet?.oponent_score == null || own === other) {
    return undefined;
  }

  return own > other ? "W" : "L";
});

/** Game count for that set with the team's score first, e.g. "3 - 1". Takes `scoreSeparator`. */
export const LastSetScore = createTextField(
  (tsh, { scoreSeparator = SCORE_SEPARATOR, ...props }) => {
    const lastSet = getLastSet(tsh, props);

    return joinScores([lastSet?.player_score, lastSet?.oponent_score], scoreSeparator);
  },
);
