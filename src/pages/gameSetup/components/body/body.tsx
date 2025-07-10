import React, { useEffect, useRef, useState } from "react";

import NumberOfPlayersSection from "./numberOfPlayersSection";
import PlayersSection from "./playersSection";
import StartButton from "./startButton";

import { useGameContext } from "../../../../context/GameContext";
import { Game, Player } from "../../../../classes/classes";
import type { GameType } from "../../../../interfaces/interfaces";
import { Colors, Icons } from "../../../../utils/enums";
import { BoardArray } from "../../../../utils/utils";

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
      const playerId_1: number = 0,
        playerId_2: number = 1;
      const tSeconds: number = 2700;

      const playerName_1: string = "Player 1",
        playerName_2: string = "Player 2";

      const playerOne = new Player(
        playerId_1,
        playerName_1,
        Colors.RED,
        Icons.SKYRIM
      );

      let deeds = BoardArray.map((cell) => cell.deed);
      deeds = deeds.filter((deed) => deed !== null);
      for (let deed of deeds) {
        if (deed === null) continue;
        playerOne.addDeed(deed);
      }

      const playerTwo = new Player(
        playerId_2,
        playerName_2,
        Colors.GREEN,
        Icons.OBLIVION
      );
      const players: Player[] = [playerOne, playerTwo];
      const settings: GameType = { type: "Timed", duration: tSeconds };

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
