import { createImageField, createTextField } from "../createField";
import { getCharacterPath } from "@Utils/CharacterLoader";
import { getCharacter, getPlayer } from "@Utils/selectors";

const playerField = (key) => {
  return createTextField((game, { team, player }) => getPlayer(game, team, player)?.[key]);
};

const characterName = (game, { team, player, character }) => {
  return getCharacter(game, team, player, character)?.en_name;
};

export const Alias = playerField("name");

export const Avatar = createImageField((game, { team, player }) => {
  return getPlayer(game, team, player)?.online_avatar;
});

export const Character = createImageField((game, props) => {
  const name = characterName(game, props);

  return name ? getCharacterPath(name) : null;
});

export const CharacterName = createTextField(characterName);

export const Name = playerField("real_name");

export const Pronoun = playerField("pronoun");

export const Seed = playerField("seed");

export const Tag = playerField("team");
