import { createKeyField, createList, createScope, createTextField } from "../createField";
import { getRuleset, getStage, getStages } from "@State/selectors";

/**
 * The ruleset selected in TSH and its stage lists. Stage components take `stage` (starting at 0),
 * plus `counterpick` to read the counterpick list instead of the starters.
 */

/** The ruleset's name, e.g. "Genesis Rules". */
export const RulesetName = createKeyField(getRuleset)("name");

/** Sets `stage` for everything inside. Takes `counterpick` too. */
export const Stage = createScope("stage");

/** Repeats its children for each starter stage, or counterpick stage with `counterpick`. */
export const Stages = createList(getStages);

/**
 * The stage's name. `locale` shows it in another language TSH knows, e.g. "fr" or "ja", falling
 * back to TSH's display name.
 */
export const StageName = createTextField((tsh, { locale, ...props }) => {
  const stage = getStage(tsh, props);

  return (locale && stage?.locale?.[locale]) || stage?.display_name || stage?.name;
});
