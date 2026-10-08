import { Text } from "@Components/Elements/Text";
import { useGame } from "@Components/TSH/Hooks/useGame";

export const Tag = ({ team, player = 1, ...props }) => {
  const game = useGame();

  return <Text value={game?.team?.[team]?.player?.[player]?.team} {...props} />;
};
