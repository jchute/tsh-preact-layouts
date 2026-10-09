import * as Screens from "virtual:screens";
import { useScoreboardData } from "@Utils/useScoreboardData";
import GameContext from "./GameContext";

/**
 * Renders the requested overlay screen, fed with live data from one of TSH's scoreboards.
 * Renders nothing when no screen with that name exists.
 *
 * @param {object} props
 * @param {string} [props.screen] Name of a folder in src/Screens, e.g. "Game".
 * @param {number|string} [props.scoreboard] Which TSH scoreboard to read, for setups streaming
 * several sets at once. Defaults to the first.
 */
export const ScreenLoader = ({ screen = "Hub", scoreboard }) => {
  const game = useScoreboardData(scoreboard);
  const ScreenComponent = Screens[screen] || null;

  return (
    <GameContext.Provider value={game}>
      {ScreenComponent && <ScreenComponent />}
    </GameContext.Provider>
  );
};
