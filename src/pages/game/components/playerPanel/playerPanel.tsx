import React from "react";
import PlayerPanelHeader from "./playerPanelHeader";
import { useGameContext } from "../../../../context/GameContext";
import Player from "./player";
import Footer from "./footer";

const PlayerPanel: React.FC = () => {
  const { state, loaded } = useGameContext();

  return (
    <div className="player-panel">
      <PlayerPanelHeader />
      <hr />
      <div className="players-title">
        <h2>Players</h2>
      </div>
      {loaded &&
        state.game &&
        state.game.getPlayers().map((player) => {
          return (
            <Player
              key={player.getId()}
              id={player.getId()}
              name={player.getName()}
              color={player.getColor()}
              icon={player.getIcon()}
              balance={player.getBalance()}
            />
          );
        })}
      <Footer />
    </div>
  );
};

export default PlayerPanel;
