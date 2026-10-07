import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const TeamName = ({ team, ...props }) => {
  const game = useGame();

  return <Text value={game?.team?.[team]?.teamName} {...props} />;
};
