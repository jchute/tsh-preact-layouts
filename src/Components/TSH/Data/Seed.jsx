import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const Seed = ({ team, player = 1, ...props }) => {
  const game = useGame();

  return <Text value={game?.team?.[team]?.player?.[player]?.seed} {...props} />;
};
