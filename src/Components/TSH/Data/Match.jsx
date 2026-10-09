import { createList, createTextField } from "../createField";
import { getTeam } from "@Utils/selectors";

/**
 * Builds a text component that shows one property of the current set's scoreboard data.
 *
 * @param {string} key Property name on TSH's scoreboard object.
 */
const matchField = (key) => createTextField((game) => game?.[key]);

/**
 * How many games the set can last.
 * `variant`: none for the number (5), "text" for "Best of 5", "short" for "BO5".
 */
export const BestOf = createTextField((game, { variant }) => {
  return game?.[{ text: "best_of_text", short: "best_of_short_text" }[variant] ?? "best_of"];
});

/**
 * How many game wins it takes to take the set.
 * `variant`: none for the number (3), "text" for "First to 3"`, "short" for "FT3".
 */
export const FirstTo = createTextField((game, { variant }) => {
  return game?.[{ text: "first_to_text", short: "first_to_short_text" }[variant] ?? "first_to"];
});

/** The round being played, e.g. "Losers Quarter-Final". */
export const Match = matchField("match");

/** The bracket phase, e.g. "Top 8". */
export const Phase = matchField("phase");

/** Number of pools in the phase. */
export const PhaseGroups = matchField("num_groups");

/** Number of entrants in the phase. */
export const PhaseSize = matchField("phase_size");

/** The round as a number, alongside the `Match` round name. */
export const RoundNumber = matchField("round");

/** Both sides' game wins in the current set, team 1 first, e.g. "2 - 1". */
export const SetScore = createTextField((game, { separator = " - " }) => {
  return [1, 2].map((team) => getTeam(game, team)?.score || 0).join(separator);
});

/** The setup the set is being played on. */
export const Station = matchField("station");

/** Link to the stream showing this set. */
export const StreamUrl = matchField("stream_url");

/** How big an upset it would be, based on seeding, if the lower seed wins. */
export const UpsetFactor = matchField("upset_factor");

/** Upcoming sets on this stream's station. Items are passed through as TSH provides them. */
export const StationQueue = createList((game) => Object.values(game?.station_queue ?? {}));
