import Board from "./components/board/board";
import PlayerPanel from "./components/playerPanel/playerPanel";
import DicePanel from "./components/dicePanel/dicePanel";

import { useGameContext } from "../../context/GameContext";

import "./css/styles.css";
import { PLAYER_COLORS } from "../../utils/utils";

const Game: React.FC = () => {
  const { state } = useGameContext();

  const playerPositions =
    state.game?.getPlayers().map((p) => p.getPosition()) ?? [];
  const colors =
    state.game?.getPlayers().map((p) => PLAYER_COLORS[p.getColor()][0]) ?? [];

  return (
    <div className="game-page">
      <div className="board-container">
        <Board playerPositions={playerPositions} colors={colors} />
      </div>
      <div className="side-panel">
        <PlayerPanel />
        <div className="dice-panel">
          <DicePanel />
        </div>
      </div>
    </div>
  );
};

export default Game;
