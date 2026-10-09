import { createCondition, createImageField, createTextField } from "../createField";
import { getPlayer, getTeam, getTeams, isDoubles, joinPlayerNames } from "@Utils/selectors";
import { resolveAsset } from "@Utils/TshLoader";

// Doubles shows the team name, falling back to the player names. Singles shows the player name.
export const DisplayName = createTextField((game, { team }) => {
  if (!isDoubles(game, team)) {
    return getPlayer(game, team)?.name;
  }

  return getTeam(game, team)?.teamName || joinPlayerNames(game, team);
});

// Companion to DisplayName: the sponsor in singles, or the player names when a doubles team is named.
export const DisplayTag = createTextField((game, { team }) => {
  if (!isDoubles(game, team)) {
    return getPlayer(game, team)?.team;
  }

  return getTeam(game, team)?.teamName ? joinPlayerNames(game, team) : "";
});

export const IfLosers = createCondition((game, { team }) => getTeam(game, team)?.losers);

// "[L]" when the team is in losers, empty otherwise
export const LosersIndicator = createTextField((game, { team }) => {
  return getTeam(game, team)?.losersIndicator;
});

// TSH's display name with the losers indicator, e.g. "Lamb [L]"
export const MergedTeamName = createTextField((game, { team }) => {
  return getTeam(game, team)?.mergedTeamName;
});

export const Score = createTextField((game, { team }) => getTeam(game, team)?.score, {
  fallback: 0,
});

// "L" for the team in losers, "W" for its opponent, empty when neither is in losers.
export const Side = createTextField((game, { team }) => {
  const teams = getTeams(game);

  if (teams[team]?.losers) {
    return "L";
  }

  return Object.entries(teams).some(([key, other]) => key !== String(team) && other?.losers)
    ? "W"
    : "";
});

export const TeamLogo = createImageField(
  (game, { team }) => resolveAsset(getTeam(game, team)?.logo),
  { mask: false },
);

export const TeamName = createTextField((game, { team }) => getTeam(game, team)?.teamName);

export const WinRatio = createTextField((game, { team }) => {
  const scores = Object.values(getTeams(game)).map((t) => t?.score || 0);
  const total = scores.reduce((sum, score) => sum + score, 0);

  if (total === 0) {
    return "";
  }

  return `${(((getTeam(game, team)?.score || 0) / total) * 100).toFixed(2)}%`;
});
