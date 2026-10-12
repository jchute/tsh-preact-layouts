import { createCharacterFields } from "../createCharacterFields";
import { createList, createTextField } from "../createField";
import {
  getLastSet,
  getLastSetCharacter,
  getLastSetCharacters,
  getLastSets,
} from "@State/selectors";

/**
 * A side's most recent sets at this tournament, i.e. their run through the bracket so far.
 * Every component here takes `team`, and `set` (1 being the most recent).
 */

/**
 * Builds a text component that shows one property of a previous set. TSH spells "opponent" as
 * "oponent" in these keys.
 *
 * @param {string} key Property name on TSH's last-set object.
 */
const lastSetField = (key) => {
  return createTextField(
    (tsh, { team, set, scoreboard }) => getLastSet(tsh, team, set, scoreboard)?.[key],
  );
};

/** Repeats its children for each of the side's recent sets, newest first. */
export const LastSets = createList((tsh, { team, scoreboard }) =>
  getLastSets(tsh, team, scoreboard),
);

/** Who the side played in that set. */
export const LastSetOpponent = lastSetField("oponent_name");

/** The sponsor of who the side played. */
export const LastSetOpponentSponsor = lastSetField("oponent_team");

/** The seed of who the side played. Empty when they were unseeded. */
export const LastSetOpponentSeed = createTextField((tsh, { team, set, scoreboard }) => {
  return getLastSet(tsh, team, set, scoreboard)?.oponent_seed || undefined;
});

/** The bracket phase the set was in, e.g. "Pools". */
export const LastSetPhase = lastSetField("phase_name");

/** The round the set was in, e.g. "Winners Round 2". */
export const LastSetRound = lastSetField("round_name");

/** Whether the side won that set: "W" or "L". */
export const LastSetResult = createTextField((tsh, { team, set, scoreboard }) => {
  const lastSet = getLastSet(tsh, team, set, scoreboard);

  if (!lastSet) {
    return undefined;
  }

  return lastSet.player_score > lastSet.oponent_score ? "W" : "L";
});

/** Game count for that set with the side's score first, e.g. "3 - 1". */
export const LastSetScore = createTextField((tsh, { team, set, separator = " - ", scoreboard }) => {
  const lastSet = getLastSet(tsh, team, set, scoreboard);

  return lastSet ? `${lastSet.player_score}${separator}${lastSet.oponent_score}` : undefined;
});

/**
 * Characters played in that set. Same props as the player character components, plus `opponent`
 * to read the opponent's characters instead of the side's.
 */
export const {
  Character: LastSetCharacter,
  CharacterName: LastSetCharacterName,
  CharacterSkin: LastSetCharacterSkin,
  Characters: LastSetCharacters,
} = createCharacterFields(getLastSetCharacter, getLastSetCharacters);
