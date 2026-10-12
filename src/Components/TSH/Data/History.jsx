import { createImageField, createKeyField, createList, createTextField } from "../createField";
import { getHistory, getHistoryEntry } from "@State/selectors";

/**
 * A team's results at past tournaments.
 * Every component here takes `team` and `historyEntry` (1 being the most recent).
 */

/** Builds a text component that shows one property of the result. */
const historyField = createKeyField(getHistoryEntry);

/** Repeats its children for each past result, newest first, passing the `historyEntry` index. */
export const History = createList(getHistory);

/** The name of that tournament. */
export const HistoryTournament = historyField("tournament_name");

/** The event entered at that tournament, e.g. "Ultimate Singles". */
export const HistoryEvent = historyField("event_name");

/** Where the team finished, as a number. Pair with `format={ordinal}` from @Utils/format for "17th". */
export const HistoryPlacement = historyField("placement");

/** How many people entered that event. */
export const HistoryEntrants = historyField("entrants");

/** When that tournament took place, e.g. "September 5, 2026". */
export const HistoryDate = createTextField((tsh, props) => {
  const entry = getHistoryEntry(tsh, props);

  if (!entry) {
    return undefined;
  }

  return `${entry.event_date_month} ${Number(entry.event_date_day)}, ${entry.event_date_year}`;
});

/** The tournament's start.gg picture. */
export const HistoryImage = createImageField(
  (tsh, props) => getHistoryEntry(tsh, props)?.tournament_picture,
);
