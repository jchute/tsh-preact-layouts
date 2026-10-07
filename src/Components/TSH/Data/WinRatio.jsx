import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const WinRatio = ({ team, ...props }) => {
  const game = useGame();
  const teams = game?.team ?? {};
  const score = teams?.[team]?.score || 0;
  const total = Object.values(teams).reduce((sum, team) => sum + (team?.score || 0), 0);

  const ratio = total > 0 ? `${((score / total) * 100).toFixed(2)}%` : "";

  return <Text value={ratio} {...props} />;
};
