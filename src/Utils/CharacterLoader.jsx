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

export const getCharacterPath = (name) => {
  const filename = normalizeCharacterName(name);
  const path = `../Assets/Images/Characters/${filename}.svg`;
  return characterAssets[path] || null;
};
