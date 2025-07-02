import React, { useEffect, useState } from "react";
import { useGameContext } from "../../../../context/GameContext";

const RollButton: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const [hasRolled, setHasRolled] = useState(false);

  const diceRolled = state.game?.getDiceRolled();

  const handleRoll = async () => {
    // FIXME: Remove this if clause after testing
    if (diceRolled) {
      dispatch({ type: "RESET_DICE" });
      dispatch({
        type: "MOVE_PLAYER",
        payload: 0,
      });
      return;
    }

    dispatch({ type: "ROLL_DICE" });
    setHasRolled(true);

    //Arbitrary delay
    await setTimeout(() => {}, 1000);

    //TODO: Add cell action
  };

  useEffect(() => {
    if (!hasRolled) return;

    const diceOne = state.game?.getDiceValue().diceOne;
    const diceTwo = state.game?.getDiceValue().diceTwo;

    if (diceOne != null && diceTwo != null) {
      const total = diceOne + diceTwo;

      dispatch({
        type: "MOVE_PLAYER",
        payload: total,
      });

      setHasRolled(false);
    }
  }, [state.game?.getDiceValue(), hasRolled, dispatch]);

  return (
    // FIXME: Change disabled after testing
    <button className="roll-button" onClick={handleRoll} disabled={false}>
      <h2>Roll</h2>
    </button>
  );
};

export default RollButton;
