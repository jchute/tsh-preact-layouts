import { createCondition, createImageField, createTextField } from "../createField";
import { getPlayer, getTeam, getTeams, isDoubles, joinPlayerNames } from "@Utils/selectors";
import { resolveAsset } from "@Utils/TshLoader";

/**
 * Details about one side of the current set. Every component here takes `team` (1 or 2).
 */

/**
 * The main name to show for a side. Doubles shows the team name, falling back to the player names.
 * Singles shows the player name.
 */
export const DisplayName = createTextField((game, { team }) => {
  if (!isDoubles(game, team)) {
    return getPlayer(game, team)?.name;
  }

  return getTeam(game, team)?.teamName || joinPlayerNames(game, team);
});

/**
 * Secondary line to pair with DisplayName: the sponsor in singles, or the player names when a
 * doubles team is named.
 */
export const DisplayTag = createTextField((game, { team }) => {
  if (!isDoubles(game, team)) {
    return getPlayer(game, team)?.team;
  }

  return getTeam(game, team)?.teamName ? joinPlayerNames(game, team) : "";
});

/** Renders its children only when the side has been marked as coming from losers bracket. */
export const IfLosers = createCondition((game, { team }) => getTeam(game, team)?.losers);

/** "[L]" when the side is in losers, empty otherwise. */
export const LosersIndicator = createTextField((game, { team }) => {
  return getTeam(game, team)?.losersIndicator;
});

/** TSH's display name with the losers indicator, e.g. "GamerTag [L]". */
export const MergedTeamName = createTextField((game, { team }) => {
  return getTeam(game, team)?.mergedTeamName;
});

/** Games the side has won in the current set. Shows 0 before any are won. */
export const Score = createTextField((game, { team }) => getTeam(game, team)?.score, {
  fallback: 0,
});

/**
 * Grand-finals bracket side: "L" for the side in losers, "W" for its opponent, empty when neither
 * is in losers.
 */
export const Side = createTextField((game, { team }) => {
  const teams = getTeams(game);

  if (teams[team]?.losers) {
    return "L";
  }

  return Object.entries(teams).some(([key, other]) => key !== String(team) && other?.losers)
    ? "W"
    : "";
});

/** Logo image set for the side in TSH. */
export const TeamLogo = createImageField(
  (game, { team }) => resolveAsset(getTeam(game, team)?.logo),
  { mask: false },
);

/** The doubles team name typed into TSH. Usually empty in singles. */
export const TeamName = createTextField((game, { team }) => getTeam(game, team)?.teamName);

/** The side's share of the games played so far in this set, e.g. "66.67%". Empty before game 1 ends. */
export const WinRatio = createTextField((game, { team }) => {
  const scores = Object.values(getTeams(game)).map((t) => t?.score || 0);
  const total = scores.reduce((sum, score) => sum + score, 0);

  if (total === 0) {
    return "";
  }

  return `${(((getTeam(game, team)?.score || 0) / total) * 100).toFixed(2)}%`;
});
