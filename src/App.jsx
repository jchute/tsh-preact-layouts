import layouts from "virtual:layouts";
import GameContext from "@State/GameContext";
import { useScoreboardData } from "@State/useScoreboardData";

/**
 * Renders the requested overlay layout, fed with live data from one of TSH's scoreboards.
 * Renders nothing when no layout with that name exists.
 *
 * @param {object} props
 * @param {string} [props.layout] Name of a layout in src/Layouts, i.e. its folder or file name
 * (e.g. "Game"). Defaults to the first layout found.
 * @param {number|string} [props.scoreboard] Which TSH scoreboard to read, for setups streaming
 * several sets at once. Defaults to the first.
 */
export const App = ({ layout = Object.keys(layouts)[0], scoreboard }) => {
  const game = useScoreboardData(scoreboard);
  const LayoutComponent = layouts[layout] || null;

  return (
    <GameContext.Provider value={game}>
      {LayoutComponent && <LayoutComponent />}
    </GameContext.Provider>
  );
};
