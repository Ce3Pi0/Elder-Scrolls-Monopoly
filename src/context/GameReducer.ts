import type { ActionData, GameState } from "../utils/interfaces";
import type { FlowType } from "../utils/types";

export const gameReducer = (
  state: GameState,
  flowType: FlowType,
  actionData: ActionData
): GameState => {
  switch (flowType) {
    case "GAME":
      state.game.handleGameFlow();
      break;
    case "AWAIT":
      state.game.handleAwaitFlow();
      break;
    case "ACTION":
      state.game.handleAction(actionData);
  }

  return state;
};
