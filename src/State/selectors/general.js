/**
 * Sections of TSH that aren't tied to a scoreboard: the tournament, the game, notes and team
 * battle.
 */

/**
 * Returns the tournament and event details from start.gg: names, dates, address, entrants.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The tournament info.
 */
export const getTournament = (tsh) => tsh?.tournamentInfo;

/**
 * Returns the game selected in TSH: its name, logo and stage list.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The game.
 */
export const getGame = (tsh) => tsh?.game;

/**
 * Returns one of TSH's note widgets, with its `title` and `contents`.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ note?: number }} [props] Which note, starting at 1.
 * @returns {object|undefined} The note.
 */
export const getNote = (tsh, { note = 1 } = {}) => tsh?.notes?.[`notes_widget_${note}`];

/**
 * Returns TSH's team battle: its mode, round and each team's total score. The teams and their
 * players are read with the people selectors and `source="teamBattle"`.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The team battle.
 */
export const getTeamBattle = (tsh) => tsh?.team_battle;
