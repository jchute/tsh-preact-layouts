import { createKeyField, createList, createTextField } from "../createField";
import { getScore, getStationQueue, getTeams } from "@State/selectors";

/** Details about the set currently on the scoreboard. */

/** Builds a text component that shows one property of the scoreboard. */
const matchField = createKeyField(getScore);

/**
 * Builds a text component for a value TSH provides in three forms. `variant` picks one: none for
 * the number, "text" for the long form, or "short".
 *
 * @param {string} key The number's key. The other forms are `${key}_text` and `${key}_short_text`.
 */
const variantField = (key) => {
  return createTextField((tsh, { variant, ...props }) => {
    return getScore(tsh, props)?.[
      { text: `${key}_text`, short: `${key}_short_text` }[variant] ?? key
    ];
  });
};

/** How many games the set can last: 5, "Best of 5" (`variant="text"`) or "BO5" (`variant="short"`). */
export const BestOf = variantField("best_of");

/** Game wins needed to take the set: 3, "First to 3" (`variant="text"`) or "FT3" (`variant="short"`). */
export const FirstTo = variantField("first_to");

/** The round being played, e.g. "Losers Quarter-Final". */
export const Match = matchField("match");

/** The round as a number, alongside the `Match` round name. */
export const RoundNumber = matchField("round");

/** The bracket phase, e.g. "Top 8". */
export const Phase = matchField("phase");

/** Number of pools in the phase. */
export const PhaseGroups = matchField("num_groups");

/** Number of entrants in the phase. */
export const PhaseSize = matchField("phase_size");

/** Both teams' game wins in the current set, team 1 first, e.g. "2 - 1". Takes `separator`. */
export const SetScore = createTextField((tsh, { separator = " - ", ...props }) => {
  return Object.values(getTeams(tsh, props))
    .map((team) => team?.score || 0)
    .join(separator);
});

/** The setup the set is being played on. */
export const Station = matchField("station");

/** Link to the stream showing this set. */
export const StreamUrl = matchField("stream_url");

/** How big an upset it would be, based on seeding, if the lower seed wins. */
export const UpsetFactor = matchField("upset_factor");

/** The bracket format, as TSH names it, e.g. "DOUBLE_ELIMINATION". */
export const BracketType = createTextField((tsh) => tsh?.score?.bracket_type);

/** Repeats its children for each upcoming set on this station. Items are passed as TSH provides them. */
export const StationQueue = createList(getStationQueue);
