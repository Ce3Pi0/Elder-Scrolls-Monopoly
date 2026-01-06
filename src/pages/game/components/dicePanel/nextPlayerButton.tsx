import React, { useEffect } from "react";
import { useGameContext } from "../../../../context/GameContext";

const NextPlayerButton: React.FC = () => {
  const { state, dispatch } = useGameContext();

  const currentEvent = state.game?.getEvent();
  const [isDisabled, setIsDisabled] = React.useState(
    currentEvent !== "AWAIT_END_TURN"
  );

  useEffect(() => {
    setIsDisabled(state.game?.getEvent() !== "AWAIT_END_TURN");
  }, [state.game?.getEvent()]);

  const handleClick = () => {
    dispatch({
      flowType: "AWAIT",
    });
  };

  return (
    <button
      id="next-player-button"
      className="roll-button"
      onClick={handleClick}
      disabled={isDisabled}
    >
      <h2>End</h2>
    </button>
  );
};

export default NextPlayerButton;
