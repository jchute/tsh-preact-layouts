import { DEFAULTS } from "./defaults";
import { getPerson } from "./people";
import { getLastSet } from "./sets";

/**
 * Characters, wherever TSH stores them:
 *
 * - On a player or commentator (the person props from `getPerson`): the characters they're playing.
 * - With `main`: that person's usual mains instead.
 * - With `lastSet`: the characters a team played in one of its previous sets. Add `opponent` for
 *   the characters the other side played.
 */

/**
 * @typedef {import("./people").PersonProps & {
 *   main?: boolean,
 *   lastSet?: number,
 *   opponent?: boolean,
 * }} CharacterSourceProps
 */

/**
 * Returns every character from one place in TSH, including TSH's empty placeholders.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {CharacterSourceProps} [props]
 * @returns {object} The characters, keyed by index.
 */
export const getCharacters = (tsh, { main = false, lastSet, opponent = false, ...props } = {}) => {
  if (lastSet != null) {
    const side = getLastSet(tsh, { ...props, lastSet })?.[
      opponent ? "oponent_char" : "player_char"
    ];

    return side?.character ?? {};
  }

  return getPerson(tsh, props)?.[main ? "mains" : "character"] ?? {};
};

/**
 * Returns one character.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {CharacterSourceProps & { character?: number }} [props] `character` starts at 1.
 * @returns {object|undefined} The character.
 */
export const getCharacter = (tsh, { character = DEFAULTS.character, ...props } = {}) => {
  return getCharacters(tsh, props)[character];
};
