import React from "react";
import { useGameContext } from "../../../../context/GameContext";

const ExitButton: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const handleModalClose = () => {
    const dialog: HTMLDialogElement = document.getElementById(
      "dialog"
    ) as HTMLDialogElement;
    dialog.close();
    if (
      state.game.getModalContent().title === "CHANCE" ||
      state.game.getModalContent().title === "COMMUNITY"
    )
      dispatch({
        flowType: "ACTION",
        actionData: { actionType: "END_DRAW_CARD" },
      });
    else
      dispatch({
        flowType: "ACTION",
        actionData: { actionType: "CLOSE_MODAL" },
      });
  };

  return (
    <div className="modal-exit-button">
      <img
        onClick={() => handleModalClose()}
        src="src/assets/icons/closeButton.png"
        style={{
          width: "3rem",
          height: "3rem",
        }}
      />
    </div>
  );
};

export default ExitButton;
