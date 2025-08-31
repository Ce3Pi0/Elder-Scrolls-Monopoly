import React from "react";
import { useGameContext } from "../../../../context/GameContext";
import DeedHeader from "./deedHeader";
import type {
  DeedModalContent,
  ModalContent,
} from "../../../../interfaces/interfaces";
import Deeds from "./deeds";
import TradeButton from "./tradeButton";

const DeedModal: React.FC = () => {
  const { state } = useGameContext();

  if (!state.game?.isModalOpen()) return null;

  const modalContent: ModalContent | null = state.game?.getModalContent();

  return (
    <div className="modal">
      {modalContent?.content && modalContent.title === "deed" && (
        <DeedHeader
          icon={(modalContent.content as DeedModalContent).player.icon}
          name={(modalContent.content as DeedModalContent).player.name}
          balance={(modalContent.content as DeedModalContent).player.balance}
          getOutOfJailFreeCardsCount={
            (modalContent.content as DeedModalContent)
              .getOutOfJailFreeCardsCount
          }
        />
      )}
      {modalContent?.content && modalContent.title === "deed" && (
        <Deeds
          propertyDeeds={
            (modalContent?.content as DeedModalContent).deeds.propertyDeeds
          }
          stablesDeeds={
            (modalContent?.content as DeedModalContent).deeds.stablesDeeds
          }
          utilityDeeds={
            (modalContent?.content as DeedModalContent).deeds.utilityDeeds
          }
        />
      )}
      {state.game?.getCurrentPlayer().getName() ===
        (modalContent!.content as DeedModalContent).player.name &&
        modalContent.title === "deed" && (
          <div className="trade-button-wrapper">
            <TradeButton
              playerId={state.game
                .getPlayers()
                .filter(
                  (player) =>
                    player.getName() ===
                    (modalContent.content as DeedModalContent).player.name
                )[0]
                .getId()}
            />
          </div>
        )}
    </div>
  );
};

export default DeedModal;
