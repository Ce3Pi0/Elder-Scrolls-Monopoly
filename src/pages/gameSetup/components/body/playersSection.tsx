import React, { useEffect } from "react";

import type {
  PlayerData,
  PlayerSectionProps,
} from "../../../../utils/interfaces";
import PlayerComponent from "./playerComponent";
import { useGameContext } from "../../../../context/GameContext";
import { getRandomColor, getRandomIcon } from "../../../../utils/helpers";
import { Player } from "../../../../classes/concrete/player";

const PlayersSection: React.FC<PlayerSectionProps> = ({ playerCount }) => {
  const { state, dispatch, loaded } = useGameContext();

  const playersData: PlayerData[] =
    loaded && state.game
      ? state.game.getPlayersInfo().map((player) => ({
          id: player.id,
          name: player.name,
          color: player.color,
          icon: player.icon,
        }))
      : [];

  useEffect(() => {
    if (!loaded || !state.game) return;

    const players: PlayerData[] = state.game.getPlayersInfo().map((player) => ({
      id: player.id,
      name: player.name,
      color: player.color,
      icon: player.icon,
    }));

    const currentCount = state.game.getPlayersInfo().length;

    if (currentCount === playerCount) return;

    if (state.game && loaded) {
      let statePlayerCount = state.game.getPlayersInfo().length;

      const usedColors = players.map((p) => Number(p.color));
      const usedIcons = players.map((p) => Number(p.icon));

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

        dispatch({
          flowType: "ADD_PLAYER",
          actionData: {
            player: newPlayer,
          },
        });
        statePlayerCount++;
      }

      while (statePlayerCount > playerCount) {
        dispatch({
          flowType: "REMOVE_PLAYER",
          actionData: {
            playerId: state.game.getPlayersInfo()[statePlayerCount - 1].id,
          },
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
