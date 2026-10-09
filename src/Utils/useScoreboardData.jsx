import { getLatestTSHData, startTSHPolling } from "@Utils/TshLoader";
import { useEffect, useState } from "preact/hooks";

/**
 * Picks one scoreboard out of TSH's full state and adds the tournament info and commentators,
 * which TSH stores separately, so components can read everything from one object.
 *
 * @param {object|null} data The whole program_state.json payload.
 * @param {number|string} scoreboard Which TSH scoreboard to read.
 * @returns {object|null} The game state, or null if no data has loaded.
 */
const selectGame = (data, scoreboard) => {
  if (!data) {
    return null;
  }

  return {
    ...(data.score?.[scoreboard] || {}),
    tournament: data.tournamentInfo || {},
    commentary: data.commentary || {},
  };
};

/**
 * Keeps a scoreboard's data up to date with TSH, starting the polling if nothing else has.
 *
 * @param {number|string} [scoreboard] Which TSH scoreboard to read. Defaults to the first.
 * @returns {object|null} The game state, or null until TSH's first update arrives.
 */
export const useScoreboardData = (scoreboard = 1) => {
  const [game, setGame] = useState(() => selectGame(getLatestTSHData(), scoreboard));

  useEffect(() => {
    startTSHPolling();

    // Pick up any data that arrived before this hook subscribed
    setGame(selectGame(getLatestTSHData(), scoreboard));

    const handler = (e) => setGame(selectGame(e.detail.data, scoreboard));

    document.addEventListener("tsh_update", handler);
    return () => document.removeEventListener("tsh_update", handler);
  }, [scoreboard]);

  return game;
};
