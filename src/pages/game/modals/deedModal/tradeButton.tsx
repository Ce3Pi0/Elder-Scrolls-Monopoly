import React from "react";
import { useGameContext } from "../../../../context/GameContext";

const TradeButton: React.FC<{ playerId: number }> = ({ playerId }) => {
  const { state, dispatch } = useGameContext();

  const handleClick = () => {
    dispatch({
      state: state,
      action: {
        flowType: "ACTION",
        actionData: {
          tradePlayerId: playerId,
          actionType: "OPEN_TRADE_MODAL",
          otherDeedType: null,
          mortgageDeedId: null,
          assetType: null,
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
