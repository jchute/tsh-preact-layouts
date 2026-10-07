import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const CharacterName = ({ team, player = 1, character = 1, ...props }) => {
  const game = useGame();

  return (
    <Text value={game?.team?.[team]?.player?.[player]?.character[character]?.en_name} {...props} />
  );
};
