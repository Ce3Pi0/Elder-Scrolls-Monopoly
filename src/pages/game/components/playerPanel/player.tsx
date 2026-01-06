import React, { useEffect } from "react";
import type { GamePlayerData } from "../../../../utils/interfaces";
import PlayerInfo from "./playerInfo";
import { useGameContext } from "../../../../context/GameContext";
import DeedModal from "../../modals/deedModal/deedModal";
import ExitButton from "../../modals/deedModal/exitButton";
import TradeModal from "../../modals/tradeModal/tradeModal";
import { PLAYER_COLORS, PLAYER_ICONS } from "../../../../utils/constants";

const Player: React.FC<GamePlayerData> = ({
  id,
  color,
  name,
  icon,
  balance,
}) => {
  const colorCode = PLAYER_COLORS[color];
  const iconCode = PLAYER_ICONS[icon];

  const { state, dispatch } = useGameContext();

  const isModalOpen = state.game?.isModalOpen();

  useEffect(() => {
    if (isModalOpen) {
      const dialog: HTMLDialogElement = document.getElementById(
        "dialog"
      ) as HTMLDialogElement;

      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
        }
      });

      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          event.preventDefault();
        }
      });

      dialog.showModal();
    }
  }, [isModalOpen, state.game?.getModalContent()]);

  const openModal = (): void => {
    dispatch({
      flowType: "ACTION",
      actionData: {
        tradePlayerId: null,
        actionType: "OPEN_DEED_MODAL",
      },
    });
  };
  return (
    <>
      <dialog id="dialog">
        {state.game?.isModalOpen() && (
          <>
            {state.game?.getModalContent().title !== "AUCTION" &&
              state.game?.getModalContent().title !== "INCOME_TAX" && (
                <ExitButton />
              )}
            {state.game?.getModalContent() &&
              state.game.getModalContent().title === "DEED" && <DeedModal />}
            {state.game?.getModalContent() &&
              state.game.getModalContent().title === "TRADE" && <TradeModal />}
            {/*
              state.game.getModalContent().title === "deedModalExpanded" && (
              <DeedModalExpanded />
             */}
            {/* { state.game?.getModalContent().title === "auction" && <AuctionModal />} */}
            {/* TODO: Create all modals and modal logic here */}
          </>
        )}
      </dialog>

      <div key={id} className="player-element">
        <div
          className="player-color"
          style={{ backgroundColor: colorCode[0] }}
        />
        <div
          className="game-player-icon"
          style={{
            width: "3rem",
            height: "3rem",
            marginLeft: "1rem",
            backgroundImage: `url(../../../../../${iconCode[0]})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "60%",
            backgroundPosition: "center",
          }}
        />
        <PlayerInfo name={name} balance={balance} />
        <div className="deed-icon" onClick={() => openModal()}>
          <img src="src/assets/icons/deedIcon.png" />
        </div>
      </div>
    </>
  );
};

export default Player;
