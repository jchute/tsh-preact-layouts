const characterMap = {
  "Banjo & Kazooie": "banjo-and-kazooie",
  "Mii Brawler": "mii-fighter",
  "Mii Gunner": "mii-fighter",
  "Mii Swordfighter": "mii-fighter",
  "Mr. Game & Watch": "mr-game-and-watch",
  "Pokémon Trainer": "pokemon-trainer",
  "Pyra / Mythra": "mythra",
  "R.O.B.": "rob",
  "Rosalina & Luma": "rosalina-and-luma",
  // Add more overrides if needed
};

const characterAssets = import.meta.glob("../Assets/Images/Characters/*.svg", {
  eager: true,
  import: "default",
});

const normalizeCharacterName = (name = "") => {
  // If there is a mapped name, use that as is
  if (characterMap[name]) {
    return characterMap[name];
  }

  // Normalize the name to lowercase replacing special charaters with hyphens and removing trailing hyphens
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

/**
 * Returns the SVG for a character, preferring a skin-specific file when one exists.
 *
 * @param {string} name The character's English name.
 * @param {number} [skin] TSH's 0-based skin index. Negative values mean no skin is selected.
 * @returns {string|null} The asset URL, or null if no file matches.
 */
export const getCharacterPath = (name, skin) => {
  const filename = normalizeCharacterName(name);
  const path = (suffix = "") =>
    characterAssets[`../Assets/Images/Characters/${filename}${suffix}.svg`];

  return (skin >= 0 && path(`-${skin}`)) || path() || null;
};
