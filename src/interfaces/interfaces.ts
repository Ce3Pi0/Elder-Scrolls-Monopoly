import type {
  BasicDeed,
  Game,
  PropertyDeed,
  UtilityDeed,
  StablesDeed,
} from "../classes/classes";
import type { CellType } from "../utils/utils";

export interface ModalContent {
  title: string;
  content: object;
}

export interface HeaderProps {
  title: string;
}

export interface Cell {
  id: number;
  actionType: CellType;
  deed: PropertyDeed | UtilityDeed | StablesDeed | BasicDeed | null;
}

export interface GameType {
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
