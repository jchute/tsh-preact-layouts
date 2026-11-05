import { createImageField, createKeyField, createList, createTextField } from "../createField";
import { getHistory, getHistoryEntry } from "@State/selectors";
import { formatDate } from "@Utils/format";

const monthLocales = [
  undefined,
  "en-US",
  "fr-FR",
  "de-DE",
  "es-ES",
  "it-IT",
  "pt-BR",
  "nl-NL",
  "ja-JP",
  "ko-KR",
  "zh-CN",
  "zh-TW",
  "ru-RU",
];

const monthIndex = new Map(
  monthLocales.flatMap((locale) =>
    Array.from({ length: 12 }, (_, month) => [
      new Date(2000, month, 1).toLocaleDateString(locale, { month: "long" }).toLocaleLowerCase(),
      month,
    ]),
  ),
);

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

/** When that tournament took place. `locale` sets the date language, e.g. "September 5, 2026" for "en-US". */
export const HistoryDate = createTextField((tsh, { locale, ...props }) => {
  const entry = getHistoryEntry(tsh, props);
  const month = monthIndex.get(
    String(entry?.event_date_month ?? "")
      .trim()
      .toLocaleLowerCase(),
  );

  if (month == null) {
    return;
  }

  return formatDate(
    new Date(Number(entry.event_date_year), month, Number(entry.event_date_day)),
    locale,
  );
});

/** The tournament's start.gg picture. */
export const HistoryImage = createImageField(
  (tsh, props) => getHistoryEntry(tsh, props)?.tournament_picture,
);
