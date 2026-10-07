import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const DisplayTag = ({ team: _team, ...props }) => {
  const game = useGame();
  const team = game?.team?.[_team];
  const players = team?.player ?? {};
  const isDoubles = Object.keys(players).length > 1;

  const value = !isDoubles
    ? players[1]?.team
    : team?.teamName
      ? Object.entries(players)
          .map(([k, p]) => p.name)
          .join(" / ")
      : "";

  return <Text value={value} {...props} />;
};
