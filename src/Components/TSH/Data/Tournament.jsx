import { createTextField } from "../createField";

const tournamentField = (key) => createTextField((game) => game?.tournament?.[key]);

export const EventEnd = tournamentField("eventEndAt");

export const EventName = tournamentField("eventName");

export const EventStart = tournamentField("eventStartAt");

export const TournamentAddress = tournamentField("address");

export const TournamentEnd = tournamentField("endAt");

export const TournamentEntrants = tournamentField("numEntrants");

export const TournamentName = tournamentField("tournamentName");

export const TournamentShortLink = tournamentField("shortLink");

export const TournamentStart = tournamentField("startAt");
