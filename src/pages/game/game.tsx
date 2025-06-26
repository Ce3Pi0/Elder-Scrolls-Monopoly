import React from "react";

import Board from "./components/board/board";
import PlayerPanel from "./components/playerPanel/playerPanel";
import DicePanel from "./components/dicePanel/dicePanel";

import "./css/styles.css";

const Game: React.FC = () => {
  return (
    <div className="game-page">
      <div className="board-container">
        <Board />
      </div>
      <div className="side-panel">
        <div className="player-panel">
          <PlayerPanel />
        </div>
        <div className="dice-panel">
          <DicePanel />
        </div>
      </div>
    </div>
  );
};

export default Game;
