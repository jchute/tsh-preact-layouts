import { createTextField } from "../createField";

/**
 * Details about the whole tournament and the event (e.g. "Ultimate Singles") being streamed.
 * Dates come through as start.gg provides them.
 */

/**
 * Builds a text component that shows one property of TSH's tournament info.
 *
 * @param {string} key Property name on TSH's tournament object.
 */
const tournamentField = (key) => createTextField((game) => game?.tournament?.[key]);

/** When the event being streamed finishes. */
export const EventEnd = tournamentField("eventEndAt");

/** The event being streamed, e.g. "Ultimate Singles". */
export const EventName = tournamentField("eventName");

/** When the event being streamed begins. */
export const EventStart = tournamentField("eventStartAt");

/** Where the tournament is held. */
export const TournamentAddress = tournamentField("address");

/** When the whole tournament finishes. */
export const TournamentEnd = tournamentField("endAt");

/** How many people entered. */
export const TournamentEntrants = tournamentField("numEntrants");

/** The tournament's name, e.g. "Genesis 11". */
export const TournamentName = tournamentField("tournamentName");

/** Short start.gg link to the tournament page. */
export const TournamentShortLink = tournamentField("shortLink");

/** When the whole tournament begins. */
export const TournamentStart = tournamentField("startAt");
