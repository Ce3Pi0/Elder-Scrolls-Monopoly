import React, { useEffect, useRef, useState } from "react";

import NumberOfPlayersSection from "./numberOfPlayersSection";
import PlayersSection from "./playersSection";
import StartButton from "./startButton";

import { useGameContext } from "../../../../context/GameContext";
import { Game, Player } from "../../../../classes/classes";
import type { GameType } from "../../../../interfaces/interfaces";

const Body: React.FC = () => {
  const { state, dispatch, loaded } = useGameContext();
  const [playerCount, setPlayerCount] = useState<number>(() => {
    const stored = localStorage.getItem("monopoly-game");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.players?.length ?? 2;
      } catch {
        return 2;
      }
    }
    return 2;
  });

  const hasSyncedPlayerCount = useRef(false);

  useEffect(() => {
    if (loaded && !state.game) {
      const playerOne = new Player(0, "Player 1", 1, 1);
      const playerTwo = new Player(1, "Player 2", 2, 2);
      const players: Player[] = [playerOne, playerTwo];
      const settings: GameType = { type: "Timed", duration: 2700 };

      dispatch({ type: "GAME_SETUP", payload: new Game(players, settings) });
    } else if (loaded && state.game && !hasSyncedPlayerCount.current) {
      setPlayerCount(state.game.getPlayers().length);
      hasSyncedPlayerCount.current = true;
    }
  }, [loaded, state.game, dispatch]);

  if (!loaded) return <div>Loading game setup...</div>;
  if (!state.game) return <div>Failed to Fetch</div>;
  if (state.game.isGameStarted()) location.href = "/game";

  return (
    <div className="game-setup-body">
      <NumberOfPlayersSection
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />
      <PlayersSection playerCount={playerCount} />
      <StartButton />
    </div>
  );
};

export default Body;
