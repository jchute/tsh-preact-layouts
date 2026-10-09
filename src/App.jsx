import * as Screens from "virtual:screens";
import GameContext from "@State/GameContext";
import { useScoreboardData } from "@State/useScoreboardData";

/**
 * Renders the requested overlay screen, fed with live data from one of TSH's scoreboards.
 * Renders nothing when no screen with that name exists.
 *
 * @param {object} props
 * @param {string} [props.screen] Name of a folder in src/Screens, e.g. "Game". Defaults to the
 * first screen found.
 * @param {number|string} [props.scoreboard] Which TSH scoreboard to read, for setups streaming
 * several sets at once. Defaults to the first.
 */
export const App = ({ screen = Object.keys(Screens)[0], scoreboard }) => {
  const game = useScoreboardData(scoreboard);
  const ScreenComponent = Screens[screen] || null;

  return (
    <GameContext.Provider value={game}>
      {ScreenComponent && <ScreenComponent />}
    </GameContext.Provider>
  );
};
