/**
 * Components that show TSH's live data in a layout.
 *
 * Each component is a text field (takes the `Text` props: `fallback`, `format`, `hide`, `prefix`,
 * `suffix`, `className`), an image field (takes the `Image` props), a list (a children function
 * that receives each index, plus `limit`) or a condition (renders children, takes `not`).
 *
 * Props pick what to show. Each is named after what it picks, and matches TSH's own key, which
 * starts at 1 for most lists and at 0 for `recentSet`, `stage` and `bracketSet`:
 *
 * - `team`, `player`: a team and a player on it. Defaults to the current set's first team and its
 *   first player. `source` reads another part of TSH: "playerList", "bracket" or "teamBattle".
 * - `commentator`: a commentator, used instead of `team` / `player`.
 * - `character`: one of the person's characters. Add `main` for their mains, or `lastSet` (plus
 *   `opponent`) for a team's previous set.
 * - `lastSet`, `historyEntry`, `recentSet`, `completedSet`, `bracketRound`, `bracketSet`, `stage`,
 *   `note`: one item from the matching list.
 * - `romanized`: prefer the Latin-script names TSH generates for names in other alphabets.
 * - `scoreboard`: which TSH scoreboard to read. Usually set once by the page or `<Scoreboard>`.
 *
 * @example
 * <Characters team={1}>
 *   {(character) => <Character team={1} character={character} asset="base_files/icon" />}
 * </Characters>
 */
export * from "./Data/Bracket";
export * from "./Data/Characters";
export * from "./Data/CompletedSets";
export * from "./Data/History";
export * from "./Data/LastSets";
export * from "./Data/Match";
export * from "./Data/Person";
export * from "./Data/RecentSets";
export * from "./Data/Stages";
export * from "./Data/Team";
export * from "./Data/TeamBattle";
export * from "./Data/Tournament";
export {
  createCondition,
  createImageField,
  createKeyField,
  createList,
  createTextField,
  useSelector,
} from "./createField";
export { Scoreboard, useTSH } from "@State/tsh";
