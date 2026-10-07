import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const Score = ({ team, fallback = 0, ...props }) => {
  const game = useGame();

  return <Text value={game?.team?.[team]?.score} fallback={fallback} {...props} />;
};
