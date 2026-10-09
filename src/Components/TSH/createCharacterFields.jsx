import { createImageField, createList, createTextField } from "./createField";
import { getCharacterPath } from "@Utils/CharacterLoader";
import { resolveAsset } from "@Utils/TshLoader";

/**
 * Builds the character components for any place TSH stores characters.
 *
 * @param {(game: object, props: object) => object} getCharacter Returns one character.
 * @param {(game: object, props: object) => object[]} getCharacters Returns all characters.
 */
export const createCharacterFields = (getCharacter, getCharacters) => ({
  CharacterName: createTextField((game, props) => {
    const character = getCharacter(game, props);

    return character?.display_name || character?.en_name || character?.name;
  }),

  // Single-color SVG from src/Assets/Images/Characters, matched by character name.
  // Uses `<name>-<skin>.svg` when it exists for the skin selected in TSH, or for the `skin` prop when given.
  Character: createImageField((game, { skin, ...props }) => {
    const character = getCharacter(game, props);
    const name = character?.en_name || character?.name;

    return name ? getCharacterPath(name, skin ?? character.skin) : null;
  }),

  // Image from TSH's own game assets, already matching the skin selected in TSH.
  // `asset` picks the pack (e.g. "base_files/icon" or "full"), defaulting to the first one.
  CharacterAsset: createImageField(
    (game, { asset, ...props }) => {
      const assets = getCharacter(game, props)?.assets ?? {};

      return resolveAsset((asset ? assets[asset] : Object.values(assets)[0])?.asset);
    },
    { mask: false },
  ),

  // TSH's 0-based skin (alt costume) index. Use `format={(skin) => skin + 1}` for 1-based numbering.
  CharacterSkin: createTextField((game, props) => {
    const skin = getCharacter(game, props)?.skin;

    return skin >= 0 ? skin : undefined;
  }),

  // Repeats children for each character, passing the `character` index.
  // Renders nothing for TSH's empty placeholder (a single character with no name).
  Characters: createList((game, props) => {
    const characters = getCharacters(game, props) ?? [];

    return characters.some((character) => character?.name) ? characters : [];
  }),
});
