import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const BestOf = ({ ...props }) => {
  const game = useGame();

  return <Text value={game?.best_of} {...props} />;
};
