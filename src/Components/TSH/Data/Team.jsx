import { createCondition, createImageField, createTextField } from "../createField";
import {
  getPlayer,
  getRomanized,
  getTeam,
  getTeams,
  isDoubles,
  joinPlayerNames,
} from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Details about one side of the current set. Every component here takes `team` (1 or 2).
 */

/**
 * The main name to show for a side. Doubles shows the team name, falling back to the player names.
 * Singles shows the player name. `romanized` prefers Latin-script player names; doubles team
 * names are always shown as typed in TSH.
 */
export const DisplayName = createTextField((tsh, { team, romanized, scoreboard }) => {
  if (!isDoubles(tsh, team, scoreboard)) {
    return getRomanized(getPlayer(tsh, team, 1, scoreboard), "name", romanized);
  }

  return (
    getTeam(tsh, team, scoreboard)?.teamName ||
    joinPlayerNames(tsh, team, { romanized, scoreboard })
  );
});

/**
 * Secondary line to pair with DisplayName: the sponsor in singles, or the player names when a
 * doubles team is named. Takes `romanized`, like DisplayName.
 */
export const DisplayTag = createTextField((tsh, { team, romanized, scoreboard }) => {
  if (!isDoubles(tsh, team, scoreboard)) {
    return getRomanized(getPlayer(tsh, team, 1, scoreboard), "team", romanized);
  }

  return getTeam(tsh, team, scoreboard)?.teamName
    ? joinPlayerNames(tsh, team, { romanized, scoreboard })
    : "";
});

/** Renders its children only when the side has been marked as coming from losers bracket. */
export const IfLosers = createCondition(
  (tsh, { team, scoreboard }) => getTeam(tsh, team, scoreboard)?.losers,
);

/** "[L]" when the side is in losers, empty otherwise. */
export const LosersIndicator = createTextField((tsh, { team, scoreboard }) => {
  return getTeam(tsh, team, scoreboard)?.losersIndicator;
});

/** TSH's display name with the losers indicator, e.g. "GamerTag [L]". */
export const MergedTeamName = createTextField((tsh, { team, scoreboard }) => {
  return getTeam(tsh, team, scoreboard)?.mergedTeamName;
});

/** Games the side has won in the current set. Shows 0 before any are won. */
export const Score = createTextField(
  (tsh, { team, scoreboard }) => getTeam(tsh, team, scoreboard)?.score,
  {
    fallback: 0,
  },
);

/**
 * Grand-finals bracket side: "L" for the side in losers, "W" for its opponent, empty when neither
 * is in losers.
 */
export const Side = createTextField((tsh, { team, scoreboard }) => {
  const teams = getTeams(tsh, scoreboard);

  if (teams[team]?.losers) {
    return "L";
  }

  return Object.entries(teams).some(([key, other]) => key !== String(team) && other?.losers)
    ? "W"
    : "";
});

/** Logo image set for the side in TSH. */
export const TeamLogo = createImageField((tsh, { team, scoreboard }) =>
  resolveAsset(getTeam(tsh, team, scoreboard)?.logo),
);

/** The doubles team name typed into TSH. Usually empty in singles. */
export const TeamName = createTextField(
  (tsh, { team, scoreboard }) => getTeam(tsh, team, scoreboard)?.teamName,
);

/** The side's share of the games played so far in this set, e.g. "66.67%". Empty before game 1 ends. */
export const WinRatio = createTextField((tsh, { team, scoreboard }) => {
  const scores = Object.values(getTeams(tsh, scoreboard)).map((side) => side?.score || 0);
  const total = scores.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return "";
  }

  return `${(((getTeam(tsh, team, scoreboard)?.score || 0) / total) * 100).toFixed(2)}%`;
});
