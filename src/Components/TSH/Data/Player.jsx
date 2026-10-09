import { createCharacterFields } from "../createCharacterFields";
import { createCondition, createImageField, createTextField } from "../createField";
import { getCharacter, getCharacters, getPerson } from "@Utils/selectors";
import { resolveAsset } from "@Utils/TshLoader";

// Every component here takes `team` and `player` (default 1), or `caster` to read a commentator instead.

const personField = (key) => {
  return createTextField((game, props) => getPerson(game, props)?.[key]);
};

export const City = personField("city");

export const CustomText = personField("custom_textbox");

export const Gamertag = personField("name");

// Sponsor and gamertag combined, e.g. "YTS | MJS"
export const MergedName = personField("mergedName");

export const Pronoun = personField("pronoun");

export const RealName = personField("real_name");

export const Sponsor = personField("team");

export const Twitter = personField("twitter");

// Latin-alphabet versions TSH generates for names in other scripts, falling back to the original
export const RomanizedGamertag = createTextField((game, props) => {
  const person = getPerson(game, props);

  return person?.romanized_data?.name || person?.name;
});

export const RomanizedSponsor = createTextField((game, props) => {
  const person = getPerson(game, props);

  return person?.romanized_data?.team || person?.team;
});

// Set record at this tournament. Not to be confused with the team's WinRatio within the current set.
export const Losses = personField("losses");

export const Wins = personField("wins");

// e.g. "84.62%"
export const WinPercentage = personField("winPercentage");

// e.g. "11 - 2"
export const Record = createTextField((game, { separator = " - ", ...props }) => {
  const person = getPerson(game, props);

  return person?.wins != null ? `${person.wins}${separator}${person.losses ?? 0}` : undefined;
});

// TSH uses 0 for "no seed"
export const Seed = createTextField((game, props) => getPerson(game, props)?.seed || undefined);

// A local avatar set in TSH takes priority over the start.gg one
export const Avatar = createImageField(
  (game, props) => {
    const person = getPerson(game, props);

    return resolveAsset(person?.avatar) || person?.online_avatar;
  },
  { mask: false },
);

// `variant` picks the field: "name" (default), "code" or "emoji"
export const Country = createTextField((game, { variant = "name", ...props }) => {
  return getPerson(game, props)?.country?.[variant];
});

export const CountryFlag = createImageField(
  (game, props) => resolveAsset(getPerson(game, props)?.country?.asset),
  { mask: false },
);

export const State = createTextField((game, { variant = "name", ...props }) => {
  return getPerson(game, props)?.state?.[variant];
});

export const StateFlag = createImageField(
  (game, props) => resolveAsset(getPerson(game, props)?.state?.asset),
  { mask: false },
);

export const IfBirthday = createCondition((game, props) => getPerson(game, props)?.birthday);

// `variant` picks the field: "name" (default), "short_name", "manufacturer" or "type"
export const Controller = createTextField((game, { variant = "name", ...props }) => {
  return getPerson(game, props)?.controller?.[variant];
});

// `variant` picks the image: "simple" (default, small icon), "full" (photo) or "category" (e.g. pads)
export const ControllerIcon = createImageField(
  (game, { variant = "simple", ...props }) => {
    const key =
      { full: "icon_path", category: "category_icon_path" }[variant] ?? "simple_icon_path";

    return resolveAsset(getPerson(game, props)?.controller?.[key]);
  },
  { mask: false },
);

// Character components also take `character` (default 1), and `main` to read the person's mains instead
export const { Character, CharacterAsset, CharacterName, CharacterSkin, Characters } =
  createCharacterFields(getCharacter, getCharacters);
