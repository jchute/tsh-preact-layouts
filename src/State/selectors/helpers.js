/**
 * Re-key a list starting at 0 to start at 1 instead.
 *
 * This includes Arrays indexed at 0 as well as objects set with keys "0", "1"...
 *
 * @param {Array|object|null|undefined} list The list.
 * @returns {object} The items, keyed from 1.
 */
export const startAtOne = (list) =>
  Object.fromEntries(Object.values(list ?? {}).map((item, index) => [index + 1, item]));

/**
 * Returns the name of a character, character variant or stage in the language TSH exports for
 * overlays.
 *
 * If TSH doesn't have a translation for the given locale, it falls back to the export language.
 *
 * @param {object|undefined} item The character, variant or stage.
 * @param {string} [locale] BCP 47 language code.
 * @returns {string|undefined} The name.
 */
export const readLocalizedName = (item, locale) => {
  const translations = item?.locale ?? {};
  const translated =
    locale && (translations[locale.replace("-", "_")] ?? translations[locale.split(/[-_]/)[0]]);

  return translated || item?.export_name || item?.name || item?.en_name || undefined;
};
