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
