import { Image } from "@Components/Elements/Image";
import { getCharacterPath } from "@Utils/CharacterLoader";
import { useGame } from "@Utils/GameContext";

export const Character = ({ team, player = 1, character = 1, ...props }) => {
  const game = useGame();
  const name = game?.team?.[team]?.player?.[player]?.character[character]?.en_name;
  const source = name ? getCharacterPath(name) : "";

  return <Image source={source} alt={name} {...props} />;
};
