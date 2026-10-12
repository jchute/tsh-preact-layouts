/** English ordinal endings for each plural category, e.g. "one" covers 1, 21, 31 ("st"). */
const englishSuffixes = { one: "st", two: "nd", few: "rd", other: "th" };

/**
 * Builds an ordinal formatter for a locale. `Intl.PluralRules` picks the locale's plural
 * category for the number ("zero", "one", "two", "few", "many" or "other"), and `suffixes`
 * maps each category the locale uses to its suffix. Missing categories fall back to `other`.
 *
 * @example
 * const frenchOrdinal = createOrdinal("fr", { one: "er", other: "e" }); // 1er, 2e
 * <HistoryPlacement team={1} format={frenchOrdinal} />
 *
 * @param {string} locale BCP 47 locale code, e.g. "en-US".
 * @param {Partial<Record<Intl.LDMLPluralRule, string>>} suffixes Suffix for each plural category.
 * @returns {(value: number|string) => number|string} The formatter.
 */
export const createOrdinal = (locale = "en-US", suffixes = englishSuffixes) => {
  const rules = new Intl.PluralRules(locale, { type: "ordinal" });

  return (value) => {
    const number = Number(value);

    if (value === "" || value == null || !Number.isInteger(number)) {
      return value;
    }

    return `${number}${suffixes[rules.select(number)] ?? suffixes.other ?? ""}`;
  };
};

/**
 * Returns a number with its English ordinal suffix, e.g. 1 -> "1st", 22 -> "22nd", 13 -> "13th".
 * Usable as a `format` prop: `<HistoryPlacement team={1} format={ordinal} />`.
 * Use `createOrdinal` for other languages.
 */
export const ordinal = createOrdinal();

/**
 * Formats a date as text, e.g. "October 3, 2026" for "en-US".
 *
 * @param {Date|number} [date] A Date, or a Unix timestamp in seconds as TSH provides them.
 * @param {string} [locale] BCP 47 locale code, e.g. "en-US".
 * @returns {string|undefined} The date, or undefined when there isn't a valid one.
 */
export const formatDate = (date, locale = "en-US") => {
  const value = typeof date === "number" && date > 0 ? new Date(date * 1000) : date;

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
  return scores.every((score) => score != null && score !== "")
    ? scores.join(separator)
    : undefined;
};
