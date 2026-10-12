import { Fragment } from "preact";
import { Image } from "@Components/Elements/Image";
import { Text } from "@Components/Elements/Text";
import { useTSH } from "@State/tsh";

/**
 * Factories that turn a selector into a component. Each TSH component is one of four kinds:
 *
 * - Text field: shows a value as text. Accepts every `Text` prop (`fallback`, `format`, `hide`...).
 * - Image field: shows an image URL. Accepts every `Image` prop (`alt`, `width`, `hide`...).
 * - List: calls its children function once per item. Accepts `limit`.
 * - Condition: renders its children only when a value is truthy. Accepts `not` to invert it.
 */

/**
 * Runs a selector against the live TSH data, filling in the page's default scoreboard when `props`
 * doesn't name one. Use it in layouts for values that aren't shown as text, like a team's color.
 *
 * @example
 * const color = useSelector(getTeam, { team: 1 })?.color;
 *
 * @param {(tsh: object|null, props: object) => any} select The selector.
 * @param {object} [props] Props passed to the selector.
 * @returns {*} Whatever the selector returns.
 */
export const useSelector = (select, props = {}) => {
  const { tsh, scoreboard } = useTSH();

  return select(tsh, { ...props, scoreboard: props.scoreboard ?? scoreboard });
};

/**
 * Builds a field factory for an element that displays a value.
 *
 * @param {import("preact").ComponentType} Component Element used to show the value.
 * @param {string} valueProp Prop on `Component` that receives the value.
 */
const createField =
  (Component, valueProp) =>
  (select, defaults = {}) =>
  (props) => (
    <Component {...defaults} {...props} {...{ [valueProp]: useSelector(select, props) }} />
  );

/**
 * Builds a component that shows the selector's value as text.
 *
 * @example
 * export const Seed = createTextField((tsh, props) => getPerson(tsh, props)?.seed);
 *
 * @param {(tsh: object|null, props: object) => any} select Picks the value.
 * @param {object} [defaults] Default props, e.g. `{ fallback: 0 }`.
 */
export const createTextField = createField(Text, "value");

/**
 * Builds a component that shows the image URL the selector returns.
 *
 * @param {(tsh: object|null, props: object) => string|null|undefined} select Picks the URL.
 * @param {object} [defaults] Default props.
 */
export const createImageField = createField(Image, "source");

/**
 * Builds a factory for text fields that each show one property of the same object.
 * Prevents writing the same selector for every simple field.
 *
 * @example
 * const personField = createKeyField(getPerson);
 * export const City = personField("city");
 *
 * @param {(tsh: object|null, props: object) => object|undefined} getObject Finds the object.
 * @returns {(key: string, defaults?: object) => import("preact").FunctionComponent}
 */
export const createKeyField = (getObject) => (key, defaults) =>
  createTextField((tsh, props) => getObject(tsh, props)?.[key], defaults);

/**
 * Builds a component that calls its children function once per item the selector returns,
 * passing the item's TSH key (its index) and the item itself. Pass the index on to the
 * matching prop of the components inside. `limit` caps how many are rendered.
 *
 * @example
 * <LastSets team={1} limit={3}>
 *   {(lastSet) => <LastSetName team={1} lastSet={lastSet} opponent />}
 * </LastSets>
 *
 * @param {(tsh: object|null, props: object) => object} select Returns the items, keyed by index.
 * @param {{ skip?: (item: any) => boolean }} [options] `skip` leaves out items, such as TSH's empty
 * placeholders.
 */
export const createList =
  (select, { skip } = {}) =>
  ({ children, limit, ...props }) =>
    Object.entries(useSelector(select, props) ?? {})
      .map(([key, item]) => [Number(key), item])
      .filter(([, item]) => !skip?.(item))
      .slice(0, limit)
      .map(([index, item]) => <Fragment key={index}>{children(index, item)}</Fragment>);
/**
 * Builds a component that renders its children only when the selector's value is truthy. Pass
 * `not` to render them only when it is falsy.
 *
 * @example
 * <IfBirthday team={1}>🎂</IfBirthday>
 *
 * @param {(tsh: object|null, props: object) => any} select Picks the value to test.
 */
export const createCondition =
  (select) =>
  ({ children, not = false, ...props }) =>
    Boolean(useSelector(select, props)) !== not ? children : null;
