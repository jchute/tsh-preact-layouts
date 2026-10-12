import { createImageField, createList, createTextField } from "../createField";
import { getCharacter, getCharacters } from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Characters, read from wherever TSH stores them. Every component here takes `character`
 * (default 1) plus one of:
 *
 * - The person props (`team`/`player`, or `commentator`): the characters they're playing now.
 *   Add `main` for their usual mains instead.
 * - `team` and `lastSet`: the characters the team played in one of its previous sets. Add
 *   `opponent` for the other side's characters.
 */

/** Repeats its children for each character, passing the `character` index. Skips empty slots. */
export const Characters = createList(getCharacters, { skip: (character) => !character?.name });

/** The character's name, preferring TSH's display name over the English one. */
export const CharacterName = createTextField((tsh, props) => {
  const character = getCharacter(tsh, props);

  return character?.display_name || character?.en_name || character?.name;
});

/**
 * Image of the character, already matching the skin selected in TSH. `asset` picks the image pack,
 * e.g. "base_files/icon" or "full", and defaults to the first one. Set it explicitly, since TSH
 * doesn't list packs in the same order everywhere.
 */
export const Character = createImageField((tsh, { asset, ...props }) => {
  const assets = getCharacter(tsh, props)?.assets ?? {};

  return resolveAsset((asset ? assets[asset] : Object.values(assets)[0])?.asset);
});

/**
 * TSH's skin (alt costume) number, starting at 0. Use `format={(skin) => skin + 1}` to start at 1.
 */
export const CharacterSkin = createTextField((tsh, props) => {
  const skin = getCharacter(tsh, props)?.skin;

  return skin >= 0 ? skin : undefined;
});
