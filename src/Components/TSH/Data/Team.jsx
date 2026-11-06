import {
  createCondition,
  createImageField,
  createKeyField,
  createList,
  createTextField,
  useSelector,
} from "../createField";
import {
  DEFAULTS,
  getGamertag,
  getPlayerNames,
  getScore,
  getSponsor,
  getTeam,
  getTeamName,
  getTeams,
  isSingles,
} from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Details about one team. Every component here takes `team` (default 1), meaning one side of the
 * current set. `source` reads a team from another part of TSH instead: "playerList", "bracket",
 * "teamBattle" or "queuedSet". A team can be a single player.
 */

/**
 * The team's raw TSH data, for values not shown as text, like its color. Takes the same props as
 * the components here.
 *
 * @example
 * const color = useTeam({ team })?.color;
 *
 * @param {object} [props] Picking props such as `team` and `source`.
 * @returns {object|undefined} The team, or undefined when there isn't one.
 */
export const useTeam = (props) => useSelector(getTeam, props);

/** Builds a text component that shows one property of the team. */
const teamField = createKeyField(getTeam);

/** Repeats its children for each team in the `source`, passing the `team` index. */
export const Teams = createList(getTeams);

/**
 * The main name to show for a team. A single player shows their gamertag. Bigger teams show the
 * team name, or the player names when the team has no name. Takes `romanized` for player names.
 */
export const DisplayName = createTextField((tsh, props) => {
  if (isSingles(tsh, props)) {
    return getGamertag(tsh, props);
  }

  return getTeamName(tsh, props) || getPlayerNames(tsh, props);
});

/**
 * A second line to pair with DisplayName: the sponsor for a single player, or the player names
 * when a bigger team has a name. Takes `romanized`.
 */
export const DisplayTag = createTextField((tsh, props) => {
  if (isSingles(tsh, props)) {
    return getSponsor(tsh, props);
  }

  return getTeamName(tsh, props) ? getPlayerNames(tsh, props) : undefined;
});

/** The team name typed into TSH. Usually empty for a single player. */
export const TeamName = createTextField(getTeamName);

/** Every player's gamertag, e.g. "Jonch / Stag". Takes `romanized` and `playerNamesSeparator`. */
export const PlayerNames = createTextField(getPlayerNames);

/** Renders its children only when the team is a single player. Use `not` for teams of 2+. */
export const IfSingles = createCondition(isSingles);

/** Games the team has won in the current set. Shows 0 before any are won. */
export const Score = teamField("score", { fallback: 0 });

/** Logo image set for the team in TSH. */
export const TeamLogo = createImageField((tsh, props) => resolveAsset(getTeam(tsh, props)?.logo));

/** Renders its children only when the team has been marked as coming from losers. */
export const IfLosers = createCondition((tsh, props) => getTeam(tsh, props)?.losers);

/** "[L]" when the team is in losers, empty otherwise. */
export const LosersIndicator = teamField("losersIndicator");

/** TSH's team name with the losers indicator, e.g. "GamerTag [L]". */
export const MergedTeamName = teamField("mergedTeamName");

/**
 * Grand-finals bracket side: "L" for the team in losers, "W" for its opponent, empty when neither
 * is in losers.
 */
export const Side = createTextField((tsh, { team = DEFAULTS.team, ...props }) => {
  if (team == null) {
    return;
  }

  const teams = getTeams(tsh, props);

  if (teams[team]?.losers) {
    return "L";
  }

  return Object.values(teams).some((other) => other?.losers) ? "W" : undefined;
});

/** The team's share of the games played so far in this set, e.g. "66.67%". Empty before game 1 ends. */
export const WinRatio = createTextField((tsh, props) => {
  const total = Object.keys(getTeams(tsh, props)).reduce(
    (sum, team) => Number(sum) + Number(getScore(tsh, { ...props, team })),
    0,
  );

  if (total === 0) {
    return;
  }

  return `${((getScore(tsh, props) / total) * 100).toFixed(2)}%`;
});
