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
 * Returns the character from the player.
 *
 * @param {*} game The game state.
 * @param {integer} team The team index.
 * @param {integer} player The player index.
 * @param {integer} character The character index.
 * @returns The character from the player.
 */
export const getCharacter = (game, team, player = 1, character = 1) =>
  getPlayer(game, team, player)?.character?.[character];

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
