import React, { useEffect } from "react";

import type {
  PlayerData,
  PlayerSectionProps,
} from "../../../../interfaces/interfaces";
import PlayerComponent from "./playerComponent";
import { useGameContext } from "../../../../context/GameContext";

import { Player } from "../../../../classes/classes";

import { getRandomColor, getRandomIcon } from "../../../../utils/utils";

const PlayersSection: React.FC<PlayerSectionProps> = ({ playerCount }) => {
  const { state, dispatch, loaded } = useGameContext();

  const [playersData, setPlayersData] = React.useState<PlayerData[]>([]);

  useEffect(() => {
    if (!loaded || !state.game) return;

    const players: PlayerData[] = state.game.getPlayers().map((player) => ({
      id: player.getId(),
      name: player.getName(),
      color: player.getColor(),
      icon: player.getIcon(),
    }));

    setPlayersData(players);

    const currentCount = state.game.getPlayers().length;

    if (currentCount === playerCount) return;
    if (state.game && loaded) {
      let statePlayerCount = state.game.getPlayers().length;

      const usedColors = playersData.map((p) => Number(p.color));
      const usedIcons = playersData.map((p) => Number(p.icon));

      while (statePlayerCount < playerCount) {
        const newColor = getRandomColor(usedColors);
        const newIcon = getRandomIcon(usedIcons);

        const newPlayer = new Player(
          statePlayerCount + 1,
          `Player ${statePlayerCount + 1}`,
          newColor,
          newIcon
        );

        usedColors.push(newColor);
        usedIcons.push(newIcon);

        dispatch({ type: "ADD_PLAYER", payload: newPlayer });
        statePlayerCount++;
      }

      while (statePlayerCount > playerCount) {
        dispatch({
          type: "REMOVE_PLAYER",
          payload: state.game.getPlayers()[statePlayerCount - 1],
        });
        statePlayerCount--;
      }
    }
  }, [playerCount, state.game, dispatch]);

  if (!loaded) return <div>Loading game setup...</div>;
  if (loaded && !state.game) return <div>Failed to Fetch</div>;

  return (
    <div className="players-section">
      <div className="player-section-header">
        <h3 className="name">Players</h3>
        <h3 className="icons">Icons</h3>
        <h3>Colors</h3>
      </div>
      <div className="player-section-players"></div>
      {playersData.map((p: PlayerData, index) => {
        return (
          <PlayerComponent
            key={index}
            id={p.id}
            name={p.name}
            color={p.color}
            icon={p.icon}
            usedData={{
              colors: playersData.map((p) => Number(p.color)),
              icons: playersData.map((p) => Number(p.icon)),
            }}
          />
        );
      })}
    </div>
  );
};

export default PlayersSection;
