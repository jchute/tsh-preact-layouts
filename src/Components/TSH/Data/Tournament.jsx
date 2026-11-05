import { createImageField, createKeyField, createTextField } from "../createField";
import { getNote, getTournament, getVideogame } from "@State/selectors";
import { resolveAsset } from "@State/tsh";
import { formatDate } from "@Utils/format";

/**
 * Details about the tournament, the event being streamed (e.g. "Ultimate Singles"),
 * the videogame and TSH's note widgets.
 */

/** Builds a text component that shows one property of the tournament info. */
const tournamentField = createKeyField(getTournament);

/**
 * Builds a text component that shows one of the tournament info's dates.
 *
 * @param {string} key The date's property, a timestamp or a date string.
 */
const dateField = (key) =>
  createTextField((tsh, { locale, ...props }) =>
    formatDate(getTournament(tsh, props)?.[key], locale),
  );

/** Builds a text component that shows one property of a note. Takes `note` (starting at 1). */
const noteField = createKeyField(getNote);

/** The tournament's name, e.g. "Genesis 11". */
export const TournamentName = tournamentField("tournamentName");

/** Where the tournament is held. */
export const TournamentAddress = tournamentField("address");

/** How many people entered. */
export const TournamentEntrants = tournamentField("numEntrants");

/** Short start.gg link to the tournament page. */
export const TournamentShortLink = tournamentField("shortLink");

/** When the whole tournament begins. */
export const TournamentStart = dateField("startAt");

/** When the whole tournament finishes. */
export const TournamentEnd = dateField("endAt");

/** The event being streamed, e.g. "Ultimate Singles". */
export const EventName = tournamentField("eventName");

/** When the event being streamed begins. */
export const EventStart = dateField("eventStartAt");

/** When the event being streamed finishes. */
export const EventEnd = dateField("eventEndAt");

/** The videogame selected in TSH, e.g. "Super Smash Bros. Ultimate". */
export const VideogameName = createKeyField(getVideogame)("name");

/** The videogame's logo. */
export const VideogameLogo = createImageField((tsh) => resolveAsset(getVideogame(tsh)?.logo));

/** The title of one of TSH's note widgets. Takes `note`. */
export const NoteTitle = noteField("title");

/** The text of one of TSH's note widgets. Takes `note`. */
export const NoteContents = noteField("contents");
