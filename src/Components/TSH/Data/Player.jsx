import { createCharacterFields } from "../createCharacterFields";
import { createCondition, createImageField, createTextField } from "../createField";
import { getCharacter, getCharacters, getPerson, getRomanized } from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Details about an individual competitor or commentator.
 *
 * Every component here takes `team` and `player` (default 1), or `caster` to read a commentator instead.
 */

/**
 * Builds a text component that shows one raw property of the selected player or caster.
 *
 * @param {string} key Property name on TSH's player object.
 */
const personField = (key) => {
  return createTextField((tsh, props) => getPerson(tsh, props)?.[key]);
};

/**
 * Like `personField`, but the component also takes `romanized` to prefer the Latin-script version
 * TSH generates for names written in other alphabets, falling back to the original.
 *
 * @param {string} key Property name on TSH's player object, also present in `romanized_data`.
 */
const romanizableField = (key) => {
  return createTextField((tsh, { romanized, ...props }) => {
    return getRomanized(getPerson(tsh, props), key, romanized);
  });
};

/** The city the person is from, as entered in TSH or pulled from start.gg. */
export const City = personField("city");

/** Free-form text typed into the player's custom field in TSH, for anything else worth showing. */
export const CustomText = personField("custom_textbox");

/** The name the person competes under, without the sponsor. Takes `romanized`. */
export const Gamertag = romanizableField("name");

/** Sponsor and gamertag combined, separated by a pipe. e.g. "gamer-tag | sponsor". */
export const MergedName = personField("mergedName");

/** Preferred pronouns, e.g. "she/her". */
export const Pronoun = personField("pronoun");

/** The person's legal or full name, rather than their gamertag. */
export const RealName = personField("real_name");

/** The sponsor or team prefix shown before the gamertag. Takes `romanized`. */
export const Sponsor = romanizableField("team");

/** Twitter / X handle. */
export const Twitter = personField("twitter");

/**
 * Sets lost so far at this tournament. Not to be confused with the team's WinRatio within the
 * current set.
 */
export const Losses = personField("losses");

/** Sets won so far at this tournament. */
export const Wins = personField("wins");

/** Share of sets won at this tournament, e.g. "84.62%". */
export const WinPercentage = personField("winPercentage");

/**
 * Sets won and lost at this tournament, e.g. "11 - 2". `separator` changes the text between them.
 */
export const Record = createTextField((tsh, { separator = " - ", ...props }) => {
  const person = getPerson(tsh, props);

  return person?.wins != null ? `${person.wins}${separator}${person.losses ?? 0}` : undefined;
});

/** Where the person was seeded in the bracket. Empty when unseeded, since TSH uses 0 for "no seed". */
export const Seed = createTextField((tsh, props) => getPerson(tsh, props)?.seed || undefined);

/** Profile picture. A local avatar set in TSH takes priority over the start.gg one. */
export const Avatar = createImageField((tsh, props) => {
  const person = getPerson(tsh, props);

  return resolveAsset(person?.avatar) || person?.online_avatar;
});

/** The country the person represents. `variant` picks the field: "name" (default), "code" or "emoji". */
export const Country = createTextField((tsh, { variant = "name", ...props }) => {
  return getPerson(tsh, props)?.country?.[variant];
});

/** Flag image for the person's country. */
export const CountryFlag = createImageField((tsh, props) =>
  resolveAsset(getPerson(tsh, props)?.country?.asset),
);

/** The state, province or region within the country. `variant` picks the field: "name" (default), "code" or "emoji". */
export const State = createTextField((tsh, { variant = "name", ...props }) => {
  return getPerson(tsh, props)?.state?.[variant];
});

/** Flag image for the person's state or region, when TSH has one. */
export const StateFlag = createImageField((tsh, props) =>
  resolveAsset(getPerson(tsh, props)?.state?.asset),
);

/** Renders its children only on the person's birthday. */
export const IfBirthday = createCondition((tsh, props) => getPerson(tsh, props)?.birthday);

/**
 * The controller the person plays on.
 * `variant` picks the field: "name" (default), "short_name", "manufacturer" or "type".
 */
export const Controller = createTextField((tsh, { variant = "name", ...props }) => {
  return getPerson(tsh, props)?.controller?.[variant];
});

/**
 * Picture of the person's controller.
 * `variant` picks the image: "simple" (default, small icon), "full" (photo) or "category" (e.g. pads).
 */
export const ControllerIcon = createImageField((tsh, { variant = "simple", ...props }) => {
  const key = { full: "icon_path", category: "category_icon_path" }[variant] ?? "simple_icon_path";

  return resolveAsset(getPerson(tsh, props)?.controller?.[key]);
});

/**
 * The characters the person is playing in this set.
 * These also take `character` (default 1), and `main` to read the person's usual mains instead.
 */
export const { Character, CharacterName, CharacterSkin, Characters } = createCharacterFields(
  getCharacter,
  getCharacters,
);
