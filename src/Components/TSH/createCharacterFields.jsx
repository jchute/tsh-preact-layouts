import { createImageField, createList, createTextField } from "./createField";
import { resolveAsset } from "@Utils/TshLoader";

/**
 * Builds the character components for any place TSH stores characters.
 *
 * @param {(game: object, props: object) => object} getCharacter Returns one character.
 * @param {(game: object, props: object) => object[]} getCharacters Returns all characters.
 */
export const createCharacterFields = (getCharacter, getCharacters) => ({
  /** The character's name, preferring TSH's display name over the English one. */
  CharacterName: createTextField((game, props) => {
    const character = getCharacter(game, props);

    return character?.display_name || character?.en_name || character?.name;
  }),

  /**
   * Image from TSH's game assets, already matching the skin selected in TSH.
   * `asset` picks the pack (e.g. "base_files/icon" or "full"), defaulting to the first one.
   * Pass it explicitly, since TSH doesn't list packs in the same order everywhere.
   */
  Character: createImageField((game, { asset, ...props }) => {
    const assets = getCharacter(game, props)?.assets ?? {};

    return resolveAsset((asset ? assets[asset] : Object.values(assets)[0])?.asset);
  }),

  /** TSH's 0-based skin (alt costume) index. Use `format={(skin) => skin + 1}` for 1-based numbering. */
  CharacterSkin: createTextField((game, props) => {
    const skin = getCharacter(game, props)?.skin;

    return skin >= 0 ? skin : undefined;
  }),

  /**
   * Repeats children for each character, passing the `character` index.
   * Renders nothing for TSH's empty placeholder (a single character with no name).
   */
  Characters: createList((game, props) => {
    const characters = getCharacters(game, props) ?? [];

    return characters.some((character) => character?.name) ? characters : [];
  }),
});
