import { DEFAULTS } from "./defaults";

/**
 * Sections of TSH that aren't tied to a scoreboard: the tournament, the videogame, notes and team
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
 * Returns the videogame selected in TSH: its `name`, `codename`, `logo` and every stage it has,
 * keyed by codename. TSH calls this `game`, but here "game" means one game of a set.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The videogame.
 */
export const getVideogame = (tsh) => tsh?.game;

/**
 * Returns one of TSH's note widgets, with its `title` and `contents`.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {{ note?: number }} [props] Which note.
 * @returns {object|undefined} The note.
 */
export const getNote = (tsh, { note = DEFAULTS.note } = {}) => tsh?.notes?.[`notes_widget_${note}`];

/**
 * Returns TSH's team battle: its mode, round and each team's total score. The teams and their
 * players are read with the people selectors and `source="teamBattle"`.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object|undefined} The team battle.
 */
export const getTeamBattle = (tsh) => tsh?.team_battle;
