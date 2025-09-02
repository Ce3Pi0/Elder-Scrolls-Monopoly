import type { BasicDeed } from "../classes/abstract/basicDeed";
import type { Game } from "../classes/concrete/game";
import type { Player } from "../classes/concrete/player";
import type { PropertyDeed } from "../classes/concrete/propertyDeed";
import type { ModalContent, PlayerData } from "./interfaces";

export type GameFlowEvent =
  | "DECIDE_ORDER"
  | "ROLL_DICE"
  | "MOVE_PLAYER"
  | "CELL_ACTION"
  | "END_TURN";

export type MiscEvent = "IN_JAIL" | "PLAYER_OUT" | "DOUBLES";

export type Event = GameFlowEvent | MiscEvent;

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

export type GameAction =
  //FIXME: TESTING ONLY
  | { type: "TESTING"; payload: null }
  | { type: "GAME_SETUP"; payload: Game }
  | { type: "START_GAME"; payload: Cell[] }
  | { type: "DECIDE_ORDER"; payload: Player[] }
  | { type: "ROLL_DICE"; payload: Event }
  | { type: "RESET_DICE"; payload: null }
  | { type: "MOVE_PLAYER"; payload: number }
  | { type: "CELL_ACTION"; payload: null }
  | { type: "PLAYER_OUT"; payload: number }
  | { type: "DOUBLES"; payload: null }
  | { type: "RESET_DOUBLES"; payload: null }
  | { type: "SEND_TO_JAIL"; payload: number }
  | { type: "END_TURN"; payload: Game }
  | { type: "END_GAME"; payload: null }
  | { type: "NEXT_PLAYER"; payload: null }
  | { type: "UPDATE_PLAYER_BALANCE"; payload: number }
  | { type: "OPEN_MODAL"; payload: null }
  | { type: "SET_MODAL_CONTENT"; payload: ModalContent | null }
  | { type: "CLOSE_MODAL"; payload: null }
  | { type: "DRAW_CHANCE_CARD"; payload: null }
  | { type: "DRAW_COMMUNITY_CHEST_CARD"; payload: null }
  | { type: "END_DRAW_CARD"; payload: null }
  | {
      type: "BUY_DEED";
      payload: { deed: BasicDeed<DeedType>; playerId: number };
    }
  | {
      type: "REMOVE_DEED";
      payload: { deed: BasicDeed<DeedType>; playerId: number };
    }
  | {
      type: "MORTGAGE_DEED";
      payload: { deed: BasicDeed<DeedType>; playerId: number };
    }
  | {
      type: "UNMORTGAGE_DEED";
      payload: { deed: BasicDeed<DeedType>; playerId: number };
    }
  | {
      type: "BUY_HOUSE";
      payload: { propertyDeed: PropertyDeed; playerId: number };
    }
  | {
      type: "BUY_CASTLE";
      payload: { propertyDeed: PropertyDeed; playerId: number };
    }
  | {
      type: "SELL_HOUSE";
      payload: { propertyDeed: PropertyDeed; playerId: number };
    }
  | {
      type: "SELL_CASTLE";
      payload: { propertyDeed: PropertyDeed; playerId: number };
    }
  | {
      type: "ADD_GET_OUT_OF_JAIL_CARD";
      payload: { playerId: number; amount: number; type: GetOutOfJailCardType };
    }
  | {
      type: "REMOVE_GET_OUT_OF_JAIL_CARD";
      payload: { playerId: number; amount: number };
    }
  | { type: "ADD_PLAYER"; payload: Player }
  | { type: "UPDATE_PLAYER"; payload: PlayerData }
  | { type: "REMOVE_PLAYER"; payload: Player }
  | { type: "UPDATE_JAIL_TURNS"; payload: null }
  | { type: "RELEASE_FROM_JAIL"; payload: null }
  | { type: "IN_JAIL"; payload: null };

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
  | { id: number; type: "GET_OUT_OF_JAIL_CARD"; content: string };

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
