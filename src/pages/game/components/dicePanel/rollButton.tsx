import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../../context/GameContext";

const RollButton: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const [hasRolled, setHasRolled] = useState(false);

  const diceRolled = state.game?.getDiceRolled();

  console.log(state.game?.getEvent());

  const handleRoll = async () => {
    // FIXME: Remove this after testing
    if (state.game?.getEvent() === "decideOrder") dispatch({ type: "TESTING" });
    console.log(state.game?.getEvent());

    // FIXME: Remove this if clause after testing
    if (diceRolled) {
      dispatch({
        type: "MOVE_PLAYER",
        payload: 0,
      });
      dispatch({ type: "RESET_DICE" });
      return;
    }

    if (state.game?.getEvent() === "rollDice") {
      dispatch({ type: "ROLL_DICE" });
      setHasRolled(true);
    }
  };

  //Move player logic
  useEffect(() => {
    if (!hasRolled) return;

    // const diceOne = state.game?.getDiceValue().diceOne;
    // const diceTwo = state.game?.getDiceValue().diceTwo;

    const diceOne = 30;
    const diceTwo = 23;

    if (
      diceOne != null &&
      diceTwo != null &&
      state.game?.getEvent() === "movePlayer"
    ) {
      const total = diceOne + diceTwo;

      dispatch({
        type: "MOVE_PLAYER",
        payload: total,
      });

      setHasRolled(false);
    }
  }, [state.game?.getDiceValue(), hasRolled, dispatch]);

  //Cell action logic
  useEffect(() => {
    switch (state.game?.getEvent()) {
      case "cellAction":
        dispatch({ type: "CELL_ACTION" });
        break;
      case "endTurn":
        const nextPlayerButton = document.getElementById(
          "next-player-button"
        ) as HTMLButtonElement;
        if (nextPlayerButton) {
          nextPlayerButton.disabled = false;
        }
        break;
      default:
        break;
    }
  }, [state.game?.getEvent(), dispatch]);

  return (
    // FIXME: Change disabled after testing
    <button
      id="roll-button"
      className="roll-button"
      onClick={handleRoll}
      disabled={
        state.game?.getEvent() !== "rollDice" &&
        state.game?.getEvent() !== "decideOrder"
      }
    >
      <h2>Roll</h2>
    </button>
  );
};

export default RollButton;
