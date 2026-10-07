import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const Pronoun = ({ team, player = 1, ...props }) => {
  const game = useGame();

  return <Text value={game?.team?.[team]?.player?.[player]?.pronoun} {...props} />;
};
