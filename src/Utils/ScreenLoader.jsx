import * as Screens from "virtual:screens";
import { useScoreboardData } from "@Utils/useScoreboardData";
import GameContext from "./GameContext";

export const ScreenLoader = ({ screen = "Hub", scoreboard }) => {
  const game = useScoreboardData(scoreboard);
  const ScreenComponent = Screens[screen] || null;

  return (
    <GameContext.Provider value={game}>
      {ScreenComponent && <ScreenComponent />}
    </GameContext.Provider>
  );
};
