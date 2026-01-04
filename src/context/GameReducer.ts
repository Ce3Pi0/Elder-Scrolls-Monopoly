import type { GameState } from "../utils/interfaces";
import type { GameAction } from "../utils/types";

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.flowType) {
    case "GAME":
      state.game.handleGameFlow();
      return { ...state };
    case "AWAIT":
      state.game.handleAwaitFlow();
      return { ...state };
    case "ACTION":
      state.game.handleAction(action.actionData);
      return { ...state };
    case "GAME_SETUP":
      return { ...state, game: action.actionData.game };
    case "START_GAME":
      state.game.startGame();
      return { ...state };
    case "ADD_PLAYER":
      state.game.addPlayer(action.actionData.player);
      return { ...state };
    case "REMOVE_PLAYER":
      state.game.removePlayerById(action.actionData.playerId);
      return { ...state };
    case "UPDATE_DISPLAY":
      return {
        ...state,
      };
    default:
      return state;
  }
};
