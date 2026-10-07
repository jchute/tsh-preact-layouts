import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const Phase = ({ ...props }) => {
  const game = useGame();

  return <Text value={game?.phase} {...props} />;
};
