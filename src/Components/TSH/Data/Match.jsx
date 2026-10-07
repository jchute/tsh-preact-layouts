import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const Match = ({ ...props }) => {
  const game = useGame();

  return <Text value={game?.match} {...props} />;
};
