import React, { useEffect } from "react";
import { useGameContext } from "../../../../context/GameContext";

const RollButton: React.FC = () => {
  const { state, dispatch } = useGameContext();

  const handleRoll = async () => {
    dispatch({
      flowType: "AWAIT",
    });
    // TODO: Create order deciding logic
  };

  useEffect(() => {
    const runGameLogic = async () => {
      const currentEvent = state.game?.getEvent();

      if (currentEvent === "ROLL_DICE") {
        dispatch({ flowType: "GAME" });
      } else if (currentEvent === "MOVE_PLAYER") {
        const lastRoll = state.game?.getDiceValue();
        const total = lastRoll[0] + lastRoll[1];

        await state.game?.moveCurrentPlayer(total, () => {
          dispatch({ flowType: "UPDATE_DISPLAY" });
        });

        dispatch({ flowType: "GAME" });
      } else if (
        currentEvent === "CELL_ACTION" ||
        currentEvent === "END_TURN"
      ) {
        dispatch({ flowType: "GAME" });
      }
    };

    runGameLogic();
  }, [state.game?.getEvent()]);

  return (
    <button
      id="roll-button"
      className="roll-button"
      onClick={handleRoll}
      disabled={
        state.game?.getEvent() !== "ROLL_DICE" &&
        state.game?.getEvent() !== "DECIDE_ORDER" &&
        state.game?.getEvent() !== "AWAIT_ROLL_DICE"
      }
    >
      <h2>Roll</h2>
    </button>
  );
};

export default RollButton;
