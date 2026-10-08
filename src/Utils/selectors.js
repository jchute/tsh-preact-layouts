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
 * Returns a player or a caster.
 *
 * @param {*} game The game state.
 * @param {{ caster?: integer, team?: integer, player?: integer }} props Which person to return.
 * @returns The player or caster.
 */
export const getPerson = (game, { caster, team, player } = {}) => {
  return caster != null ? game?.commentary?.[caster] : getPlayer(game, team, player);
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
 * Returns true if the team is doubles.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @returns True if the team is doubles.
 */
export const isDoubles = (game, team) => getPlayers(game, team).length > 1;

/**
 * Returns the player names from the team.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @param {string} separator The separator between the player names.
 * @returns The player names from the team.
 */
export const joinPlayerNames = (game, team, separator = " / ") =>
  getPlayers(game, team)
    .map((player) => player?.name)
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
