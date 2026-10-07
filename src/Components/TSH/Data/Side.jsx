import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const Side = ({ team, ...props }) => {
  const game = useGame();
  const teams = game?.team ?? {};
  const thisTeam = teams[team];

  const otherTeams = Object.entries(teams)
    .filter(([key]) => key !== String(team))
    .map(([_, teamObj]) => teamObj);

  let value = "";

  if (thisTeam?.losers) {
    value = "L";
  } else if (otherTeams.some((t) => t?.losers)) {
    value = "W";
  }

  return <Text value={value} {...props} />;
};
