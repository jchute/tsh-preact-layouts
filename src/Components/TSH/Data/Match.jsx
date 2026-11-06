import { createKeyField, createTextField } from "../createField";
import { SCORE_SEPARATOR } from "@Utils/format";
import { useResolveScopeProps } from "@State/scope";
import { DEFAULTS, getBracketType, getScore, getScoreboard, getTeams } from "@State/selectors";

/** Details about the set currently on the scoreboard. */

/** Builds a text component that shows one property of the scoreboard. */
const matchField = createKeyField(getScoreboard);

/** Builds a text component for a value TSH provides in three forms. */
const setLengthTextVariantField = (key) => {
  return createTextField((tsh, { setLengthTextVariant = "number", ...props }) => {
    const keys = { number: key, text: `${key}_text`, short: `${key}_short_text` };

    if (!Object.hasOwn(keys, setLengthTextVariant)) {
      console.error(
        `setLengthTextVariant must be "number", "text" or "short", got "${setLengthTextVariant}".`,
      );
    }

    return getScoreboard(tsh, props)?.[keys[setLengthTextVariant]];
  });
};

/** How many games the set can last: 5 (`setLengthTextVariant="number"`, default), "Best of 5" (`"text"`) or "BO5" (`"short"`). */
export const BestOf = setLengthTextVariantField("best_of");

/** Game wins needed to take the set: 3 (`setLengthTextVariant="number"`, default), "First to 3" (`"text"`) or "FT3" (`"short"`). */
export const FirstTo = setLengthTextVariantField("first_to");

/**
 * The set's length as either `BestOf` or `FirstTo`, chosen with `setMode`, so a layout can swap
 * between them by changing one prop (or once for many components with `<Scope setMode="firstTo">`).
 *
 * - `setMode`: "bestOf" (default) or "firstTo".
 * - `setLengthTextVariant`: "number" (default), "text" or "short".
 *
 * @example
 * <SetLength setMode="firstTo" setLengthTextVariant="text" />
 * <SetLength setLengthTextVariant="number" />
 */
export const SetLength = (props) => {
  const { setMode = DEFAULTS.setMode } = useResolveScopeProps(props);
  const fields = { bestOf: BestOf, firstTo: FirstTo };
  const Field = fields[setMode];

  if (!Field) {
    console.error(`setMode must be "bestOf" or "firstTo", got "${setMode}".`);
    return null;
  }

  return <Field {...props} />;
};

/** The round being played, e.g. "Losers Quarter-Final". */
export const Match = matchField("match");

// Alias for Match with a more descriptive name.
export const RoundName = Match;

/** The round as a number, alongside the `RoundName` round name. */
export const RoundNumber = matchField("round");

/** The bracket phase, e.g. "Top 8". */
export const Phase = matchField("phase");

/** Number of pools in the phase. */
export const PhaseGroups = matchField("num_groups");

/** Number of entrants in the phase. */
export const PhaseSize = matchField("phase_size");

/** Both teams' game wins in the current set, team 1 first, e.g. "2 - 1". Takes `scoreSeparator`. */
export const SetScore = createTextField((tsh, { scoreSeparator = SCORE_SEPARATOR, ...props }) => {
  return Object.keys(getTeams(tsh, props))
    .map((team) => getScore(tsh, { ...props, team }))
    .join(scoreSeparator);
});

/** The setup the set is being played on. */
export const Station = matchField("station");

/** Link to the stream showing this set. */
export const StreamUrl = matchField("stream_url");

/** How big an upset it would be, based on seeding, if the lower seed wins. */
export const UpsetFactor = matchField("upset_factor");

/** The bracket format, as TSH names it, e.g. "DOUBLE_ELIMINATION". */
export const BracketType = createTextField(getBracketType);
