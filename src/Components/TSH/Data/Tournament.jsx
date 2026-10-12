import { createImageField, createKeyField } from "../createField";
import { getGame, getNote, getTournament } from "@State/selectors";
import { resolveAsset } from "@State/tsh";

/**
 * Details about the tournament, the event being streamed (e.g. "Ultimate Singles"), the game and
 * TSH's note widgets. Dates come through as start.gg provides them.
 */

/** Builds a text component that shows one property of the tournament info. */
const tournamentField = createKeyField(getTournament);

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
export const TournamentStart = tournamentField("startAt");

/** When the whole tournament finishes. */
export const TournamentEnd = tournamentField("endAt");

/** The event being streamed, e.g. "Ultimate Singles". */
export const EventName = tournamentField("eventName");

/** When the event being streamed begins. */
export const EventStart = tournamentField("eventStartAt");

/** When the event being streamed finishes. */
export const EventEnd = tournamentField("eventEndAt");

/** The game selected in TSH, e.g. "Super Smash Bros. Ultimate". */
export const GameName = createKeyField(getGame)("name");

/** The game's logo. */
export const GameLogo = createImageField((tsh) => resolveAsset(getGame(tsh)?.logo));

/** The title of one of TSH's note widgets. Takes `note`. */
export const NoteTitle = noteField("title");

/** The text of one of TSH's note widgets. Takes `note`. */
export const NoteContents = noteField("contents");
