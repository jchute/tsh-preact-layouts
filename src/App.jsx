import layouts from "virtual:layouts";
import GameContext from "@State/GameContext";
import { useScoreboardData } from "@State/useScoreboardData";

/**
 * Renders the requested layout, fed with live data from one of TSH's scoreboards.
 *
 * @param {object} props
 * @param {string} [props.layout] Name of a layout in src/Layouts. Defaults to the first layout found.
 * @param {number|string} [props.scoreboard] Which TSH scoreboard to read, for setups streaming
 *                                           several sets at once. Defaults to the first.
 * TODO: Default all components to first Scoreboard, return the full TSH data object?
 */
export const App = ({ layout = Object.keys(layouts)[0], scoreboard }) => {
  const game = useScoreboardData(scoreboard);
  const LayoutComponent = layouts[layout] || null;

  return (
    <GameContext.Provider value={game}>
      {LayoutComponent ? <LayoutComponent /> : <div>{`No layout found for ${layout}`}</div>}
    </GameContext.Provider>
  );
};
