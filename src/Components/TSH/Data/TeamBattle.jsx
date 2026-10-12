import { createKeyField, createTextField } from "../createField";
import { getTeamBattle } from "@State/selectors";

/**
 * TSH's team battle (crew battle). The teams and their players are shown with the team and person
 * components and `source="teamBattle"`, e.g. `<TeamName source="teamBattle" team={1} />`. Person
 * components also offer `IfActive` and `IfEliminated` for team battle players.
 */

/** Builds a text component that shows one property of the team battle. */
const teamBattleField = createKeyField(getTeamBattle);

/** How the battle is scored, as TSH names it, e.g. "STOCK_POOL". */
export const TeamBattleMode = teamBattleField("battle_mode");

/** The round being played, e.g. "Grand Final". */
export const TeamBattleMatch = teamBattleField("match");

/** The bracket phase, e.g. "Top 8". */
export const TeamBattlePhase = teamBattleField("phase");

/** A team's total score in the battle, e.g. stocks remaining. Takes `team` (1 or 2). */
export const TeamBattleScore = createTextField(
  (tsh, { team = 1 }) => getTeamBattle(tsh)?.[`team${team}_total-score`],
);
