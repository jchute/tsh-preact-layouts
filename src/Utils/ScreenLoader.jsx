import * as Screens from "virtual:screens";
import { useScoreboardData } from "@Utils/useScoreboardData";
import GameContext from "./GameContext";

export const ScreenLoader = ({ screen = "Hub", scoreboard }) => {
  const game = useScoreboardData(scoreboard);
  const ScreenComponent = Screens[screen] || Screens["Hub"];
  console.log(game);

  return (
    <GameContext.Provider value={game}>
      <ScreenComponent />
    </GameContext.Provider>
  );
};
