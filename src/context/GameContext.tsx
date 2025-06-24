import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { gameReducer } from "./GameReducer";
import { deserializeGame, serializeGame } from "../utils/utils";
import type { GameContextType } from "../interfaces/interfaces";

const GameContext = createContext<GameContextType | null>(null);

const initialState = { game: null };

export const GameProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    const stored = localStorage.getItem("monopoly-game");
    return stored
      ? { game: deserializeGame(JSON.parse(stored)) }
      : initialState;
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (state.game) {
      localStorage.setItem(
        "monopoly-game",
        JSON.stringify(serializeGame(state.game))
      );
    }
  }, [state.game]);

  return (
    <GameContext.Provider value={{ state, dispatch, loaded }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGameContext must be used inside GameProvider");
  return context;
};
