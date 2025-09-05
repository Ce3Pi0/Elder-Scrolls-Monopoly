import type { GameState } from "../utils/interfaces";
import type { FlowType } from "../utils/types";

export const gameReducer = (
  state: GameState,
  flowType: FlowType
): GameState => {
  switch (flowType) {
    case "GAME":
      state.game.handleGameFlow();
      break;
    case "AWAIT":
      state.game.handleAwaitFlow();
      break;
    case "ACTION":
      state.game.handleAction();
  }

  return state;
};
