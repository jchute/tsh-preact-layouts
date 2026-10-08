import { createImageField, createList, createTextField } from "../createField";
import { getHistory, getHistoryEntry } from "@Utils/selectors";

const historyField = (key) => {
  return createTextField((game, { team, entry }) => getHistoryEntry(game, team, entry)?.[key]);
};

export const History = createList((game, { team }) => getHistory(game, team));

// e.g. "September 5, 2026"
export const HistoryDate = createTextField((game, { team, entry }) => {
  const history = getHistoryEntry(game, team, entry);

  if (!history) {
    return undefined;
  }

  return `${history.event_date_month} ${Number(history.event_date_day)}, ${history.event_date_year}`;
});

export const HistoryEntrants = historyField("entrants");

export const HistoryEvent = historyField("event_name");

export const HistoryImage = createImageField(
  (game, { team, entry }) => getHistoryEntry(game, team, entry)?.tournament_picture,
  { mask: false },
);

// Pair with `format={ordinal}` from @Utils/format for "17th"
export const HistoryPlacement = historyField("placement");

export const HistoryTournament = historyField("tournament_name");
