import { DEFAULT_SCOREBOARD } from "./tsh";

/**
 * Returns one entry from TSH.score.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {number|string} [scoreboard] Which TSH.score key to read. Defaults to the first.
 * @returns {object|undefined} That score object.
 */
export const getScore = (tsh, scoreboard = DEFAULT_SCOREBOARD) => tsh?.score?.[scoreboard];

/**
 * Returns the teams from a TSH.score entry.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns {object} The teams.
 */
export const getTeams = (tsh, scoreboard) => getScore(tsh, scoreboard)?.team ?? {};

/**
 * Returns one team from a TSH.score entry.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The team.
 */
export const getTeam = (tsh, team, scoreboard) => getTeams(tsh, scoreboard)[team];

/**
 * Returns the players from the team.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The players from the team.
 */
export const getPlayers = (tsh, team, scoreboard) =>
  Object.values(getTeam(tsh, team, scoreboard)?.player ?? {});

/**
 * Returns the player from the team.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {integer} [player] The player index.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The player from the team.
 */
export const getPlayer = (tsh, team, player = 1, scoreboard) =>
  getTeam(tsh, team, scoreboard)?.player?.[player];

/**
 * Returns a player from TSH.score, or a caster from TSH.commentary.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ caster?: integer, team?: integer, player?: integer, scoreboard?: number|string }} props
 * Which person to return.
 * @returns The player or caster.
 */
export const getPerson = (tsh, { caster, team, player, scoreboard } = {}) => {
  return caster != null ? tsh?.commentary?.[caster] : getPlayer(tsh, team, player, scoreboard);
};

/**
 * Returns a character, or a main when `main` is true, from a player or caster.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ character?: integer, main?: boolean }} props Which character to return, plus the
 * person props accepted by `getPerson`.
 * @returns The character.
 */
export const getCharacter = (tsh, { character = 1, main = false, ...person } = {}) => {
  return getPerson(tsh, person)?.[main ? "mains" : "character"]?.[character];
};

/**
 * Returns every character, or every main when `main` is true, from a player or caster.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ main?: boolean }} props Whether to return mains, plus the person props accepted by `getPerson`.
 * @returns The characters.
 */
export const getCharacters = (tsh, { main = false, ...person } = {}) => {
  return Object.values(getPerson(tsh, person)?.[main ? "mains" : "character"] ?? {});
};

/**
 * Returns true if the team is doubles.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns True if the team is doubles.
 */
export const isDoubles = (tsh, team, scoreboard) => getPlayers(tsh, team, scoreboard).length > 1;

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
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {{ separator?: string, romanized?: boolean, scoreboard?: number|string }} options The text
 * between the names, whether to prefer romanized names, and which scoreboard to read.
 * @returns The player names from the team.
 */
export const joinPlayerNames = (
  tsh,
  team,
  { separator = " / ", romanized = false, scoreboard } = {},
) =>
  getPlayers(tsh, team, scoreboard)
    .map((player) => getRomanized(player, "name", romanized))
    .filter(Boolean)
    .join(separator);

/**
 * Returns the team's most recent sets at this tournament, newest first.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The team's last sets.
 */
export const getLastSets = (tsh, team, scoreboard) =>
  Object.values(getScore(tsh, scoreboard)?.last_sets?.[team] ?? {});

/**
 * Returns one of the team's most recent sets.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {integer} [set] The set index, 1 being the most recent.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The set.
 */
export const getLastSet = (tsh, team, set = 1, scoreboard) =>
  getScore(tsh, scoreboard)?.last_sets?.[team]?.[set];

/**
 * Returns the characters one side played in one of the team's most recent sets.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ team: integer, set?: integer, opponent?: boolean, scoreboard?: number|string }} props
 * Which set and side to read.
 * @returns The characters, keyed by index.
 */
const getLastSetCharacterMap = (tsh, { team, set, opponent = false, scoreboard } = {}) => {
  return getLastSet(tsh, team, set, scoreboard)?.[opponent ? "oponent_char" : "player_char"]
    ?.character;
};

/**
 * Returns a character one side played in one of the team's most recent sets.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ team: integer, set?: integer, opponent?: boolean, character?: integer, scoreboard?: number|string }} props
 * Which set, side, and character to read.
 * @returns The character.
 */
export const getLastSetCharacter = (tsh, { character = 1, ...props } = {}) => {
  return getLastSetCharacterMap(tsh, props)?.[character];
};

/**
 * Returns every character one side played in one of the team's most recent sets.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ team: integer, set?: integer, opponent?: boolean, scoreboard?: number|string }} props
 * Which set and side to read.
 * @returns The characters.
 */
export const getLastSetCharacters = (tsh, props) => {
  return Object.values(getLastSetCharacterMap(tsh, props) ?? {});
};

/**
 * Returns the team's placements at previous tournaments, newest first.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The team's placement history.
 */
export const getHistory = (tsh, team, scoreboard) =>
  Object.values(getScore(tsh, scoreboard)?.history_sets?.[team] ?? {});

/**
 * Returns one of the team's placements at a previous tournament.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} team The team index.
 * @param {integer} [entry] The history index, 1 being the most recent.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The history entry.
 */
export const getHistoryEntry = (tsh, team, entry = 1, scoreboard) =>
  getScore(tsh, scoreboard)?.history_sets?.[team]?.[entry];

/**
 * Returns the previous sets between the two current teams.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The head-to-head sets.
 */
export const getRecentSets = (tsh, scoreboard) =>
  getScore(tsh, scoreboard)?.recent_sets?.sets ?? [];

/**
 * Returns one of the previous sets between the two current teams.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {integer} [set] The set index, starting at 1.
 * @param {number|string} [scoreboard] Which TSH.score key to read.
 * @returns The set.
 */
export const getRecentSet = (tsh, set = 1, scoreboard) => getRecentSets(tsh, scoreboard)[set - 1];
