import { useGameContext } from "../../../../context/GameContext";

const NextPlayerButton: React.FC = () => {
  const { state, dispatch } = useGameContext();

  const handleClick = () => {
    dispatch({ type: "END_TURN" });
    const nextPlayerButton = document.getElementById(
      "next-player-button"
    ) as HTMLButtonElement;
    const rollButton = document.getElementById(
      "roll-button"
    ) as HTMLButtonElement;

    if (nextPlayerButton && rollButton) {
      nextPlayerButton.disabled = true;
      rollButton.disabled = false;
    }
  };

  return (
    <button
      id="next-player-button"
      className="roll-button"
      onClick={handleClick}
      disabled={state.game?.getEvent() !== "endTurn"}
    >
      <h2>End</h2>
    </button>
  );
};

export default NextPlayerButton;
