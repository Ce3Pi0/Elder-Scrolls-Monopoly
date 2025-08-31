import { useGameContext } from "../../../../context/GameContext";
import {
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
} from "../../../../utils/utils";

const TradeModalHeader: React.FC = () => {
  const { state, dispatch } = useGameContext();

  const handleClick = () => {
    const id = (state.game?.getModalContent() as any).content.player.getId();
    const player = state.game?.getPlayerById(id);

    dispatch({
      type: "SET_MODAL_CONTENT",
      payload: {
        title: "deed",
        content: {
          player: {
            name: player?.getName(),
            icon: player?.getIcon(),
            balance: player?.getBalance(),
          },
          getOutOfJailFreeCards: player?.getGetOutOfJailCards().length || 0,
          deeds: {
            propertyDeeds:
              player?.getDeeds().filter((deed) => isPropertyDeed(deed)) || [],
            stablesDeeds:
              player?.getDeeds().filter((deed) => isStablesDeed(deed)) || [],
            utilityDeeds:
              player?.getDeeds().filter((deed) => isUtilityDeed(deed)) || [],
          },
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
