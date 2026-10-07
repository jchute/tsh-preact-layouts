import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const SetScore = ({ ...props }) => {
  const game = useGame();

  return (
    <Text value={`${game?.team?.[1]?.score || 0} - ${game?.team?.[2]?.score || 0}`} {...props} />
  );
};
