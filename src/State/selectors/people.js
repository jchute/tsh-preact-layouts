import { getScore } from "./score";

/**
 * Teams, players and commentators.
 *
 * TSH uses the same team shape ({ player: { 1: {...}, 2: {...} } }) in several places, so one set
 * of selectors reads them all. `source` picks which part of TSH to read:
 *
 * - "scoreboard" (default): the two sides of the current set, in TSH.score.
 * - "playerList": the slots in TSH's player list.
 * - "bracket": the seeded slots in TSH's bracket.
 * - "teamBattle": the teams in TSH's team battle.
 *
 * Commentators share the player shape too, so `getPerson` returns either one.
 */

/**
 * @typedef {"scoreboard"|"playerList"|"bracket"|"teamBattle"} TeamSource
 */

/**
 * @typedef {object} TeamProps
 * @property {number} [team] Which team, starting at 1. Defaults to 1.
 * @property {TeamSource} [source] Which part of TSH to read. Defaults to "scoreboard".
 * @property {number|string} [scoreboard] Which scoreboard, when `source` is "scoreboard".
 */

/**
 * @typedef {TeamProps & { player?: number, commentator?: number, romanized?: boolean }} PersonProps
 * `player` picks a player on the team, starting at 1. `commentator` reads that commentator instead
 * of a player, ignoring the team props. `romanized` prefers Latin-script names where TSH has them.
 */

/** Where each `source` keeps its teams. */
const teamSources = {
  scoreboard: (tsh, props) => getScore(tsh, props)?.team,
  playerList: (tsh) => tsh?.player_list?.slot,
  bracket: (tsh) => tsh?.bracket?.players?.slot,
  teamBattle: (tsh) => tsh?.team_battle?.team,
};

/**
 * Returns every team in a source.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps} [props]
 * @returns {object} The teams.
 */
export const getTeams = (tsh, { source = "scoreboard", ...props } = {}) => {
  return teamSources[source]?.(tsh, props) ?? {};
};

/**
 * Returns one team.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps} [props]
 * @returns {object|undefined} The team.
 */
export const getTeam = (tsh, { team = 1, ...props } = {}) => getTeams(tsh, props)[team];

/**
 * Returns a team's name. Each source keeps it in a different field: `teamName` on the scoreboard,
 * `name` in the player list and bracket, and `sponsor` in team battle.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps} [props]
 * @returns {string|undefined} The team name.
 */
export const getTeamName = (tsh, props) => {
  const team = getTeam(tsh, props);

  return team?.teamName || team?.name || team?.sponsor || undefined;
};

/**
 * Returns every player on a team.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps} [props]
 * @returns {object} The players.
 */
export const getPlayers = (tsh, props) => getTeam(tsh, props)?.player ?? {};

/**
 * Returns one player on a team.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps & { player?: number|string }} [props] `player` picks which player, starting
 * at 1. Defaults to 1.
 * @returns {object|undefined} The player.
 */
export const getPlayer = (tsh, { player = 1, ...props } = {}) => getPlayers(tsh, props)[player];

/**
 * Returns true when a team has a single player.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps} [props]
 * @returns {boolean} Whether the team is a single player.
 */
export const isSingles = (tsh, props) => Object.keys(getPlayers(tsh, props)).length <= 1;

/**
 * Returns every commentator, including empty commentator slots.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @returns {object} The commentators.
 */
export const getCommentators = (tsh) => tsh?.commentary ?? {};

/**
 * Returns one commentator.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {object} [props]
 * @param {number|string} [props.commentator] Which commentator. Defaults to 1.
 * @returns {object|undefined} The commentator.
 */
export const getCommentator = (tsh, { commentator = 1 } = {}) => {
  return getCommentators(tsh)[commentator];
};

/**
 * Returns a commentator when `commentator` is given, otherwise a player.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {PersonProps} [props]
 * @returns {object|undefined} The player or commentator.
 */
export const getPerson = (tsh, { commentator, ...props } = {}) => {
  return commentator != null ? getCommentator(tsh, { commentator }) : getPlayer(tsh, props);
};

/**
 * Reads a name field from a person.
 *
 * @param {object|undefined} person The player or commentator.
 * @param {"name"|"team"} key The field, matching a key in TSH's `romanized_data`.
 * @param {boolean} [romanized] Whether to prefer the romanized version.
 * @returns {string|undefined} The name.
 */
const readName = (person, key, romanized = false) => {
  return (romanized && person?.romanized_data?.[key]) || person?.[key] || undefined;
};

/**
 * Returns the name a person competes under, without the sponsor.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {PersonProps} [props]
 * @returns {string|undefined} The gamertag.
 */
export const getGamertag = (tsh, { romanized, ...props } = {}) => {
  return readName(getPerson(tsh, props), "name", romanized);
};

/**
 * Returns the sponsor or team prefix shown before a person's gamertag.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {PersonProps} [props]
 * @returns {string|undefined} The sponsor.
 */
export const getSponsor = (tsh, { romanized, ...props } = {}) => {
  return readName(getPerson(tsh, props), "team", romanized);
};

/**
 * Returns the sponsor and gamertag together, e.g. "YTS | Jonch", or just the gamertag when there is
 * no sponsor. Unlike TSH's own `mergedName`, this supports `romanized`.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {PersonProps & { separator?: string }} [props] `separator` goes between the sponsor and
 * gamertag. Defaults to " | ".
 * @returns {string} The merged name.
 */
export const getMergedName = (tsh, { separator = " | ", ...props } = {}) => {
  return [getSponsor(tsh, props), getGamertag(tsh, props)].filter(Boolean).join(separator);
};

/**
 * Returns true when TSH has a romanized gamertag for a person that differs from the original.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {PersonProps} [props]
 * @returns {boolean} Whether a different romanized gamertag exists.
 */
export const hasRomanizedName = (tsh, props) => {
  const person = getPerson(tsh, props);
  const romanized = person?.romanized_data?.name;

  return Boolean(romanized) && romanized !== person?.name;
};

/**
 * Returns the gamertags of everyone on a team joined together, e.g. "Jonch / Stag".
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps & { separator?: string, romanized?: boolean }} [props] `separator` goes
 * between the names and defaults to " / ". `romanized` prefers the romanized version.
 * @returns {string} The player names.
 */
export const getPlayerNames = (tsh, { separator = " / ", romanized, ...props } = {}) => {
  return Object.values(getPlayers(tsh, props))
    .map((player) => readName(player, "name", romanized))
    .filter(Boolean)
    .join(separator);
};
