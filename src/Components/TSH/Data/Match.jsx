import { createList, createTextField } from "../createField";
import { getTeam } from "@Utils/selectors";

const matchField = (key) => createTextField((game) => game?.[key]);

// `variant`: none for the number (5), "text" for "Best of 5", "short" for "BO5"
export const BestOf = createTextField((game, { variant }) => {
  return game?.[{ text: "best_of_text", short: "best_of_short_text" }[variant] ?? "best_of"];
});

// `variant`: none for the number (3), "text" for "First to 3", "short" for "FT3"
export const FirstTo = createTextField((game, { variant }) => {
  return game?.[{ text: "first_to_text", short: "first_to_short_text" }[variant] ?? "first_to"];
});

// The round, e.g. "Losers Quarter-Final"
export const Match = matchField("match");

// The bracket phase, e.g. "Top 8"
export const Phase = matchField("phase");

// Number of pools in the phase
export const PhaseGroups = matchField("num_groups");

// Number of entrants in the phase
export const PhaseSize = matchField("phase_size");

// The round as a number, alongside the `Match` round name
export const RoundNumber = matchField("round");

export const SetScore = createTextField((game, { separator = " - " }) => {
  return [1, 2].map((team) => getTeam(game, team)?.score || 0).join(separator);
});

export const Station = matchField("station");

export const StreamUrl = matchField("stream_url");

export const UpsetFactor = matchField("upset_factor");

// Upcoming sets on this stream's station. Items are passed through as TSH provides them.
export const StationQueue = createList((game) => Object.values(game?.station_queue ?? {}));
