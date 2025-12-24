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
        state.game.getPlayersInfo().map((playerInfo) => {
          return (
            <Player
              key={playerInfo.id}
              id={playerInfo.id}
              name={playerInfo.name}
              color={playerInfo.color}
              icon={playerInfo.icon}
              balance={playerInfo.balance}
            />
          );
        })}
      <Footer />
    </div>
  );
};

export default PlayerPanel;
