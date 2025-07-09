import React from "react";
import { useGameContext } from "../../../../context/GameContext";

const ExitButton: React.FC = () => {
  const { dispatch } = useGameContext();
  const handleModalClose = () => {
    const dialog: HTMLDialogElement = document.getElementById(
      "dialog"
    ) as HTMLDialogElement;
    dialog.close();
    dispatch({ type: "CLOSE_MODAL" });
  };

  return (
    <div className="modal-exit-button" onClick={() => handleModalClose()}>
      Exit Button
    </div>
  );
};

export default ExitButton;
