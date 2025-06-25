import type { GameAction } from "../utils/utils";
import type { GameState } from "../interfaces/interfaces";
import type { BasicDeed, Player, PropertyDeed } from "../classes/classes";

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "GAME_SETUP":
      return { ...state, game: action.payload };

    case "START_GAME": {
      const newGame = state.game?.clone();
      newGame?.startGame(action.payload);
      return { ...state, game: newGame };
    }

    case "DECIDE_ORDER": {
      const newGame = state.game?.clone();
      newGame?.changePlayerOrder(action.payload);
      return { ...state, game: newGame };
    }

    case "ROLL_DICE": {
      const newGame = state.game?.clone();
      newGame?.rollDice();
      return { ...state, game: newGame };
    }

    case "RESET_DICE": {
      const newGame = state.game?.clone();
      newGame?.resetDice();
      return { ...state, game: newGame };
    }

    case "MOVE_PLAYER": {
      const newGame = state.game?.clone();
      newGame?.getCurrentPlayer().setPosition(action.payload);
      return { ...state, game: newGame };
    }

    case "CELL_ACTION": {
      const newGame = state.game?.clone();
      newGame?.handleCellAction();
      return { ...state, game: newGame };
    }

    case "PLAYER_OUT": {
      const newGame = state.game?.clone();
      newGame?.getPlayerById(action.payload)?.declareBankruptcy();
      return { ...state, game: newGame };
    }

    case "DOUBLES": {
      const newGame = state.game?.clone();
      newGame?.setDoublesCounter(newGame.getDoublesCounter() + 1);
      return { ...state, game: newGame };
    }

    case "RESET_DOUBLES": {
      const newGame = state.game?.clone();
      newGame?.setDoublesCounter(0);
      return { ...state, game: newGame };
    }

    case "SEND_TO_JAIL": {
      const newGame = state.game?.clone();
      newGame?.getPlayerById(action.payload)?.goToJail();
      return { ...state, game: newGame };
    }

    case "END_TURN": {
      const newGame = state.game?.clone();
      newGame?.nextPlayer();
      newGame?.resetDice();
      return { ...state, game: newGame };
    }

    case "END_GAME": {
      const newGame = state.game?.clone();
      newGame?.endGame();
      return { ...state, game: newGame };
    }

    case "NEXT_PLAYER": {
      const newGame = state.game?.clone();
      newGame?.nextPlayer();
      return { ...state, game: newGame };
    }

    case "UPDATE_PLAYER_BALANCE": {
      const newGame = state.game?.clone();
      newGame?.getCurrentPlayer().addBalance(action.payload);
      return { ...state, game: newGame };
    }

    case "OPEN_MODAL": {
      const newGame = state.game?.clone();
      newGame?.setModalOpen(true);
      return { ...state, game: newGame };
    }

    case "SET_MODAL_CONTENT": {
      //TODO: Add more clarity to the types accepted as modal content objects (create a type for it)
      const newGame = state.game?.clone();
      newGame?.setModalContent(action.payload);
      return { ...state, game: newGame };
    }

    case "CLOSE_MODAL": {
      const newGame = state.game?.clone();
      newGame?.setModalOpen(false);
      return { ...state, game: newGame };
    }

    //TODO: DRAW CARD
    //TODO: END DRAW CARD

    case "BUY_DEED": {
      const newGame = state.game?.clone();
      if (
        newGame
          ?.getPlayerById(action.payload.playerId)
          ?.canAfford(action.payload.deed.getPrice()) &&
        action.payload.deed.getOwner() === null
      ) {
        newGame
          ?.getPlayerById(action.payload.playerId)
          ?.addDeed(action.payload.deed);
      } else if (
        newGame
          ?.getPlayerById(action.payload.playerId)
          ?.canAfford(action.payload.deed.getPrice())
      ) {
        throw new Error("Player does not have enough money to buy the deed.");
      } else {
        throw new Error(
          `Property already owned by playerId: ${action.payload.deed
            .getOwner()
            ?.getId()}`
        );
      }
      return { ...state, game: newGame };
    }

    case "REMOVE_DEED": {
      const newGame = state.game?.clone();
      const player = newGame?.getPlayerById(action.payload.playerId);

      if (action.payload.deed.getOwner()?.getId() === player?.getId()) {
        player?.removeDeed(action.payload.deed);
      }

      return { ...state, game: newGame };
    }

    case "MORTGAGE_DEED": {
      const newGame = state.game?.clone();
      const curPlayer: Player | undefined = newGame?.getPlayerById(
        action.payload.playerId
      );
      const deed: BasicDeed = action.payload.deed;

      if (curPlayer?.getId() === deed.getOwner()?.getId()) {
        deed.mortgage();
      }

      return { ...state, game: newGame };
    }

    case "UNMORTGAGE_DEED": {
      const newGame = state.game?.clone();
      const player: Player | undefined = newGame?.getPlayerById(
        action.payload.playerId
      );
      const deed: BasicDeed = action.payload.deed;

      if (player?.getId() === deed.getOwner()?.getId()) {
        deed.unmortgage();
      }
      return { ...state, game: newGame };
    }

    case "BUY_HOUSE": {
      const newGame = state.game?.clone();

      const deed: PropertyDeed = action.payload.propertyDeed;

      if (deed.getOwner()?.getId() === action.payload.playerId) {
        deed.buildHouse();
      } else {
        throw new Error("Player doesn't own the deed.");
      }

      return { ...state, game: newGame };
    }

    case "BUY_CASTLE": {
      const newGame = state.game?.clone();

      const deed: PropertyDeed = action.payload.propertyDeed;

      if (deed.getOwner()?.getId() === action.payload.playerId) {
        deed.buildCastle();
      } else {
        throw new Error("Player doesn't own the deed.");
      }

      return { ...state, game: newGame };
    }

    case "SELL_HOUSE": {
      const newGame = state.game?.clone();
      const deed: PropertyDeed = action.payload.propertyDeed;

      if (deed.getOwner()?.getId() === action.payload.playerId) {
        deed.sellHouse();
      } else {
        throw new Error("Player doesn't own the deed.");
      }

      return { ...state, game: newGame };
    }

    case "SELL_CASTLE": {
      const newGame = state.game?.clone();
      const deed: PropertyDeed = action.payload.propertyDeed;

      if (deed.getOwner()?.getId() === action.payload.playerId) {
        deed.sellCastle();
      } else {
        throw new Error("Player doesn't own the deed.");
      }

      return { ...state, game: newGame };
    }

    //TODO: ADD_GET_OUT_OF_JAIL_CARD
    //TODO: REMOVE_GET_OUT_OF_JAIL_CARD

    case "ADD_PLAYER": {
      const newGame = state.game?.clone();
      newGame?.addPlayer(action.payload);
      return { ...state, game: newGame };
    }

    case "UPDATE_PLAYER": {
      const newGame = state.game?.clone();
      newGame?.updatePlayer(action.payload);
      return { ...state, game: newGame };
    }

    case "REMOVE_PLAYER": {
      const newGame = state.game?.clone();
      newGame?.removePlayer(action.payload);
      return { ...state, game: newGame };
    }

    default:
      return state;
  }
};
