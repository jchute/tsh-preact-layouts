import { createCondition, createKeyField, createList, createTextField } from "../createField";
import { getRecentSet, getRecentSets, getScore } from "@State/selectors";

/**
 * Head-to-head history: previous sets between the two teams currently playing, possibly at other
 * tournaments. Components about a single set take `recentSet` (starting at 0). Components that
 * compare the teams take `team` (default 1) to say whose point of view to show it from.
 */

/** Builds a text component that shows one property of the set. */
const recentSetField = createKeyField(getRecentSet);

/**
 * Reorders a [team 1, team 2] pair so the given team's value comes first.
 *
 * @param {Array} pair Values for team 1 and team 2, in that order.
 * @param {number|string} team The team whose value should lead.
 * @returns {Array} The pair, reversed for team 2.
 */
const fromTeam = (pair, team) => (Number(team) === 2 ? [...pair].reverse() : pair);

/** Repeats its children for each previous set between the teams, passing the `recentSet` index. */
export const RecentSets = createList(getRecentSets);

/**
 * Renders its children while TSH is still fetching the head-to-head history, which happens in the
 * background and can arrive after the rest of the data.
 */
export const IfRecentSetsLoading = createCondition((tsh, props) => {
  return getScore(tsh, props)?.recent_sets?.state === "loading";
});

/** Overall head-to-head record from `team`'s point of view, e.g. "3 - 1". Takes `separator`. */
export const HeadToHead = createTextField((tsh, { team = 1, separator = " - ", ...props }) => {
  const sets = Object.values(getRecentSets(tsh, props));

  if (sets.length === 0) {
    return undefined;
  }

  const wins = [0, 1].map((winner) => sets.filter((set) => set?.winner === winner).length);

  return fromTeam(wins, team).join(separator);
});

/** The tournament that set was played at. */
export const RecentSetTournament = recentSetField("tournament");

/** The event that set was part of, e.g. "Ultimate Singles". */
export const RecentSetEvent = recentSetField("event");

/** The bracket phase that set was in. */
export const RecentSetPhase = recentSetField("phase_name");

/** The round that set was in, e.g. "Winners Final". */
export const RecentSetRound = recentSetField("round");

/** When that set was played. `locale` sets the date language, e.g. "October 3, 2026" for "en-US". */
export const RecentSetDate = createTextField((tsh, { locale = "en-US", ...props }) => {
  const timestamp = getRecentSet(tsh, props)?.timestamp;

  if (!timestamp) {
    return undefined;
  }

  return new Date(timestamp * 1000).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

/** Whether `team` won that set: "W" or "L". */
export const RecentSetResult = createTextField((tsh, { team = 1, ...props }) => {
  const winner = getRecentSet(tsh, props)?.winner;

  if (winner == null || winner < 0) {
    return undefined;
  }

  return winner === Number(team) - 1 ? "W" : "L";
});

/** Game count for that set from `team`'s point of view, e.g. "2 - 0". Takes `separator`. */
export const RecentSetScore = createTextField((tsh, { team = 1, separator = " - ", ...props }) => {
  const score = getRecentSet(tsh, props)?.score;

  return score ? fromTeam(score, team).join(separator) : undefined;
});

/** Renders its children only when that set was played online rather than in person. */
export const IfRecentSetOnline = createCondition((tsh, props) => getRecentSet(tsh, props)?.online);
