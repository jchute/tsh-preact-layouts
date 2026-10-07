import { Text } from "@Components/Elements/Text";

export const Tag = ({ team, player = 1, ...props }) => {
  const game = useGame();

  return <Text value={game?.team?.[team]?.player?.[player]?.team} {...props} />;
};
