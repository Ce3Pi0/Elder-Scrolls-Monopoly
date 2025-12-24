import type { GameState } from "../utils/interfaces";
import type { GameAction } from "../utils/types";

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.flowType) {
    // Called on useEffect
    case "GAME":
      state.game.handleGameFlow();
      break;
    // Called on game flow button press
    case "AWAIT":
      state.game.handleAwaitFlow();
      break;
    // Called on specific button press
    case "ACTION":
      state.game.handleAction(action.actionData);
  }

  return state;
};
