import { createCondition, createImageField, createTextField } from "../createField";
import { getCharacterPath } from "@Utils/CharacterLoader";
import { getCharacter, getPerson } from "@Utils/selectors";
import { resolveAsset } from "@Utils/TshLoader";

// Every component here takes `team` and `player` (default 1), or `caster` to read a commentator instead.

const personField = (key) => {
  return createTextField((game, props) => getPerson(game, props)?.[key]);
};

const characterName = (game, props) => {
  const character = getCharacter(game, props);

  return character?.display_name || character?.en_name || character?.name;
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

// `variant` picks the field: "name" (default) or "code"
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
export const CharacterName = createTextField(characterName);

// Single-color SVG from src/Assets/Images/Characters, matched by character name.
// Uses `<name>-<skin>.svg` when it exists for the skin selected in TSH, or for the `skin` prop when given.
export const Character = createImageField((game, { skin, ...props }) => {
  const character = getCharacter(game, props);

  return character?.en_name ? getCharacterPath(character.en_name, skin ?? character.skin) : null;
});

// TSH's 0-based skin (alt costume) index. Use `format={(skin) => skin + 1}` for 1-based numbering.
export const CharacterSkin = createTextField((game, props) => {
  const skin = getCharacter(game, props)?.skin;

  return skin >= 0 ? skin : undefined;
});

// Image from TSH's own game assets, already matching the skin selected in TSH.
// `asset` picks the pack (e.g. "base_files/icon"), defaulting to the first one.
export const CharacterAsset = createImageField(
  (game, { asset, ...props }) => {
    const assets = getCharacter(game, props)?.assets ?? {};

    return resolveAsset((asset ? assets[asset] : Object.values(assets)[0])?.asset);
  },
  { mask: false },
);
