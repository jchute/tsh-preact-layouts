import {
  createCondition,
  createImageField,
  createKeyField,
  createList,
  createTextField,
} from "../createField";
import { SCORE_SEPARATOR } from "@Utils/format";
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
 * Every component here takes `team` and `player` (both default to 1). `source` reads a player from
 * another part of TSH: "playerList", "bracket", "teamBattle" or "queuedSet". Or use
 * `source="commentary"` with `commentator` (default 1) to read a commentator instead, e.g.
 * `<Gamertag source="commentary" commentator={2} />`. Name components take `romanized` to prefer
 * Latin-script names.
 */

/** Whether a player or commentator slot is empty. */
const isEmptySlot = (person) => !person?.name;

/** Builds a text component that shows one property of the person. */
const personField = createKeyField(getPerson);

/**
 * Builds a text component that shows one property of an object on the person, such as their
 * country. The prop named after the object, e.g. `countryVariant`, picks the property.
 *
 * @param {string} key The object on TSH's person, e.g. "country".
 * @param {string} fallbackVariant The property shown when the variant prop isn't set.
 */
const objectVariantField = (key, fallbackVariant) => {
  const variantProp = `${key}Variant`;

  return createTextField((tsh, { [variantProp]: variant = fallbackVariant, ...props }) => {
    return getPerson(tsh, props)?.[key]?.[variant];
  });
};

/**
 * Repeats its children for each player on the team, passing the `player` index.
 * Skips player slots with no name.
 */
export const Players = createList(getPlayers, { skip: isEmptySlot });

/**
 * Repeats its children for each commentator, passing the `commentator` index. Skips commentator
 * slots with no name. Show each one with `source="commentary"` on the person components.
 */
export const Commentators = createList(getCommentators, { skip: isEmptySlot });

/** The name the person competes under, without the sponsor. Takes `romanized`. */
export const Gamertag = createTextField(getGamertag);

/** The sponsor or team prefix shown before the gamertag. Takes `romanized`. */
export const Sponsor = createTextField(getSponsor);

/**
 * Sponsor and gamertag together, e.g. "YTS | Jonch", or only the gamertag when there's no sponsor.
 * Takes `romanized`, and `sponsorSeparator` to change the text between them.
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

/** Sets won and lost at this tournament, e.g. "11 - 2". `recordSeparator` changes the text between. */
export const Record = createTextField((tsh, { recordSeparator = SCORE_SEPARATOR, ...props }) => {
  const person = getPerson(tsh, props);

  return person?.wins != null ? `${person.wins}${recordSeparator}${person.losses ?? 0}` : undefined;
});

/** Profile picture. A local avatar set in TSH takes priority over the start.gg one. */
export const Avatar = createImageField((tsh, props) => {
  const person = getPerson(tsh, props);

  return resolveAsset(person?.avatar) || person?.online_avatar;
});

/**
 * Logo for the person's sponsor, from TSH's `user_data/sponsor_logo` folder, where each logo is
 * named after its sponsor in capitals, e.g. "YTS.png". For a combined sponsor like "YTS / ABC"
 * with no logo of its own, shows the first one TSH finds.
 */
export const SponsorLogo = createImageField((tsh, props) => {
  return resolveAsset(getPerson(tsh, props)?.sponsor_logo);
});

/**
 * The country the person represents.
 *
 * `countryVariant` picks the field:
 * - "name" (default)
 * - "code"
 * - "emoji"
 * - "display_name"
 */
export const Country = objectVariantField("country", "name");

/** Flag image for the person's country. */
export const CountryFlag = createImageField((tsh, props) => {
  return resolveAsset(getPerson(tsh, props)?.country?.asset);
});

/** The state, province or region.
 *
 * `stateVariant` picks the field:
 * - "name" (default)
 * - "code"
 */
export const State = objectVariantField("state", "name");

/** Flag image for the person's state or region, when TSH has one. */
export const StateFlag = createImageField((tsh, props) => {
  return resolveAsset(getPerson(tsh, props)?.state?.asset);
});

/**
 * The controller the person plays on.
 *
 * `controllerVariant` picks the field:
 * - "name" (default)
 * - "short_name"
 * - "manufacturer"
 * - "type"
 */
export const Controller = objectVariantField("controller", "name");

/**
 * Picture of the person's controller.
 *
 * `controllerIconVariant` picks the image:
 * - "simple" (default, small icon)
 * - "full" (photo)
 * - "category" (e.g. pads)
 */
export const ControllerIcon = createImageField(
  (tsh, { controllerIconVariant = "simple", ...props }) => {
    const key =
      { full: "icon_path", category: "category_icon_path" }[controllerIconVariant] ??
      "simple_icon_path";

    return resolveAsset(getPerson(tsh, props)?.controller?.[key]);
  },
);

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

/**
 * Team battle only: the player's counter. Stocks left in "Stock Pool" mode, or points scored
 * toward the target in "First To" mode.
 */
export const BattleCounter = personField("dynamic_spinner");
