import { Image } from "@Components/Elements/Image";
import { useGame } from "@Utils/GameContext";

export const Avatar = ({ team, player = 1, ...props }) => {
  const game = useGame();

  return <Image source={game?.team?.[team]?.player?.[player]?.online_avatar} {...props} />;
};
