import { createContext } from "preact";
import { useContext } from "preact/hooks";

const GameContext = createContext(null);

export const useGame = () => useContext(GameContext);

export default GameContext;
