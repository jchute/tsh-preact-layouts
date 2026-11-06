/**
 * Components that show TSH's live data in a layout.
 *
 * Each component is a text field, an image field, a list or a condition, as defined in `createField`.
 *
 * A global scope can be overridden by using the `<Scope>` component or with props on any component.
 *
 * @example
 * <Scope scoreboard={2} team={1}>
 *   <DisplayName />
 *   <Characters>
 *     {(character) => <CharacterImage character={character} asset="base_files/icon" />}
 *   </Characters>
 * </Scope>
 */
export * from "./Data/Bracket";
export * from "./Data/Characters";
export * from "./Data/CompletedSets";
export * from "./Data/Games";
export * from "./Data/History";
export * from "./Data/LastSets";
export * from "./Data/Match";
export * from "./Data/Person";
export * from "./Data/QueuedSets";
export * from "./Data/RecentSets";
export * from "./Data/Stages";
export * from "./Data/StageStrike";
export * from "./Data/Team";
export * from "./Data/TeamBattle";
export * from "./Data/Tournament";
export {
  createCondition,
  createImageField,
  createKeyField,
  createList,
  createTextField,
  If,
  Scope,
} from "./createField";
export { useTSH } from "@State/tsh";
