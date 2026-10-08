import { Fragment } from "preact";
import { Image } from "@Components/Elements/Image";
import { Text } from "@Components/Elements/Text";
import { useGame } from "@Utils/GameContext";

/**
 * Builds a component that reads a value from the game state and renders it with `Component`.
 *
 * @param {import("preact").ComponentType} Component Element used to render the value.
 * @param {string} valueProp Prop on `Component` that receives the selected value.
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
 * @example
 * export const Seed = createTextField((game, { team, player }) => getPlayer(game, team, player)?.seed);
 */
export const createTextField = createField(Text, "value");

export const createImageField = createField(Image, "source");

/**
 * Builds a component that renders its children function once per item selected from the game
 * state, passing the 1-based index and the raw item. `limit` caps how many are rendered.
 *
 * @example
 * <LastSets team={1} limit={3}>
 *   {(set) => <LastSetOpponent team={1} set={set} />}
 * </LastSets>
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
 */
export const createCondition = (select) => {
  return ({ children, not = false, ...props }) => {
    return Boolean(select(useGame(), props)) !== not ? children : null;
  };
};
