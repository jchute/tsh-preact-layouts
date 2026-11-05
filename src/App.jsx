import layouts from "virtual:layouts";
import { LayoutNotice } from "@Notices/LayoutNotice";
import { ScopeContext } from "@State/scope";
import { TSHDataContext, useTSHPolling } from "@State/tsh";

const NO_SCOPE = {};

/**
 * Renders the requested layout with TSH's live state.
 *
 * @param {object} props
 * @param {string} [props.layout] Name of a layout in src/Layouts. Defaults to the first layout found.
 * @param {object} [props.scope] Page-wide props, e.g. `{ scoreboard: 2 }`.
 */
export const App = ({ layout = Object.keys(layouts)[0], scope = NO_SCOPE }) => {
  const tsh = useTSHPolling();
  const LayoutComponent = Object.hasOwn(layouts, layout) ? layouts[layout] : null;

  if (!LayoutComponent) {
    return <LayoutNotice layout={layout} />;
  }

  if (!tsh) {
    return null;
  }

  return (
    <TSHDataContext.Provider value={tsh}>
      <ScopeContext.Provider value={scope}>
        <LayoutComponent />
      </ScopeContext.Provider>
    </TSHDataContext.Provider>
  );
};
