import React from "react";
import { useGameContext } from "../../../../context/GameContext";

const ScorePanel: React.FC = () => {
  const { state, loaded } = useGameContext();

  return (
    <div className="score-panel">
      {loaded && state.game && (
        <h2>
          Dice One: {state.game.getDiceValue().diceOne} | Dice Two:{" "}
          {state.game.getDiceValue().diceTwo}
        </h2>
      )}
    </div>
  );
};

export default ScorePanel;
