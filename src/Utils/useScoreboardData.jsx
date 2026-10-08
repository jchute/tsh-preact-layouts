import { getLatestTSHData, startTSHPolling } from "@Utils/TshLoader";
import { useEffect, useState } from "preact/hooks";

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
