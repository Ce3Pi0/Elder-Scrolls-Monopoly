import { BasicDeed } from "../classes/abstract/basicDeed";
import { Game } from "../classes/concrete/game";
import { PropertyDeed } from "../classes/concrete/propertyDeed";
import { StablesDeed } from "../classes/concrete/stablesDeed";
import { UtilityDeed } from "../classes/concrete/utilityDeed";

import type {
  CellType,
  ChanceCard,
  CommunityChestCard,
  Direction,
} from "../utils/types";

interface DeedModalPlayerInfo {
  name: string;
  icon: number;
  balance: number;
}

interface DeedModalDeeds {
  propertyDeeds: PropertyDeed[];
  stablesDeeds: StablesDeed[];
  utilityDeeds: UtilityDeed[];
}

export interface DeedModalContent {
  player: DeedModalPlayerInfo;
  getOutOfJailFreeCardsCount: number;
  deeds: DeedModalDeeds;
}

export interface ModalContent {
  title:
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
  content: DeedModalContent | ChanceCard | CommunityChestCard | null;
  //TODO: Add other modal content types
}

export interface DeedHeaderProps {
  icon: number;
  name: string;
  balance: number;
  getOutOfJailFreeCardsCount: number;
}

export interface ModalPlayerInfoProps {
  icon: number;
  name: string;
  balance: number;
}

export interface DeedsProps {
  propertyDeeds: PropertyDeed[];
  stablesDeeds: StablesDeed[];
  utilityDeeds: UtilityDeed[];
}

export interface PlayerInfoProps {
  name: string;
  balance: number;
}

export interface CellProps {
  playerPositions: number[];
  tileIndex: number;
  colors: string[];
}

export interface PlayerDotsProps {
  tileIndex: number;
  playerPositions: number[];
  colors: string[];
}

export interface HeaderProps {
  title: string;
}

export interface PropertyCellProps extends CellProps {
  id: number;
  city: string;
  region: string;
  name: string;
  price: number;
  direction?: Direction;
}

export interface UtilityCellProps extends CellProps {
  id: number;
  utility: string;
  type: string;
  name: string;
}

export interface StableCellProps extends CellProps {
  id: number;
  name: string;
}

export interface Cell {
  id: number;
  actionType: CellType;
  deed: PropertyDeed | UtilityDeed | StablesDeed | BasicDeed | null;
}

export interface IGame {
  type: "Timed" | "Last Player Standing";
  duration?: number; // in seconds, only for "Timed" type
}

export interface Pair {
  diceOne: number;
  diceTwo: number;
}

export interface NumberOfPlayersSectionProps {
  playerCount: number;
  setPlayerCount: (count: number) => void;
}

export interface PlayerSectionProps {
  playerCount: number;
}

export interface GameState {
  game: Game | undefined | null;
}

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<any>;
  loaded: boolean;
}

export interface PlayerProps {
  id: number;
  name: string;
  color: number;
  icon: number;
  usedData: {
    colors: number[];
    icons: number[];
  };
}

export interface PlayerData {
  id: number;
  name: string;
  color: number;
  icon: number;
}

export interface GamePlayerData {
  id: number;
  name: string;
  color: number;
  icon: number;
  balance: number;
}
