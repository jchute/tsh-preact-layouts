import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { DEFAULTS } from "./selectors/defaults";

/**
 * The scope: a set of props used to pick data from the TSH payload.
 *
 * The initial scope is set either by query parameters or data attributes on the #app element.
 * The scope can be modified by components with props or by using the `<Scope>` component.
 *
 * Any property not set in the scope will fallback to `DEFAULTS` in the selectors.
 */
export const ScopeContext = createContext({});

/**
 * Reads the initial scope from the page. Any prop in `DEFAULTS` can be set for the whole layout,
 * e.g. `?team=2` or `data-last-set="2"`. Query parameters take priority over data attributes.
 * Numeric values become numbers, and empty ones are ignored.
 *
 * @param {URLSearchParams} params The page's query parameters.
 * @param {DOMStringMap} dataset The data attributes of the #app element.
 * @returns {object} The scope's props.
 */
export const readPageScope = (params, dataset) => {
  const scope = {};

  for (const key of Object.keys(DEFAULTS)) {
    const value = (params.get(key) ?? dataset[key])?.trim();

    if (value) {
      scope[key] = Number.isNaN(Number(value)) ? value : Number(value);
    }
  }

  return scope;
};

/**
 * Returns the current scope from context.
 *
 * @returns {object} The scope's props.
 */
export const useScope = () => useContext(ScopeContext);

/**
 * Combines the current scope with a component's own props. Props left undefined keep the scope's
 * value, while `null` clears it.
 *
 * @param {object} props The component's props.
 * @returns {object} The combined props.
 */
export const useResolveScopeProps = (props) => {
  const result = { ...useScope() };

  for (const key in props) {
    if (props[key] === null) {
      delete result[key];
    } else if (props[key] !== undefined) {
      result[key] = props[key];
    }
  }

  return result;
};
