import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

export const CasterName = ({ team, caster = 1, hide, ...props }) => {
  const game = useGame();
  const value = game?.commentary?.[caster]?.mergedName;

  return <Text value={value} hide={hide && !value} {...props} />;
};
