import type { BasicDeed } from "../classes/abstract/basicDeed";
import type { ActionData } from "./interfaces";

export type GameFlowEvent =
  | "DECIDE_ORDER"
  | "AWAIT_ROLL_DICE"
  | "ROLL_DICE"
  | "MOVE_PLAYER"
  | "CELL_ACTION"
  | "AWAIT_END_TURN"
  | "END_TURN";

export type GameAction = {
  flowType: FlowType;
  actionData: ActionData;
};

export type FlowType = "GAME" | "AWAIT" | "ACTION";

export type Event = GameFlowEvent;

export type GetOutOfJailCardType = "CHANCE" | "COMMUNITY";

export type Direction = "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
export type CellType =
  | "START"
  | "PROPERTY"
  | "STABLES"
  | "UTILITY"
  | "CHANCE"
  | "COMMUNITY"
  | "INCOME_TAX"
  | "JAIL"
  | "LODGING"
  | "GO_TO_JAIL"
  | "LUXURY_TAX";

export type Cell = {
  id: number;
  cellType: CellType;
  deed: BasicDeed<DeedType> | null;
};
export type Asset = "HOUSE" | "HOTEL";
//ModalCreator and ModalType are co-dependant
export type ModalType =
  | "CHANCE"
  | "COMMUNITY"
  | "DEED"
  | "DEED_PROPERTIES"
  | "DEED_OTHER"
  | "TRADE"
  | "AUCTION"
  | "SELL_DEED"
  | "SELL_DEED_PROPERTIES"
  | "SELL_DEED_OTHER"
  | "SELL_ASSETS"
  | "MORTGAGE"
  | "BANKRUPTCY"
  | "INCOME_TAX"
  | "LUXURY_TAX";

export type ActionType =
  | "OPEN_DEED_MODAL"
  | "OPEN_DEED_PROPERTIES_MODAL"
  | "OPEN_DEED_OTHER_MODAL"
  | "OPEN_TRADE_MODAL"
  | "OPEN_SELL_DEED_PROPERTIES_MODAL"
  | "OPEN_SELL_DEED_OTHER_MODAL"
  | "OPEN_SELL_DEED_ASSETS_MODAL"
  | "OPEN_MORTGAGE_MODAL"
  | "CLOSE_MODAL"
  | "END_DRAW_CARD";

export type OtherDeedType = "STABLES" | "UTILITIES";

export type ChanceCard =
  | { id: number; type: "MOVE"; location: number | string; content: string }
  | { id: number; type: "PAY" | "COLLECT"; value: number; content: string }
  | {
      id: number;
      type: "VARIABLE_PAY";
      value: { house?: number; castle?: number; player?: number };
      content: string;
    }
  | { id: number; type: "GET_OUT_OF_JAIL_CARD"; content: string };

export type CommunityChestCard =
  | { id: number; type: "MOVE"; location: number | string; content: string }
  | { id: number; type: "PAY" | "COLLECT"; value: number; content: string }
  | {
      id: number;
      type: "VARIABLE_PAY";
      value: { house?: number; castle?: number; player?: number };
      content: string;
    }
  | { id: number; type: "GET_OUT_OF_JAIL_CARD"; content: string }
  | {
      id: number;
      type: "VARIABLE_COLLECT";
      value: { player: number };
      content: string;
    };

export type PropertyDeedTuple = [
  number,
  string,
  string,
  number,
  number[],
  number,
  number,
  number
];

export type UtilityDeedTuple = [number, string];

export type StablesDeedTuple = [number, string];

export type Pair = {
  diceOne: number;
  diceTwo: number;
};
export type GameSettings = {
  type: "Timed" | "Last Player Standing";
  duration?: number; // in seconds, only for "Timed" type
};

export type DeedType = "STABLES" | "UTILITY" | "PROPERTY";

export type PlayerInfo = {
  id: number;
  name: string;
  color: number;
  icon: number;
  balance: number;
};
