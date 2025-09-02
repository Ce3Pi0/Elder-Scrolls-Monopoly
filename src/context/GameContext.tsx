import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { gameReducer } from "./GameReducer";
import type { GameContextType } from "../utils/interfaces";
import type { Game } from "../classes/concrete/game";
import { GameDeserializerSingleton } from "../classes/concrete/gameDeserializer";

const GameContext = createContext<GameContextType | null>(null);

const initialState = { game: null };

export const GameProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    const game: Game = GameDeserializerSingleton.deserializeData();

    return game ? { game: game } : initialState;
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (state.game) {
      state.game.serialize();
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
