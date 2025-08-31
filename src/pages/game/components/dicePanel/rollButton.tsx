import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../../context/GameContext";
import type { Pair } from "../../../../interfaces/interfaces";

const RollButton: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const [hasRolled, setHasRolled] = useState(false);

  const dice: Pair | undefined = state.game?.getDiceValue();
  const diceOne: number | undefined = 1; //dice?.diceOne;
  const diceTwo: number | undefined = 0; //dice?.diceTwo;

  const handleRoll = async () => {
    // TODO: Create order deciding logic
    if (state.game?.getEvent() === "decideOrder") dispatch({ type: "TESTING" });

    if (state.game?.getEvent() === "rollDice") {
      dispatch({
        type: "ROLL_DICE",
        payload: state.game?.getCurrentPlayer().isInJail()
          ? "inJail"
          : "movePlayer",
      });
      setHasRolled(true);
    }
  };

  //Move player logic
  useEffect(() => {
    if (!hasRolled) return;

    if (state.game?.getCurrentPlayer().isInJail()) {
      dispatch({ type: "IN_JAIL" });
      setHasRolled(false);
      return;
    }

    if (
      diceOne != null &&
      diceTwo != null &&
      state.game?.getEvent() === "movePlayer"
    ) {
      if (diceOne === diceTwo) {
        dispatch({ type: "DOUBLES" });
      }
      if (state.game?.getDoublesCounter() === 3) {
        dispatch({ type: "SEND_TO_JAIL" });
        return;
      }

      setHasRolled(false);
    }
  }, [hasRolled, diceOne, diceTwo]);

  //Cell action logic
  useEffect(() => {
    switch (state.game?.getEvent()) {
      case "cellAction":
        dispatch({ type: "CELL_ACTION" });
        break;
      case "inJail":
        dispatch({ type: "IN_JAIL" });
        break;
      case "movePlayer":
        if (diceOne != null && diceTwo != null) {
          dispatch({ type: "MOVE_PLAYER", payload: diceOne + diceTwo });
        }
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
  }, [state.game?.getEvent()]);

  return (
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
