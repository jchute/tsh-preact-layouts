import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const TournamentName = ({ ...props }) => {
  const game = useGame();

  return <Text value={game?.tournament?.tournamentName} {...props} />;
};
