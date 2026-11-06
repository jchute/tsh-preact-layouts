import { Fragment } from "preact";
import { Image } from "@Components/Elements/Image";
import { Text } from "@Components/Elements/Text";
import { ScopeContext, useResolveScopeProps } from "@State/scope";
import { useTSH } from "@State/tsh";
import { isEmpty } from "@Utils/isEmpty";

/**
 * This file contains all factories that turn a selector into a component.
 *
 * Each TSH component is one of four kinds:
 * - Text field: shows a value as text. See @Components/Elements/Text.
 * - Image field: shows an image URL. See @Components/Elements/Image.
 * - List: calls its children function once per item. Accepts `limit` to cap the number of items.
 * - Condition: renders its children only when a value is truthy. Accepts `not` to invert the condition.
 *
 * `Scope` sets props, such as `team`, for every component inside it.
 */

/**
 * Runs a custom selector against the live TSH data.
 *
 * The selector is a function that returns a value based on the TSH data and the props.
 *
 * @param {(tsh: object|null, props: object) => any} select The selector.
 * @param {object} [props] Props passed to the selector.
 * @returns {*} Whatever the selector returns.
 *
 * @example
 * const score = useSelector((tsh, props) => tsh.score[props.scoreboard]);
 */
export const useSelector = (select, props = {}) => {
  const tsh = useTSH();
  const resolved = useResolveScopeProps(props);

  return select(tsh, resolved);
};

/**
 * Update the scope with given props.
 *
 * Any prop a component takes can be set, and all components inside will use the updated scope.
 *
 * @example
 * <Scope scoreboard={2} team={2}>
 *   <DisplayName />
 *   <Score />
 * </Scope>
 *
 * @param {object} props The props to set, plus `children`.
 */
export const Scope = ({ children, ...props }) => {
  const resolved = useResolveScopeProps(props);

  if (Object.values(props).every((value) => value === undefined)) {
    return children;
  }

  return <ScopeContext.Provider value={resolved}>{children}</ScopeContext.Provider>;
};

/**
 * Builds a field factory for an element that displays a value.
 *
 * @param {import("preact").ComponentType} Component Element used to show the value.
 * @param {string} valueProp Prop on `Component` that receives the value.
 */
const createField = (Component, valueProp) => (select, defaults) => {
  const Field = (props) => (
    <Component {...defaults} {...props} {...{ [valueProp]: useSelector(select, props) }} />
  );

  // Lets `If` ask the field whether it has a value
  Field.select = select;

  return Field;
};

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
export const createImageField = createField(Image, "src");

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
 * passing the item's key and the item itself.
 *
 * Limit may be used to cap the number of items rendered.
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
export const createList = (select, { skip } = {}) => {
  const List = ({ children, limit, ...props }) => {
    const items = useSelector(select, props);

    if (typeof children !== "function") {
      console.error(
        "List components need a function as their children, e.g. {(index) => <Gamertag player={index} />}",
      );
      return null;
    }

    return Object.entries(items ?? {})
      .map(([key, item]) => [String(Number(key)) === key ? Number(key) : key, item])
      .filter(([, item]) => !skip?.(item))
      .slice(0, limit)
      .map(([key, item]) => <Fragment key={key}>{children(key, item)}</Fragment>);
  };

  // Lets `If` ask the list whether it would render any items
  List.select = select;
  List.skip = skip;
  List.isList = true;

  return List;
};

/**
 * Builds a component that renders its children only when the selector's value is truthy.
 *
 * Pass `not` to render them only when it is falsy.
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

/** Whether a text field, image field or list has anything to show. */
const hasContent = (component, tsh, props) => {
  const value = component.select(tsh, props);

  // If the component is a list, check if it has any items to show
  if (component.isList) {
    return Object.values(value ?? {}).some((item) => !component.skip?.(item));
  }

  return !isEmpty(value);
};

/**
 * Renders its children only when there is something to show.
 *
 * - `of`: one field or list.
 * - `anyOf`: an array of them. The children show when at least one has something to show.
 * - `fallback`: rendered instead of the children when the condition isn't met.
 * - `not`: invert the condition.
 *
 * @example
 * <If anyOf={[Controller, ControllerIcon]}>
 *   <h3>Controller</h3>
 *   <ControllerIcon hide />
 *   <Controller hide />
 * </If>
 *
 * @param {object} props
 * @param {import("preact").ComponentType} [props.of] One field or list to test.
 * @param {import("preact").ComponentType[]} [props.anyOf] Fields or lists to test.
 * @param {import("preact").ComponentChildren} [props.fallback] Shown when the condition isn't met.
 * @param {boolean} [props.not] Render when nothing has content.
 */
export const If = ({ anyOf, children, fallback = null, not = false, of, ...props }) => {
  const tsh = useTSH();
  const resolved = useResolveScopeProps(props);
  const components = [of, anyOf].flat().filter((component) => component != null);

  if (!components.length || components.some((component) => !component.select)) {
    console.error(
      "If needs a TSH field or list, e.g. <If of={Seed}> or <If anyOf={[Controller, ControllerIcon]}>",
    );
    return null;
  }

  const show = components.some((component) => hasContent(component, tsh, resolved));

  const content = show !== not ? children : fallback;

  return isEmpty(content) ? null : <Scope {...props}>{content}</Scope>;
};
