/**
 * Which item each prop reads when nothing sets it. A component's own prop wins, then the
 * nearest `<Scope>` that sets it, then the page (`?team=2`, or `data-team="2"` on #app),
 * then these defaults.
 *
 * Note: All lists start at 1, including the ones TSH itself starts at 0.
 */
export const DEFAULTS = {
  // Indexed items
  scoreboard: 1,
  team: 1,
  player: 1,
  commentator: 1,
  character: 1,
  lastSet: 1,
  historyEntry: 1,
  recentSet: 1,
  completedSet: 1,
  bracketRound: 1,
  bracketSet: 1,
  bracketSide: 1,
  stage: 1,
  game: 1,
  note: 1,
  queuedSet: 1,

  // Options
  setMode: "bestOf",
};
