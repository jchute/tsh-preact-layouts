import { createCharacterFields } from "../createCharacterFields";
import { createList, createTextField } from "../createField";
import {
  getLastSet,
  getLastSetCharacter,
  getLastSetCharacters,
  getLastSets,
} from "@Utils/selectors";

// TSH spells "opponent" as "oponent" in these keys
const lastSetField = (key) => {
  return createTextField((game, { team, set }) => getLastSet(game, team, set)?.[key]);
};

export const LastSets = createList((game, { team }) => getLastSets(game, team));

export const LastSetOpponent = lastSetField("oponent_name");

export const LastSetOpponentSponsor = lastSetField("oponent_team");

export const LastSetOpponentSeed = createTextField((game, { team, set }) => {
  return getLastSet(game, team, set)?.oponent_seed || undefined;
});

export const LastSetPhase = lastSetField("phase_name");

export const LastSetRound = lastSetField("round_name");

// "W" or "L" from the team's point of view
export const LastSetResult = createTextField((game, { team, set }) => {
  const lastSet = getLastSet(game, team, set);

  if (!lastSet) {
    return undefined;
  }

  return lastSet.player_score > lastSet.oponent_score ? "W" : "L";
});

// The team's score first, e.g. "3 - 1"
export const LastSetScore = createTextField((game, { team, set, separator = " - " }) => {
  const lastSet = getLastSet(game, team, set);

  return lastSet ? `${lastSet.player_score}${separator}${lastSet.oponent_score}` : undefined;
});

// Characters played in the set. Same props as the player character components, plus `team`, `set`,
// and `opponent` to read the opponent's characters instead of the team's.
export const {
  Character: LastSetCharacter,
  CharacterAsset: LastSetCharacterAsset,
  CharacterName: LastSetCharacterName,
  CharacterSkin: LastSetCharacterSkin,
  Characters: LastSetCharacters,
} = createCharacterFields(getLastSetCharacter, getLastSetCharacters);
