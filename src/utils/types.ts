import type { BasicDeed, Game, Player, PropertyDeed } from "../classes/classes";
import type { Cell, ModalContent, PlayerData } from "../interfaces/interfaces";

export type GameFlowEventType =
  | "DECIDE_ORDER"
  | "ROLL_DICE"
  | "MOVE_PLAYER"
  | "CELL_ACTION"
  | "END_TURN";

export type MiscEventType = "IN_JAIL" | "PLAYER_OUT" | "DOUBLES";
export type EventType = GameFlowEventType | MiscEventType;

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

export type GameAction =
  //FIXME: TESTING ONLY
  | { type: "TESTING"; payload: null }
  | { type: "GAME_SETUP"; payload: Game }
  | { type: "START_GAME"; payload: Cell[] }
  | { type: "DECIDE_ORDER"; payload: Player[] }
  | { type: "ROLL_DICE"; payload: EventType }
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
  | { type: "BUY_DEED"; payload: { deed: BasicDeed; playerId: number } }
  | { type: "REMOVE_DEED"; payload: { deed: BasicDeed; playerId: number } }
  | { type: "MORTGAGE_DEED"; payload: { deed: BasicDeed; playerId: number } }
  | { type: "UNMORTGAGE_DEED"; payload: { deed: BasicDeed; playerId: number } }
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

export type OtherDeedTuple = [number, string];
