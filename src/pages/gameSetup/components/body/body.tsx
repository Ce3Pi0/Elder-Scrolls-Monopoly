import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import NumberOfPlayersSection from "./numberOfPlayersSection";
import PlayersSection from "./playersSection";
import StartButton from "./startButton";

import { useGameContext } from "../../../../context/GameContext";
import { Colors, Icons } from "../../../../utils/enums";
import { Player } from "../../../../classes/concrete/player";
import { BOARD_ARRAY } from "../../../../utils/constants";
import type { GameSettings } from "../../../../utils/types";
import { Game } from "../../../../classes/concrete/game";

const Body: React.FC = () => {
  const { state, dispatch, loaded } = useGameContext();
  const navigate = useNavigate();

  const [playerCount, setPlayerCount] = useState<number>(() => {
    const players = localStorage.getItem("players");
    if (players) {
      try {
        const parsed = JSON.parse(players);
        return Array.isArray(parsed) ? parsed.length : 2;
      } catch {
        return 2;
      }
    }
    return 2;
  });

  const hasSyncedPlayerCount = useRef(false);

  useEffect(() => {
    if (loaded && state.game && state.game.isGameStarted()) {
      navigate("/game");
    }
  }, [loaded, state.game, navigate]);

  useEffect(() => {
    if (loaded && !state.game) {
      const tSeconds: number = 2700;

      const playerOne = new Player(0, "Player 1", Colors.RED, Icons.SKYRIM);
      const playerTwo = new Player(1, "Player 2", Colors.GREEN, Icons.OBLIVION);

      const players: Player[] = [playerOne, playerTwo];
      const settings: GameSettings = { type: "Timed", duration: tSeconds / 60 };

      dispatch({
        flowType: "GAME_SETUP",
        actionData: { game: new Game(players, settings, BOARD_ARRAY) },
      });
    } else if (loaded && state.game && !hasSyncedPlayerCount.current) {
      setPlayerCount(state.game.getPlayersInfo().length);
      hasSyncedPlayerCount.current = true;
    }
  }, [loaded, state.game, dispatch]);

  if (!loaded || (state.game && state.game.isGameStarted())) {
    return (
      <div className="loading-container">
        <div>Loading game setup...</div>
      </div>
    );
  }

  if (!state.game) {
    return <div className="error-container">Failed to Fetch Game State</div>;
  }

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
