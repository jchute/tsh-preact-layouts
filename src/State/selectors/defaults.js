/**
 * Which item each picking prop reads when nothing sets it. A component's own prop wins, then the
 * nearest scope (`<Team>`, `<Player>`...), then the page (`?team=2`, or `data-team="2"` on #app),
 * then these. TSH starts most lists at 1, and recent sets, stages and bracket sets at 0.
 *
 * These are only used as fallbacks, never added to the scope, so `commentator` and `lastSet` still
 * switch a component to commentators or a previous set only when something sets them.
 */
export const DEFAULTS = {
  scoreboard: 1,
  team: 1,
  player: 1,
  commentator: 1,
  character: 1,
  lastSet: 1,
  historyEntry: 1,
  recentSet: 0,
  completedSet: 1,
  bracketRound: 1,
  bracketSet: 0,
  stage: 0,
  note: 1,
  queuedSet: 1,
};
