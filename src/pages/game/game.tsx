import Board from "./components/board/board";
import PlayerPanel from "./components/playerPanel/playerPanel";
import DicePanel from "./components/dicePanel/dicePanel";

import { useGameContext } from "../../context/GameContext";

import "./css/styles.css";
import { PLAYER_COLORS } from "../../utils/utils";

const Game: React.FC = () => {
  const { state, loaded } = useGameContext();

  const playerPositions =
    state.game?.getPlayers().map((p) => p.getPosition()) ?? [];
  const colors =
    state.game?.getPlayers().map((p) => PLAYER_COLORS[p.getColor()][0]) ?? [];

  if (!loaded) return <div>Loading game...</div>;
  if (!state.game?.isGameStarted()) location.href = "/game-setup";
  if (!state.game) return <div>Failed to Fetch</div>;

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
