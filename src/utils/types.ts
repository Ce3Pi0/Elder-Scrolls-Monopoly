import type { BasicDeed, Game, Player, PropertyDeed } from "../classes/classes";
import type { Cell, ModalContent, PlayerData } from "../interfaces/interfaces";

export type GetOutOfJailCardType = "chance" | "community";

export type Direction = "top" | "bottom" | "left" | "right";
export type CellType =
  | "start"
  | "property"
  | "stables"
  | "utility"
  | "chance"
  | "community"
  | "incomeTax"
  | "jail"
  | "lodging"
  | "goToJail"
  | "luxuryTax";

export type GameAction =
  | { type: "GAME_SETUP"; payload: Game }
  | { type: "START_GAME"; payload: Cell[] }
  | { type: "DECIDE_ORDER"; payload: Player[] }
  | { type: "ROLL_DICE"; payload: null }
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
  | { type: "REMOVE_PLAYER"; payload: Player };

export type ChanceCard =
  | { id: number; type: "move"; location: number | string; content: string }
  | { id: number; type: "pay" | "collect"; value: number; content: string }
  | {
      id: number;
      type: "variablePay";
      value: { house?: number; castle?: number; player?: number };
      content: string;
    }
  | { id: number; type: "getOutOfJailCard"; content: string };

export type CommunityChestCard =
  | { id: number; type: "move"; location: number | string; content: string }
  | { id: number; type: "pay" | "collect"; value: number; content: string }
  | {
      id: number;
      type: "variablePay";
      value: { house?: number; castle?: number; player?: number };
      content: string;
    }
  | { id: number; type: "getOutOfJailCard"; content: string };

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
