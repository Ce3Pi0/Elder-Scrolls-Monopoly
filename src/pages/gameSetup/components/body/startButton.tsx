import { useGameContext } from "../../../../context/GameContext";

import type { Cell } from "../../../../interfaces/interfaces";

const StartButton: React.FC = () => {
  const { dispatch } = useGameContext();

  const handleStartGame = () => {
    const board: Cell[] = [];

    dispatch({ type: "START_GAME", payload: board });
  };

  return (
    <div className="start-button">
      <button onClick={() => handleStartGame()}>Start Game</button>
    </div>
  );
};

export default StartButton;
