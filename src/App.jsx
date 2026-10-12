import layouts from "virtual:layouts";
import { TSHContext, useTSHPolling } from "@State/tsh";
import { LayoutNotice } from "./Notices/LayoutNotice";

/**
 * Renders the requested layout with TSH's live state.
 *
 * @param {object} props
 * @param {string} [props.layout] Name of a layout in src/Layouts. Defaults to the first layout found.
 * @param {object} [props.scope] Page-wide picking props, e.g. `{ scoreboard: 2 }`. Anything left out
 * uses `DEFAULTS`.
 */
export const App = ({ layout = Object.keys(layouts)[0], scope = {} }) => {
  const tsh = useTSHPolling();
  const LayoutComponent = layouts[layout];

  if (!LayoutComponent) {
    return <LayoutNotice layout={layout} />;
  }

  return (
    <TSHContext.Provider value={{ tsh, scope }}>
      <LayoutComponent />
    </TSHContext.Provider>
  );
};
