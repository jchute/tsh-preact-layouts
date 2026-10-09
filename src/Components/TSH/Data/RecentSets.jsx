import { createCondition, createList, createTextField } from "../createField";
import { getRecentSet, getRecentSets } from "@State/selectors";

/**
 * Head-to-head history: previous sets between the two sides currently playing, possibly at other
 * tournaments. Components about a single set take `set` (starting at 1).
 */

/**
 * Builds a text component that shows one property of a previous head-to-head set.
 *
 * @param {string} key Property name on TSH's recent-set object.
 */
const recentSetField = (key) => {
  return createTextField((game, { set }) => getRecentSet(game, set)?.[key]);
};

/**
 * Reorders a `[team 1, team 2]` pair so the requested side's value comes first.
 *
 * @param {Array} pair Values for team 1 and team 2, in that order.
 * @param {number|string} team The side whose value should lead.
 * @returns {Array} The pair, reversed for team 2.
 */
const fromTeam = (pair, team) => (Number(team) === 2 ? [...pair].reverse() : pair);

/** Repeats its children for each previous set between the two sides. */
export const RecentSets = createList((game) => getRecentSets(game));

/**
 * Renders its children while TSH is still fetching the head-to-head history, which happens in the
 * background and can arrive after the rest of the data.
 */
export const IfRecentSetsLoading = createCondition((game) => {
  return game?.recent_sets?.state === "loading";
});

/** Overall head-to-head set record, from `team`'s point of view (default 1), e.g. "3 - 1". */
export const HeadToHead = createTextField((game, { team = 1, separator = " - " }) => {
  const sets = getRecentSets(game);

  if (sets.length === 0) {
    return undefined;
  }

  const wins = [0, 1].map((index) => sets.filter((set) => set?.winner === index).length);

  return fromTeam(wins, team).join(separator);
});

/** Renders its children only when that set was played online rather than in person. */
export const IfRecentSetOnline = createCondition(
  (game, { set }) => getRecentSet(game, set)?.online,
);

/** When that set was played. `locale` sets the date language, e.g. "October 3, 2026" for "en-US". */
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

/** The event that set was part of, e.g. "Ultimate Singles". */
export const RecentSetEvent = recentSetField("event");

/** The bracket phase that set was in. */
export const RecentSetPhase = recentSetField("phase_name");

/** Whether `team` (default 1) won that set: "W" or "L". */
export const RecentSetResult = createTextField((game, { set, team = 1 }) => {
  const winner = getRecentSet(game, set)?.winner;

  if (winner == null || winner < 0) {
    return undefined;
  }

  return winner === Number(team) - 1 ? "W" : "L";
});

/** The round that set was in, e.g. "Winners Final". */
export const RecentSetRound = recentSetField("round");

/** Game count for that set, from `team`'s point of view (default 1), e.g. "2 - 0". */
export const RecentSetScore = createTextField((game, { set, team = 1, separator = " - " }) => {
  const score = getRecentSet(game, set)?.score;

  return score ? fromTeam(score, team).join(separator) : undefined;
});

/** The tournament that set was played at. */
export const RecentSetTournament = recentSetField("tournament");
