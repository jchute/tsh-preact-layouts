import { createTextField } from "../createField";
import { getTeam } from "@Utils/selectors";

export const BestOf = createTextField((game) => game?.best_of);

export const CasterName = createTextField((game, { caster = 1 }) => {
  return game?.commentary?.[caster]?.mergedName;
});

export const Match = createTextField((game) => game?.match);

export const Phase = createTextField((game) => game?.phase);

export const SetScore = createTextField((game, { separator = " - " }) => {
  return [1, 2].map((team) => getTeam(game, team)?.score || 0).join(separator);
});

export const TournamentName = createTextField((game) => game?.tournament?.tournamentName);

export const UpsetFactor = createTextField((game) => game?.upset_factor);
