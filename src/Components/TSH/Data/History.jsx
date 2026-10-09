import { createImageField, createList, createTextField } from "../createField";
import { getHistory, getHistoryEntry } from "@Utils/selectors";

/**
 * A side's results at previous tournaments. Every component here takes `team`, and `entry`
 * (1 being the most recent).
 */

/**
 * Builds a text component that shows one property of a past tournament result.
 *
 * @param {string} key Property name on TSH's history object.
 */
const historyField = (key) => {
  return createTextField((game, { team, entry }) => getHistoryEntry(game, team, entry)?.[key]);
};

/** Repeats its children for each past tournament result, newest first. */
export const History = createList((game, { team }) => getHistory(game, team));

/** When that tournament took place, e.g. "September 5, 2026". */
export const HistoryDate = createTextField((game, { team, entry }) => {
  const history = getHistoryEntry(game, team, entry);

  if (!history) {
    return undefined;
  }

  return `${history.event_date_month} ${Number(history.event_date_day)}, ${history.event_date_year}`;
});

/** How many people entered that event. */
export const HistoryEntrants = historyField("entrants");

/** The event entered at that tournament, e.g. "Ultimate Singles". */
export const HistoryEvent = historyField("event_name");

/** The tournament's start.gg picture. */
export const HistoryImage = createImageField(
  (game, { team, entry }) => getHistoryEntry(game, team, entry)?.tournament_picture,
  { mask: false },
);

/** Where the side finished, as a number. Pair with `format={ordinal}` from @Utils/format for "17th". */
export const HistoryPlacement = historyField("placement");

/** The name of that tournament. */
export const HistoryTournament = historyField("tournament_name");
