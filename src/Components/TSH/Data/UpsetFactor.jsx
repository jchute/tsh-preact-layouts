import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const UpsetFactor = ({ ...props }) => {
  const game = useGame();

  return <Text value={game?.upset_factor} {...props} />;
};
