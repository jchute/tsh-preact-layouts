import { createKeyField, createList, createScope, createTextField } from "../createField";
import { getQueuedSet, getStationQueue } from "@State/selectors";

/**
 * Upcoming sets on the scoreboard's station, after the one being played. Every component here
 * takes `queuedSet` (1 being the next). Each side is shown with the team and person components and
 * `source="stationQueue"`: `<DisplayName source="stationQueue" queuedSet={1} team={2} />`.
 */

/** Builds a text component that shows one property of the set. */
const queuedSetField = createKeyField(getQueuedSet);

/** Sets `queuedSet` for everything inside. */
export const QueuedSet = createScope("queuedSet");

/** Repeats its children for each upcoming set, passing the `queuedSet` index. Skips unloaded sets. */
export const StationQueue = createList(getStationQueue, { skip: (set) => !set });

/** The round the set is in, e.g. "Winners Quarter-Final". */
export const QueuedSetRound = queuedSetField("match");

/** The bracket phase the set is in, e.g. "Top 8". */
export const QueuedSetPhase = queuedSetField("phase");

/** How many games the set can last: 5, or "Best of 5" with `variant="text"`. */
export const QueuedSetBestOf = createTextField((tsh, { variant, ...props }) => {
  const set = getQueuedSet(tsh, props);

  return (variant === "text" ? set?.best_of_text : set?.best_of) || undefined;
});

/** The setup the set will be played on. Empty when TSH doesn't know it. */
export const QueuedSetStation = createTextField((tsh, props) => {
  const station = getQueuedSet(tsh, props)?.station;

  return station != null && station >= 0 ? station : undefined;
});
