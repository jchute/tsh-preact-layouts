import { createCondition, createTextField } from "../createField";
import {
  DEFAULTS,
  getStageStrike,
  getStageStrikeTurn,
  getStageStruckBy,
  isStageBanned,
  isStageSelected,
  isStageStrikePicking,
  isStageStruck,
} from "@State/selectors";

/**
 * TSH's stage strike, for a stage select screen. Components about a stage take the stage props
 * (`stage`, plus `counterpick` or `all`), so they pair with `<Stages>`. The stage picked is shown
 * with the stage components and `selected`: `<StageName selected />`.
 *
 * @example
 * <Stages all>
 *   {(stage) => (
 *     <>
 *       <StageName stage={stage} all />
 *       <IfStageStruck stage={stage} all>
 *         Struck by team <StageStruckBy stage={stage} all />
 *       </IfStageStruck>
 *     </>
 *   )}
 * </Stages>
 */

/** Renders its children only when the stage has been struck for the current game. */
export const IfStageStruck = createCondition(isStageStruck);

/** The team that struck the stage for the current game: 1 or 2. Empty when it isn't struck. */
export const StageStruckBy = createTextField(getStageStruckBy);

/** Renders its children only when the ruleset's DSR or modified DSR rule bans the stage. */
export const IfStageBanned = createCondition(isStageBanned);

/** Renders its children only when the stage is the one picked for the current game. */
export const IfStageSelected = createCondition(isStageSelected);

/** The game the stage strike is for, starting at 1. */
export const StageStrikeGame = createTextField((tsh, props) => {
  const game = getStageStrike(tsh, props)?.currGame;

  return game >= 0 ? game + 1 : undefined;
});

/** The team whose turn it is to strike or pick: 1 or 2. Empty before rock-paper-scissors. */
export const StageStrikeTurn = createTextField(getStageStrikeTurn);

/** Renders its children only when it's `team`'s (default 1) turn to strike or pick. */
export const IfStageStrikeTurn = createCondition((tsh, { team = DEFAULTS.team, ...props }) => {
  return getStageStrikeTurn(tsh, props) === Number(team);
});

/** Renders its children only while a stage is being picked. Use `not` for while striking. */
export const IfStageStrikePicking = createCondition(isStageStrikePicking);

/** Renders its children only when both teams agreed on a stage instead of striking. */
export const IfGentlemans = createCondition((tsh, props) => getStageStrike(tsh, props)?.gentlemans);
