import React from "react";
import { useGameContext } from "../../../../context/GameContext";
import type { Player } from "../../../../classes/classes";

const TradeButton: React.FC<{ playerId: number }> = ({ playerId }) => {
  const { state, dispatch } = useGameContext();

  const handleClick = () => {
    const player: Player = state.game?.getPlayerById(playerId);

    dispatch({
      type: "SET_MODAL_CONTENT",
      payload: {
        title: "trade",
        content: {
          player: player,
        },
      },
    });
  };

  return (
    <button className="trade-button" onClick={() => handleClick()}>
      Trade
    </button>
  );
};

export default TradeButton;
