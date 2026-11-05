import { isEmpty } from "@Utils/isEmpty";

/** Default text between two scores or records, e.g. "3 - 1". */
export const SCORE_SEPARATOR = " - ";

/** Default text between a sponsor and a gamertag, e.g. "YTS | Jonch". */
export const SPONSOR_SEPARATOR = " | ";

/** Default text between the names of players on one team, e.g. "Jonch / Stag". */
export const NAME_SEPARATOR = " / ";

/**
 * Returns a number with its English ordinal suffix, e.g. 1 -> "1st", 22 -> "22nd", 13 -> "13th".
 * Usable as a `format` prop: `<HistoryPlacement team={1} format={ordinal} />`.
 * Values that aren't whole numbers are returned unchanged.
 *
 * @param {number|string} value The number to format.
 * @returns {number|string} The number with its suffix.
 */
export const ordinal = (value) => {
  const number = Number(value);

  if (isEmpty(value) || !Number.isInteger(number)) {
    return value;
  }

  // 12th and 13th vs 12nd and 13rd
  const isTeen = number % 100 >= 11 && number % 100 <= 13;
  const suffix = isTeen ? "th" : (["th", "st", "nd", "rd"][number % 10] ?? "th");

  return `${number}${suffix}`;
};

/**
 * Formats a date as text, e.g. "October 3, 2026" for "en-US".
 *
 * @param {Date|number|string} [date] A Date, a Unix timestamp in seconds as TSH provides them (or
 *   in milliseconds), or a date string such as "2026-06-06" or "06/06/26".
 * @param {string} [locale] BCP 47 locale code, e.g. "en-US".
 * @returns {string|undefined} The date, the original string when it can't be parsed, or undefined
 *   when there isn't a date.
 */
export const formatDate = (date, locale = "en-US") => {
  let value = date;

  if (typeof date === "number" && date > 0) {
    value = new Date(date > 1e11 ? date : date * 1000);
  } else if (typeof date === "string" && date.trim() !== "") {
    // "2026-06-06" is built from its parts, as new Date() would read it as UTC and show the day before
    const iso = date.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    value = iso ? new Date(+iso[1], +iso[2] - 1, +iso[3]) : new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }
  }

  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return undefined;
  }

  return value.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
};

/**
 * Joins scores with a separator, e.g. [3, 1] -> "3 - 1".
 *
 * @param {Array} scores The scores, in the order to show them.
 * @param {string} separator Text between the scores.
 * @returns {string|undefined} The joined scores, or undefined when any of them is missing.
 */
export const joinScores = (scores, separator) => {
  return scores.every((score) => !isEmpty(score)) ? scores.join(separator) : undefined;
};
