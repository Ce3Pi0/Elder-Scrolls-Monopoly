import type { GameAction } from "../utils/utils";
import type { GameState } from "../interfaces/interfaces";

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

    //TODO: RESET DICE

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

    //TODO: OPEN MODAL
    //TODO: SET MODAL CONTENT
    //TODO: CLOSE MODAL
    //TODO: DRAW CARD
    //TODO: END DRAW CARD
    //TODO: BUY PROPERTY
    //TODO: BUY DEED
    //TODO: REMOVE DEED
    //TODO: MORTGAGE DEED
    //TODO: UNMORTGAGE DEED
    //TODO: BUY HOUSE
    //TODO: BUY CASTLE
    //TODO: SELL HOUSE
    //TODO: SELL CASTLE
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
