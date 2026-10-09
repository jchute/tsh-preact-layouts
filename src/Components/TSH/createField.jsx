import { Fragment } from "preact";
import { Image } from "@Components/Elements/Image";
import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

/**
 * Builds a component that reads a value from the game state and renders it with `Component`.
 *
 * @param {import("preact").ComponentType} Component Element used to render the value.
 * @param {string} valueProp Prop on `Component` that receives the selected value.
 * @returns {(select: (game: object, props: object) => any, defaults?: object) => import("preact").FunctionComponent}
 * A factory that takes a selector, which picks the value out of the game state using the
 * component's props, and optional default props.
 */
const createField =
  (Component, valueProp) =>
  (select, defaults = {}) => {
    return (props) => {
      const game = useGame();

      return <Component {...defaults} {...props} {...{ [valueProp]: select(game, props) }} />;
    };
  };

/**
 * Builds a component that shows a piece of game state as text. Accepts every `Text` prop, such as
 * `fallback`, `format` and `hide`.
 *
 * @example
 * export const Seed = createTextField((game, { team, player }) => getPlayer(game, team, player)?.seed);
 */
export const createTextField = createField(Text, "value");

/**
 * Builds a component that shows a piece of game state as an image, where the selector returns the
 * image URL. Accepts every `Image` prop, such as `mask` and `width`.
 */
export const createImageField = createField(Image, "source");

/**
 * Builds a component that renders its children function once per item selected from the game
 * state, passing the 1-based index and the raw item. `limit` caps how many are rendered.
 *
 * @example
 * <LastSets team={1} limit={3}>
 *   {(set) => <LastSetOpponent team={1} set={set} />}
 * </LastSets>
 *
 * @param {(game: object, props: object) => any[]} select Picks the items out of the game state.
 * @returns {import("preact").FunctionComponent} The list component.
 */
export const createList = (select) => {
  return ({ children, limit, ...props }) => {
    const items = select(useGame(), props) ?? [];

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
 * @param {(game: object, props: object) => any} select Picks the value to test from the game state.
 * @returns {import("preact").FunctionComponent} The conditional component.
 */
export const createCondition = (select) => {
  return ({ children, not = false, ...props }) => {
    return Boolean(select(useGame(), props)) !== not ? children : null;
  };
};
