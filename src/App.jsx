import layouts from "virtual:layouts";
import { DEFAULT_SCOREBOARD, TSHContext, useTSHPolling } from "@State/tsh";
import { LayoutNotice } from "./Notices/LayoutNotice";

/**
 * Renders the requested layout with TSH's live state.
 *
 * @param {object} props
 * @param {string} [props.layout] Name of a layout in src/Layouts. Defaults to the first layout found.
 * @param {number|string} [props.scoreboard] Default TSH.score key for this page. Defaults to the first.
 */
export const App = ({ layout = Object.keys(layouts)[0], scoreboard }) => {
  const tsh = useTSHPolling();
  const LayoutComponent = layouts[layout];

  if (!LayoutComponent) {
    return <LayoutNotice layout={layout} />;
  }

  return (
    <TSHContext.Provider value={{ tsh, scoreboard: scoreboard ?? DEFAULT_SCOREBOARD }}>
      <LayoutComponent />
    </TSHContext.Provider>
  );
};
