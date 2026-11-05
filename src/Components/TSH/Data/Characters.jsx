import { createImageField, createList, createTextField } from "../createField";
import { getCharacter, getCharacters, readLocalizedName } from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Characters, read from wherever TSH stores them. Every component here takes `character`
 * (default 1) plus one of:
 *
 * - The person props (`team`/`player`, or `commentator`): the characters they're playing now.
 *   Add `main` for their usual mains instead.
 * - `team` and `lastSet`: the characters the team played in one of its previous sets. Add
 *   `opponent` for the other side's characters.
 * - `team` and `recentSet`: the characters the team played in one of the head-to-head sets
 *   between the current teams. Add `opponent` for the other team's.
 *
 * Name components show the language TSH exports for overlays. `locale` asks for another language
 * TSH has, e.g. "fr" or "pt-BR".
 */

/** Repeats its children for each character, passing the `character` index. Skips empty slots. */
export const Characters = createList(getCharacters, { skip: (character) => !character?.name });

/** The character's name. Takes `locale`. */
export const CharacterName = createTextField((tsh, { locale, ...props }) => {
  return readLocalizedName(getCharacter(tsh, props), locale);
});

/**
 * The character's variant, for games where TSH tracks one alongside the skin, e.g. a fighting
 * style. Empty when there's none. Takes `locale`.
 */
export const CharacterVariant = createTextField((tsh, { locale, ...props }) => {
  return readLocalizedName(getCharacter(tsh, props)?.variant, locale);
});

/**
 * Image of the character, already matching the skin selected in TSH. `asset` picks the image pack,
 * e.g. "base_files/icon" or "full", and defaults to the first one. Set it explicitly, since TSH
 * doesn't list packs in the same order everywhere.
 */
export const CharacterImage = createImageField((tsh, { asset, ...props }) => {
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
