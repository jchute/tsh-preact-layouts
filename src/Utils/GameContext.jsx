import { createContext } from "preact";
import { useContext } from "preact/hooks";

/** Shares the current scoreboard's data from TSH with every component on the screen. */
const GameContext = createContext(null);

/**
 * Returns the current scoreboard's data: the set being played, plus tournament info and
 * commentators. Null until TSH's first update arrives.
 *
 * @returns {object|null} The game state.
 */
export const useGame = () => useContext(GameContext);

export default GameContext;
