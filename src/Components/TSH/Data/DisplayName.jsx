import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const DisplayName = ({ team: _team, ...props }) => {
  const game = useGame();
  const team = game?.team?.[_team];
  const players = team?.player ?? {};
  const isDoubles = Object.keys(players).length > 1;

  const value = isDoubles
    ? team?.teamName ||
      Object.values(players)
        .map((p) => p.name)
        .join(" / ")
    : players[1]?.name;

  return <Text value={value} {...props} />;
};
