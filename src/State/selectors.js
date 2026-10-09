/**
 * Returns the teams from the game state.
 *
 * @param {*} game The game state.
 * @returns The teams from the game state.
 */
export const getTeams = (game) => game?.team ?? {};

/**
 * Returns the team from the game state.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @returns The team from the game state.
 */
export const getTeam = (game, team) => getTeams(game)[team];

/**
 * Returns the players from the team.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @returns The players from the team.
 */
export const getPlayers = (game, team) => Object.values(getTeam(game, team)?.player ?? {});

/**
 * Returns the player from the team.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @param {integer} player The player index.
 * @returns The player from the team.
 */
export const getPlayer = (game, team, player = 1) => getTeam(game, team)?.player?.[player];

/**
 * Returns the caster from the game state.
 *
 * @param {*} game The game state.
 * @param {integer} caster The caster index.
 * @returns The caster from the game state.
 */
export const getCaster = (game, caster = 1) => game?.commentary?.[caster];

/**
 * Returns a player or a caster.
 *
 * @param {*} game The game state.
 * @param {{ caster?: integer, team?: integer, player?: integer }} props Which person to return.
 * @returns The player or caster.
 */
export const getPerson = (game, { caster, team, player } = {}) => {
  return caster != null ? getCaster(game, caster) : getPlayer(game, team, player);
};

/**
 * Returns a character, or a main when `main` is true, from a player or caster.
 *
 * @param {*} game The game state.
 * @param {{ character?: integer, main?: boolean }} props Which character to return, plus the
 * person props accepted by `getPerson`.
 * @returns The character.
 */
export const getCharacter = (game, { character = 1, main = false, ...person } = {}) => {
  return getPerson(game, person)?.[main ? "mains" : "character"]?.[character];
};

/**
 * Returns every character, or every main when `main` is true, from a player or caster.
 *
 * @param {*} game The game state.
 * @param {{ main?: boolean }} props Whether to return mains, plus the person props accepted by `getPerson`.
 * @returns The characters.
 */
export const getCharacters = (game, { main = false, ...person } = {}) => {
  return Object.values(getPerson(game, person)?.[main ? "mains" : "character"] ?? {});
};

/**
 * Returns true if the team is doubles.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @returns True if the team is doubles.
 */
export const isDoubles = (game, team) => getPlayers(game, team).length > 1;

/**
 * Reads a text field from a player or caster, optionally preferring the Latin-script version TSH
 * generates for names written in other alphabets. Falls back to the original when there is none.
 *
 * @param {*} person The player or caster.
 * @param {string} key The field to read, e.g. "name" or "team".
 * @param {boolean} romanized Whether to prefer the romanized version.
 * @returns The field's value.
 */
export const getRomanized = (person, key, romanized = false) => {
  return (romanized && person?.romanized_data?.[key]) || person?.[key];
};

/**
 * Returns the player names from the team.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @param {{ separator?: string, romanized?: boolean }} options The text between the names, and
 * whether to prefer romanized names.
 * @returns The player names from the team.
 */
export const joinPlayerNames = (game, team, { separator = " / ", romanized = false } = {}) =>
  getPlayers(game, team)
    .map((player) => getRomanized(player, "name", romanized))
    .filter(Boolean)
    .join(separator);

/**
 * Returns the team's most recent sets at this tournament, newest first.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @returns The team's last sets.
 */
export const getLastSets = (game, team) => Object.values(game?.last_sets?.[team] ?? {});

/**
 * Returns one of the team's most recent sets.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @param {integer} set The set index, 1 being the most recent.
 * @returns The set.
 */
export const getLastSet = (game, team, set = 1) => game?.last_sets?.[team]?.[set];

/**
 * Returns the characters one side played in one of the team's most recent sets.
 *
 * @param {*} game The game state.
 * @param {{ team: integer, set?: integer, opponent?: boolean }} props Which set and side to read.
 * @returns The characters, keyed by index.
 */
const getLastSetCharacterMap = (game, { team, set, opponent = false } = {}) => {
  return getLastSet(game, team, set)?.[opponent ? "oponent_char" : "player_char"]?.character;
};

/**
 * Returns a character one side played in one of the team's most recent sets.
 *
 * @param {*} game The game state.
 * @param {{ team: integer, set?: integer, opponent?: boolean, character?: integer }} props
 * Which set, side, and character to read.
 * @returns The character.
 */
export const getLastSetCharacter = (game, { character = 1, ...props } = {}) => {
  return getLastSetCharacterMap(game, props)?.[character];
};

/**
 * Returns every character one side played in one of the team's most recent sets.
 *
 * @param {*} game The game state.
 * @param {{ team: integer, set?: integer, opponent?: boolean }} props Which set and side to read.
 * @returns The characters.
 */
export const getLastSetCharacters = (game, props) => {
  return Object.values(getLastSetCharacterMap(game, props) ?? {});
};

/**
 * Returns the team's placements at previous tournaments, newest first.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @returns The team's placement history.
 */
export const getHistory = (game, team) => Object.values(game?.history_sets?.[team] ?? {});

/**
 * Returns one of the team's placements at a previous tournament.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @param {integer} entry The history index, 1 being the most recent.
 * @returns The history entry.
 */
export const getHistoryEntry = (game, team, entry = 1) => game?.history_sets?.[team]?.[entry];

/**
 * Returns the previous sets between the two current teams.
 *
 * @param {*} game The game state.
 * @returns The head-to-head sets.
 */
export const getRecentSets = (game) => game?.recent_sets?.sets ?? [];

/**
 * Returns one of the previous sets between the two current teams.
 *
 * @param {*} game The game state.
 * @param {integer} set The set index, starting at 1.
 * @returns The set.
 */
export const getRecentSet = (game, set = 1) => getRecentSets(game)[set - 1];
