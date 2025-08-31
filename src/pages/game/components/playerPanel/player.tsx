import React, { useEffect } from "react";
import type { GamePlayerData } from "../../../../interfaces/interfaces";
import {
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
  PLAYER_COLORS,
  PLAYER_ICONS,
} from "../../../../utils/utils";
import PlayerInfo from "./playerInfo";
import { useGameContext } from "../../../../context/GameContext";
import DeedModal from "../../modals/deedModal/deedModal";
import ExitButton from "../../modals/deedModal/exitButton";
import TradeModal from "../../modals/tradeModal/tradeModal";

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
  }, [isModalOpen]);

  const openModal = (): void => {
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
    dispatch({ type: "OPEN_MODAL", payload: null });
  };
  return (
    <>
      <dialog id="dialog">
        {state.game?.isModalOpen() && (
          <>
            {state.game?.getModalContent().title !== "auction" && (
              <ExitButton />
            )}
            {state.game?.getModalContent() &&
              state.game.getModalContent().title === "deed" && <DeedModal />}
            {state.game?.getModalContent() &&
              state.game.getModalContent().title === "trade" && <TradeModal />}
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
