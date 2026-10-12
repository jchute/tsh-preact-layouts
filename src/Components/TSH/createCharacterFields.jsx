import { createImageField, createList, createTextField } from "./createField";
import { resolveAsset } from "@State/tsh";

/**
 * Builds the character components for any place TSH stores characters.
 *
 * @param {(tsh: object, props: object) => object} getCharacter Returns one character.
 * @param {(tsh: object, props: object) => object[]} getCharacters Returns all characters.
 */
export const createCharacterFields = (getCharacter, getCharacters) => ({
  /** The character's name, preferring TSH's display name over the English one. */
  CharacterName: createTextField((tsh, props) => {
    const character = getCharacter(tsh, props);

    return character?.display_name || character?.en_name || character?.name;
  }),

  /**
   * Image from TSH's game assets, already matching the skin selected in TSH.
   * `asset` picks the pack (e.g. "base_files/icon" or "full"), defaulting to the first one.
   * Pass it explicitly, since TSH doesn't list packs in the same order everywhere.
   */
  Character: createImageField((tsh, { asset, ...props }) => {
    const assets = getCharacter(tsh, props)?.assets ?? {};

    return resolveAsset((asset ? assets[asset] : Object.values(assets)[0])?.asset);
  }),

  /** TSH's 0-based skin (alt costume) index. Use `format={(skin) => skin + 1}` for 1-based numbering. */
  CharacterSkin: createTextField((tsh, props) => {
    const skin = getCharacter(tsh, props)?.skin;

    return skin >= 0 ? skin : undefined;
  }),

  /**
   * Repeats children for each character, passing the `character` index.
   * Renders nothing for TSH's empty placeholder (a single character with no name).
   */
  Characters: createList((tsh, props) => {
    const characters = getCharacters(tsh, props) ?? [];

    return characters.some((character) => character?.name) ? characters : [];
  }),
});
