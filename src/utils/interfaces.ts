import { Game } from "../classes/concrete/game";
import { PropertyDeed } from "../classes/concrete/propertyDeed";
import { StablesDeed } from "../classes/concrete/stablesDeed";
import { UtilityDeed } from "../classes/concrete/utilityDeed";

import type {
  ChanceCard,
  CommunityChestCard,
  DeedType,
  Direction,
  Event,
  GameSettings,
  GetOutOfJailCardType,
  ModalType,
  Pair,
} from "./types";

//DEED MODAL
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

//TODO: Add other modal content types
export interface ModalContent {
  title: ModalType;
  content: DeedModalContent | ChanceCard | CommunityChestCard | null;
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
export interface PlayerDotsProps {
  tileIndex: number;
  playerPositions: number[];
  colors: string[];
}
export interface HeaderProps {
  title: string;
}
export interface CellProps {
  playerPositions: number[];
  tileIndex: number;
  colors: string[];
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

export interface SerializedDeed {
  id: number;
  ownerId: number;
  mortgaged: boolean;
  type: DeedType;
}

export interface SerializedPropertyDeed extends SerializedDeed {
  numberOfHouses: number;
  numberOfCastles: number;
}

export interface SerializedPlayer {
  id: number;
  name: string;
  color: number;
  icon: number;
  balance: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  deeds: number[];
  getOutOfJailFreeCards: GetOutOfJailCardType[];
  bankrupt: boolean;
}

export interface SerializedGame {
  playerIds: number[];
  gameSettings: GameSettings;
  gameStarted: boolean;
  gameEnded: boolean;
  event: Event | null;
  currentPlayerIndex: number;
  modalOpen: boolean;
  modalContent: ModalContent | null;
  pendingDrawCard: boolean;
}

export interface SerializedDice {
  diceRolled: boolean;
  diceValues: Pair;
  doublesCounter: number;
}
