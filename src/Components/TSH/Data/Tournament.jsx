import { createImageField, createKeyField, createScope, createTextField } from "../createField";
import { getGame, getNote, getTournament } from "@State/selectors";
import { resolveAsset } from "@State/tsh";
import { formatDate } from "@Utils/format";

/**
 * Details about the tournament, the event being streamed (e.g. "Ultimate Singles"), the game and
 * TSH's note widgets. Date components take `locale`, e.g. "October 3, 2026" for "en-US".
 */

/** Builds a text component that shows one property of the tournament info. */
const tournamentField = createKeyField(getTournament);

/**
 * Builds a text component that shows one of the tournament info's dates. Takes `locale`.
 *
 * @param {string} key The date's property, a Unix timestamp in seconds.
 */
const dateField = (key) =>
  createTextField((tsh, { locale, ...props }) =>
    formatDate(getTournament(tsh, props)?.[key], locale),
  );

/** Builds a text component that shows one property of a note. Takes `note` (starting at 1). */
const noteField = createKeyField(getNote);

/** Sets `note` for everything inside. */
export const Note = createScope("note");

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

/** The game selected in TSH, e.g. "Super Smash Bros. Ultimate". */
export const GameName = createKeyField(getGame)("name");

/** The game's logo. */
export const GameLogo = createImageField((tsh) => resolveAsset(getGame(tsh)?.logo));

/** The title of one of TSH's note widgets. Takes `note`. */
export const NoteTitle = noteField("title");

/** The text of one of TSH's note widgets. Takes `note`. */
export const NoteContents = noteField("contents");
