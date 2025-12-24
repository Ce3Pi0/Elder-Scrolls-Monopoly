import React, { useEffect } from "react";
import { useGameContext } from "../../../../context/GameContext";
import type { Pair } from "../../../../utils/types";

const RollButton: React.FC = () => {
  const { state, dispatch } = useGameContext();

  const dice: Pair | undefined = {
    diceOne: state.game?.getDiceValue()[0],
    diceTwo: state.game?.getDiceValue()[1],
  };
  const diceOne: number | undefined = 1; //dice?.diceOne;
  const diceTwo: number | undefined = 0; //dice?.diceTwo;

  const handleRoll = async () => {
    dispatch({
      state: state,
      action: {
        flowType: "AWAIT",
      },
    });
    // TODO: Create order deciding logic
  };

  useEffect(() => {
    dispatch({
      state: state,
      action: {
        flowType: "GAME",
      },
    });
  }, [state.game?.getEvent()]);

  return (
    <button
      id="roll-button"
      className="roll-button"
      onClick={handleRoll}
      disabled={
        state.game?.getEvent() !== "ROLL_DICE" &&
        state.game?.getEvent() !== "DECIDE_ORDER"
      }
    >
      <h2>Roll</h2>
    </button>
  );
};

export default RollButton;
