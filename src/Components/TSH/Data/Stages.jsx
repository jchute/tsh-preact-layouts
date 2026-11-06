import { createImageField, createKeyField, createList, createTextField } from "../createField";
import { getRuleset, getRulesetStages, getStage, readLocalizedName } from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Stages. Every stage component reads one stage from one of three places:
 *
 * - By default, the ruleset's starters, picked with `stage` (starting at 1). Add `counterpick`
 *   for the counterpick list, or `all` for starters followed by counterpicks.
 * - With `game`: the stage chosen for that game of the set, e.g. `<StageName game={2} />`.
 * - With `selected`: the stage picked in TSH's stage strike, e.g. `<StageName selected />`.
 *
 * The stage strike components (`IfStageStruck`, `StageStruckBy`...) take the same props.
 */

/** The ruleset's name, e.g. "Genesis Rules". */
export const RulesetName = createKeyField(getRuleset)("name");

/**
 * Repeats its children for each of the ruleset's starters, passing the `stage` index. Takes
 * `counterpick` or `all` to list the counterpicks, or both.
 */
export const Stages = createList(getRulesetStages);

/** The stage's name. `locale` asks for another language TSH has, e.g. "fr" or "pt-BR". */
export const StageName = createTextField((tsh, { locale, ...props }) => {
  return readLocalizedName(getStage(tsh, props), locale);
});

/** The stage's image. */
export const StageImage = createImageField((tsh, props) =>
  resolveAsset(getStage(tsh, props)?.path),
);
