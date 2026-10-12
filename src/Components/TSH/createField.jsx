import { Fragment } from "preact";
import { Image } from "@Components/Elements/Image";
import { Text } from "@Components/Elements/Text";
import { useTSH } from "@State/tsh";

/**
 * Builds a component that reads a value from TSH and renders it with `Component`.
 *
 * @param {import("preact").ComponentType} Component Element used to render the value.
 * @param {string} valueProp Prop on `Component` that receives the selected value.
 * @returns {(select: (tsh: object, props: object) => any, defaults?: object) => import("preact").FunctionComponent}
 * A factory that takes a selector, which picks the value out of TSH using the component's props,
 * and optional default props. Built components accept `scoreboard` to read a specific TSH.score
 * entry; it defaults to 1, or the page / Scoreboard default.
 */
const createField =
  (Component, valueProp) =>
  (select, defaults = {}) => {
    return (props) => {
      const { tsh, scoreboard } = useTSH();

      return (
        <Component
          {...defaults}
          {...props}
          {...{
            [valueProp]: select(tsh, { ...props, scoreboard: props.scoreboard ?? scoreboard }),
          }}
        />
      );
    };
  };

/**
 * Builds a component that shows a piece of TSH data as text. Accepts every `Text` prop, such as
 * `fallback`, `format` and `hide`.
 *
 * @example
 * export const Seed = createTextField((tsh, { team, player, scoreboard }) =>
 *   getPlayer(tsh, team, player, scoreboard)?.seed);
 */
export const createTextField = createField(Text, "value");

/**
 * Builds a component that shows a piece of TSH data as an image, where the selector returns the
 * image URL. Accepts every `Image` prop, such as `alt` and `width`.
 */
export const createImageField = createField(Image, "source");

/**
 * Builds a component that renders its children function once per item selected from TSH, passing
 * the 1-based index and the raw item. `limit` caps how many are rendered.
 *
 * @example
 * <LastSets team={1} limit={3}>
 *   {(set) => <LastSetOpponent team={1} set={set} />}
 * </LastSets>
 *
 * @param {(tsh: object, props: object) => any[]} select Picks the items out of TSH.
 * @returns {import("preact").FunctionComponent} The list component.
 */
export const createList = (select) => {
  return ({ children, limit, ...props }) => {
    const { tsh, scoreboard } = useTSH();
    const items = select(tsh, { ...props, scoreboard: props.scoreboard ?? scoreboard }) ?? [];

    return items
      .slice(0, limit)
      .map((item, index) => <Fragment key={index}>{children(index + 1, item)}</Fragment>);
  };
};

/**
 * Builds a component that renders its children only when the selected value is truthy.
 * Pass `not` to invert it.
 *
 * @example
 * <IfBirthday team={1}>🎂</IfBirthday>
 *
 * @param {(tsh: object, props: object) => any} select Picks the value to test from TSH.
 * @returns {import("preact").FunctionComponent} The conditional component.
 */
export const createCondition = (select) => {
  return ({ children, not = false, ...props }) => {
    const { tsh, scoreboard } = useTSH();

    return Boolean(select(tsh, { ...props, scoreboard: props.scoreboard ?? scoreboard })) !== not
      ? children
      : null;
  };
};
