import { SPONSOR_SEPARATOR, NAME_SEPARATOR } from "@Utils/format";
import { DEFAULTS } from "./defaults";
import { getScoreboard } from "./scoreboard";
import { getQueuedSet } from "./sets";

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
 * - "queuedSet": the two sides of an upcoming set, picked with `queuedSet`, from the station
 *   queue or, with `queue="stream"`, the stream queue.
 *
 * Commentators share the player shape too, so `getPerson` returns either one: with
 * `source="commentary"` it reads the commentator picked with `commentator`, otherwise a player.
 */

/**
 * @typedef {"scoreboard"|"playerList"|"bracket"|"teamBattle"|"queuedSet"} TeamSource
 */

/**
 * @typedef {TeamSource|"commentary"} PersonSource
 */

/**
 * @typedef {object} TeamProps
 * @property {number} [team] Which team, starting at 1. Defaults to 1.
 * @property {TeamSource} [source] Which part of TSH to read. Defaults to "scoreboard".
 * @property {number|string} [scoreboard] Which scoreboard, when `source` is "scoreboard" or
 * "queuedSet".
 * @property {number|string} [queuedSet] Which upcoming set, when `source` is "queuedSet".
 * @property {"station"|"stream"} [queue] Which queue, when `source` is "queuedSet".
 */

/**
 * @typedef {Omit<TeamProps, "source"> & {
 *   source?: PersonSource,
 *   player?: number,
 *   commentator?: number,
 *   romanized?: boolean,
 * }} PersonProps
 * `player` picks a player on the team, starting at 1. With `source="commentary"`, `commentator`
 * picks a commentator instead, starting at 1, and the team props are ignored. `romanized` prefers
 * Latin-script names where TSH has them.
 */

/** Where each `source` keeps its teams. */
const teamSources = {
  scoreboard: (tsh, props) => getScoreboard(tsh, props)?.team,
  playerList: (tsh) => tsh?.player_list?.slot,
  bracket: (tsh) => tsh?.bracket?.players?.slot,
  teamBattle: (tsh) => tsh?.team_battle?.team,
  queuedSet: (tsh, props) => getQueuedSet(tsh, props)?.team,
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
export const getTeam = (tsh, { team = DEFAULTS.team, ...props } = {}) => getTeams(tsh, props)[team];

/**
 * Returns the games a team has won in the set. A team that hasn't won any, or is missing, counts
 * as 0.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {TeamProps} [props]
 * @returns {number} The score.
 */
export const getScore = (tsh, props) => getTeam(tsh, props)?.score || 0;

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
export const getPlayer = (tsh, { player = DEFAULTS.player, ...props } = {}) =>
  getPlayers(tsh, props)[player];

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
export const getCommentator = (tsh, { commentator = DEFAULTS.commentator } = {}) => {
  return getCommentators(tsh)[commentator];
};

/**
 * Returns a commentator when `source` is "commentary", otherwise a player.
 *
 * @param {object|null} tsh The program_state.json payload.
 * @param {PersonProps} [props]
 * @returns {object|undefined} The player or commentator.
 */
export const getPerson = (tsh, props = {}) => {
  return props.source === "commentary" ? getCommentator(tsh, props) : getPlayer(tsh, props);
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
 * @param {PersonProps & { sponsorSeparator?: string }} [props] `sponsorSeparator` goes
 * between the sponsor and gamertag. Defaults to `SPONSOR_SEPARATOR`.
 * @returns {string} The merged name.
 */
export const getMergedName = (tsh, { sponsorSeparator = SPONSOR_SEPARATOR, ...props } = {}) => {
  return [getSponsor(tsh, props), getGamertag(tsh, props)].filter(Boolean).join(sponsorSeparator);
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
 * @param {TeamProps & { playerNamesSeparator?: string, romanized?: boolean }} [props]
 * `playerNamesSeparator` goes between the names and defaults to `NAME_SEPARATOR`. `romanized`
 * prefers the romanized version.
 * @returns {string} The player names.
 */
export const getPlayerNames = (
  tsh,
  { playerNamesSeparator = NAME_SEPARATOR, romanized, ...props } = {},
) => {
  return Object.values(getPlayers(tsh, props))
    .map((player) => readName(player, "name", romanized))
    .filter(Boolean)
    .join(playerNamesSeparator);
};
