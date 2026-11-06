import { createKeyField, createList, createTextField } from "../createField";
import { getQueue, getQueuedSet } from "@State/selectors";

/**
 * Upcoming sets. Every component here takes `queuedSet` (1 being the first in the queue) and
 * reads one of two queues:
 *
 * - By default, the scoreboard's station queue: the sets after the one being played on its station.
 * - With `queue="stream"`: the start.gg stream queue, which can include the set being played.
 *   `stream` picks a stream by its start.gg name, and defaults to the Twitch username set in TSH.
 *
 * Each side is shown with the team and person components and `source="queuedSet"`:
 * `<DisplayName source="queuedSet" queue="stream" queuedSet={1} team={2} />`.
 */

/** Builds a text component that shows one property of the set. */
const queuedSetField = createKeyField(getQueuedSet);

/** Repeats its children for each upcoming set, passing the `queuedSet` index. Skips unloaded sets. */
export const QueuedSets = createList(getQueue, { skip: (set) => !set });

/** The round the set is in, e.g. "Winners Quarter-Final". */
export const QueuedSetRound = queuedSetField("match");

/** The bracket phase the set is in, e.g. "Top 8". */
export const QueuedSetPhase = queuedSetField("phase");

/**
 * How many games the set can last: 5 (`queuedSetLengthTextVariant="number"`, default) or
 * "Best of 5" (`"text"`).
 */
export const QueuedSetBestOf = createTextField(
  (tsh, { queuedSetLengthTextVariant = "number", ...props }) => {
    const set = getQueuedSet(tsh, props);

    return (queuedSetLengthTextVariant === "text" ? set?.best_of_text : set?.best_of) || undefined;
  },
);

/** The setup the set will be played on. Empty when TSH doesn't know it. */
export const QueuedSetStation = createTextField((tsh, props) => {
  const station = getQueuedSet(tsh, props)?.station;

  return station != null && station >= 0 ? station : undefined;
});
