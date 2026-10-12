import {
  createCondition,
  createImageField,
  createKeyField,
  createList,
  createScope,
  createTextField,
} from "../createField";
import {
  getCommentators,
  getGamertag,
  getMergedName,
  getPerson,
  getPlayers,
  getSponsor,
  hasRomanizedName,
} from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Details about one player or commentator.
 *
 * Every component here takes `team` and `player` (both default to 1), or `commentator` to read a
 * commentator instead. `source` reads a player from another part of TSH: "playerList", "bracket",
 * "teamBattle" or "stationQueue". Name components take `romanized` to prefer Latin-script names.
 */

/** Whether a player or commentator slot is empty. */
const isEmptySlot = (person) => !person?.name;

/** Builds a text component that shows one property of the person. */
const personField = createKeyField(getPerson);

/**
 * Builds a text component that shows one property of an object on the person, such as their
 * country. `variant` picks the property.
 *
 * @param {string} key The object on TSH's person, e.g. "country".
 * @param {string} fallbackVariant The property shown when `variant` isn't set.
 */
const variantField = (key, fallbackVariant) =>
  createTextField(
    (tsh, { variant = fallbackVariant, ...props }) => getPerson(tsh, props)?.[key]?.[variant],
  );

/** Sets `player` for everything inside. Takes `romanized` too. */
export const Player = createScope("player");

/** Sets `commentator` for everything inside, so they read that commentator. Takes `romanized` too. */
export const Commentator = createScope("commentator");

/**
 * Repeats its children for each player on the team, passing the `player` index.
 * Skips player slots with no name.
 */
export const Players = createList(getPlayers, { skip: isEmptySlot });

/**
 * Repeats its children for each commentator, passing the `commentator` index.
 * Skips commentator slots with no name.
 */
export const Commentators = createList(getCommentators, { skip: isEmptySlot });

/** The name the person competes under, without the sponsor. Takes `romanized`. */
export const Gamertag = createTextField(getGamertag);

/** The sponsor or team prefix shown before the gamertag. Takes `romanized`. */
export const Sponsor = createTextField(getSponsor);

/**
 * Sponsor and gamertag together, e.g. "YTS | Jonch", or only the gamertag when there's no sponsor.
 * Takes `romanized`, and `separator` to change the text between them.
 */
export const MergedName = createTextField(getMergedName);

/** The person's legal or full name. */
export const RealName = personField("real_name");

/** Preferred pronouns, e.g. "she/her". */
export const Pronoun = personField("pronoun");

/** Twitter / X handle. */
export const Twitter = personField("twitter");

/** The city the person is from. */
export const City = personField("city");

/** Free-form text typed into the player's custom field in TSH. */
export const CustomText = personField("custom_textbox");

/** Where the person was seeded. Empty when unseeded, since TSH uses 0 for "no seed". */
export const Seed = createTextField((tsh, props) => getPerson(tsh, props)?.seed || undefined);

/** Sets won so far at this tournament. */
export const Wins = personField("wins");

/** Sets lost so far at this tournament. */
export const Losses = personField("losses");

/** Share of sets won at this tournament, e.g. "84.62%". */
export const WinPercentage = personField("winPercentage");

/** Sets won and lost at this tournament, e.g. "11 - 2". `separator` changes the text between. */
export const Record = createTextField((tsh, { separator = " - ", ...props }) => {
  const person = getPerson(tsh, props);

  return person?.wins != null ? `${person.wins}${separator}${person.losses ?? 0}` : undefined;
});

/** Profile picture. A local avatar set in TSH takes priority over the start.gg one. */
export const Avatar = createImageField((tsh, props) => {
  const person = getPerson(tsh, props);

  return resolveAsset(person?.avatar) || person?.online_avatar;
});

/**
 * The country the person represents.
 *
 * `variant` picks the field:
 * - "name" (default)
 * - "code"
 * - "emoji"
 * - "display_name"
 */
export const Country = variantField("country", "name");

/** Flag image for the person's country. */
export const CountryFlag = createImageField((tsh, props) => {
  return resolveAsset(getPerson(tsh, props)?.country?.asset);
});

/** The state, province or region.
 *
 * `variant` picks the field:
 * - "name" (default)
 * - "code"
 */
export const State = variantField("state", "name");

/** Flag image for the person's state or region, when TSH has one. */
export const StateFlag = createImageField((tsh, props) => {
  return resolveAsset(getPerson(tsh, props)?.state?.asset);
});

/**
 * The controller the person plays on.
 *
 * `variant` picks the field:
 * - "name" (default)
 * - "short_name"
 * - "manufacturer"
 * - "type"
 */
export const Controller = variantField("controller", "name");

/**
 * Picture of the person's controller.
 *
 * `variant` picks the image:
 * - "simple" (default, small icon)
 * - "full" (photo)
 * - "category" (e.g. pads)
 */
export const ControllerIcon = createImageField((tsh, { variant = "simple", ...props }) => {
  const key = { full: "icon_path", category: "category_icon_path" }[variant] ?? "simple_icon_path";

  return resolveAsset(getPerson(tsh, props)?.controller?.[key]);
});

/**
 * Renders its children only when the person's gamertag has a different romanized spelling, e.g.
 * to show both: `<Gamertag /> <IfRomanized>(<Gamertag romanized />)</IfRomanized>`.
 */
export const IfRomanized = createCondition(hasRomanizedName);

/** Renders its children only on the person's birthday. */
export const IfBirthday = createCondition((tsh, props) => getPerson(tsh, props)?.birthday);

/** Team battle only: renders its children only when the player is the one currently playing. */
export const IfActive = createCondition((tsh, props) => getPerson(tsh, props)?.active);

/** Team battle only: renders its children only when the player has been eliminated. */
export const IfEliminated = createCondition((tsh, props) => getPerson(tsh, props)?.dead);
