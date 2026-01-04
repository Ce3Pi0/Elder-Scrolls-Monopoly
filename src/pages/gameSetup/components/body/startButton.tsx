import React from "react";
import { useNavigate } from "react-router";
import { useGameContext } from "../../../../context/GameContext";

const StartButton: React.FC = () => {
  const { dispatch } = useGameContext();
  const navigate = useNavigate();

  const handleStartGame = () => {
    dispatch({
      flowType: "START_GAME",
    });
    navigate("/game");
  };

  return (
    <div className="start-button">
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default StartButton;
