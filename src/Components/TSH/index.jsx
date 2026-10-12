/**
 * Components that show TSH's live data in a layout.
 *
 * Each component is a text field (takes the `Text` props: `fallback`, `format`, `hide`, `prefix`,
 * `suffix`, `className`), an image field (takes the `Image` props), a list (a children function
 * that receives each index, plus `limit`), a condition (renders children, takes `not`) or a scope.
 *
 * Props pick what to show. Each is named after what it picks, and matches TSH's own key, which
 * starts at 1 for most lists and at 0 for `recentSet`, `stage` and `bracketSet`:
 *
 * - `team`, `player`: a team and a player on it. Defaults to the current set's first team and its
 *   first player. `source` reads another part of TSH: "playerList", "bracket", "teamBattle" or
 *   "stationQueue".
 * - `commentator`: a commentator, used instead of `team` / `player`.
 * - `character`: one of the person's characters. Add `main` for their mains, or `lastSet` (plus
 *   `opponent`) for a team's previous set.
 * - `lastSet`, `historyEntry`, `recentSet`, `completedSet`, `bracketRound`, `bracketSet`, `stage`,
 *   `note`, `queuedSet`: one item from the matching list.
 * - `romanized`: prefer the Latin-script names TSH generates for names in other alphabets.
 * - `scoreboard`: which TSH scoreboard to read.
 *
 * Each picking prop is resolved the same way, first match wins:
 *
 * 1. The component's own prop: `<DisplayName team={2} />`.
 * 2. The nearest scope of the same name, capitalized: `<Scoreboard>`, `<Team>`, `<Player>`,
 *    `<Commentator>`, `<Character>`, `<LastSet>`, `<HistoryEntry>`, `<RecentSet>`,
 *    `<CompletedSet>`, `<BracketRound>`, `<BracketSet>`, `<Stage>`, `<Note>` or `<QueuedSet>`.
 *    Other props on a scope, like `source`, are set alongside.
 * 3. The page: `?team=2` in the URL, or `data-team="2"` on #app.
 * 4. `DEFAULTS`, from @State/selectors.
 *
 * @example
 * <Team team={1}>
 *   <DisplayName />
 *   <Characters>
 *     {(character) => <CharacterImage character={character} asset="base_files/icon" />}
 *   </Characters>
 * </Team>
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
export * from "./Data/StationQueue";
export * from "./Data/Team";
export * from "./Data/TeamBattle";
export * from "./Data/Tournament";
export {
  createCondition,
  createImageField,
  createKeyField,
  createList,
  createScope,
  createTextField,
  useSelector,
} from "./createField";
export { useTSH } from "@State/tsh";
