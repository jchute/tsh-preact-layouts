import { startTSHPolling } from "@Utils/TshLoader";
import { useEffect, useState } from "preact/hooks";

export const useScoreboardData = (scoreboard = 1) => {
  const [game, setGame] = useState(null);

  useEffect(() => {
    startTSHPolling();

    const handler = (e) => {
      const commentary = e.detail.data?.commentary || {};
      const tournament = e.detail.data?.tournamentInfo || {};
      const game = e.detail.data?.score?.[scoreboard] || {};
      setGame({ ...game, tournament, commentary });
    };

    document.addEventListener("tsh_update", handler);
    return () => document.removeEventListener("tsh_update", handler);
  }, [scoreboard]);

  return game;
};
