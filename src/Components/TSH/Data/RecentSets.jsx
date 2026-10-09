import { createCondition, createList, createTextField } from "../createField";
import { getRecentSet, getRecentSets } from "@Utils/selectors";

const recentSetField = (key) => {
  return createTextField((game, { set }) => getRecentSet(game, set)?.[key]);
};

const fromTeam = (pair, team) => (Number(team) === 2 ? [...pair].reverse() : pair);

export const RecentSets = createList((game) => getRecentSets(game));

// TSH fetches these in the background, so they can arrive after the rest of the data
export const IfRecentSetsLoading = createCondition((game) => {
  return game?.recent_sets?.state === "loading";
});

// Overall record from the recent sets, e.g. "3 - 1"
export const HeadToHead = createTextField((game, { team = 1, separator = " - " }) => {
  const sets = getRecentSets(game);

  if (sets.length === 0) {
    return undefined;
  }

  const wins = [0, 1].map((index) => sets.filter((set) => set?.winner === index).length);

  return fromTeam(wins, team).join(separator);
});

export const IfRecentSetOnline = createCondition(
  (game, { set }) => getRecentSet(game, set)?.online,
);

// `locale` sets the date language, e.g. "October 3, 2026" for the default "en-US"
export const RecentSetDate = createTextField((game, { set, locale = "en-US" }) => {
  const timestamp = getRecentSet(game, set)?.timestamp;

  if (!timestamp) {
    return undefined;
  }

  return new Date(timestamp * 1000).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

export const RecentSetEvent = recentSetField("event");

export const RecentSetPhase = recentSetField("phase_name");

// "W" or "L" from `team`'s point of view (default 1)
export const RecentSetResult = createTextField((game, { set, team = 1 }) => {
  const winner = getRecentSet(game, set)?.winner;

  if (winner == null || winner < 0) {
    return undefined;
  }

  return winner === Number(team) - 1 ? "W" : "L";
});

export const RecentSetRound = recentSetField("round");

// e.g. "2 - 0", from `team`'s point of view (default 1)
export const RecentSetScore = createTextField((game, { set, team = 1, separator = " - " }) => {
  const score = getRecentSet(game, set)?.score;

  return score ? fromTeam(score, team).join(separator) : undefined;
});

export const RecentSetTournament = recentSetField("tournament");
