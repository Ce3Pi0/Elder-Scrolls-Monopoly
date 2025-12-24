import { useGameContext } from "../../../../context/GameContext";
import type { TradeModalContent } from "../../../../utils/interfaces";

const TradeModalHeader: React.FC = () => {
  const { state, dispatch } = useGameContext();

  const handleClick = () => {
    const tradePlayerId: number = (
      state.game?.getModalContent().content as TradeModalContent
    ).tradePlayer.getId();

    dispatch({
      state: state,
      action: {
        flowType: "ACTION",
        actionData: {
          tradePlayerId: tradePlayerId,
          actionType: "OPEN_TRADE_MODAL",
          otherDeedType: null,
          mortgageDeedId: null,
          assetType: null,
        },
      },
    });
  };
  return (
    <div className="trade-modal-header-wrapper">
      <div className="trade-modal-header">
        <div className="back-icon">
          <img
            src="src/assets/icons/backIcon.png"
            onClick={() => {
              handleClick();
            }}
          />
        </div>
        <h1>Trade</h1>
      </div>
    </div>
  );
};

export default TradeModalHeader;
