import propertyDeedsJson from "../data/propertyDeeds.json";
import stablesDeedsJson from "../data/stablesDeeds.json";
import utilitiesDeedsJson from "../data/utilityDeeds.json";

import type {
  Cell,
  ChanceCard,
  CommunityChestCard,
  DeedType,
  GameSettings,
  PropertyDeedTuple,
  StablesDeedTuple,
  UtilityDeedTuple,
} from "./types";
import { StablesDeed } from "../classes/concrete/stablesDeed";
import { UtilityDeed } from "../classes/concrete/utilityDeed";
import { PropertyDeed } from "../classes/concrete/propertyDeed";
import type { BasicDeed } from "../classes/abstract/basicDeed";

export const PLAYER_COLORS: { [key: number]: [string, string] } = {
  1: ["#FF0000", "Red"], // Red
  2: ["#00FF00", "Green"], // Green
  3: ["#0000FF", "Blue"], // Blue
  4: ["#FFFF00", "Yellow"], // Yellow
  5: ["#FFA500", "Orange"], // Orange
  6: ["#800080", "Purple"], // Purple
  7: ["#FFC0CB", "Pink"], // Pink
  8: ["#A52A2A", "Brown"], // Brown
  9: ["#808080", "Gray"], // Gray
  10: ["#000000", "Black"], // Black
};

export const PLAYER_ICONS: { [key: number]: [string, string] } = {
  1: ["src/assets/icons/player-icon1.png", "Skyrim"],
  2: ["src/assets/icons/player-icon2.png", "Oblivion"],
  3: ["src/assets/icons/player-icon3.png", "Morrowind"],
  4: ["src/assets/icons/player-icon4.png", "Daggerfall"],
};

export const REGIONS: string[] = [
  "Black Marsh",
  "Cyrodiil",
  "South Skyrim",
  "North Skyrim",
  "High Rock",
  "Morrowind",
  "Hammerfell",
  "Summerset Isles",
];

const propertyDeedData = propertyDeedsJson.propertyDeeds as PropertyDeedTuple[];
const stableDeedData = stablesDeedsJson.stablesDeeds as StablesDeedTuple[];
const utilityDeedData = utilitiesDeedsJson.utilitiesDeeds as UtilityDeedTuple[];

export const DEFAULT_SETTINGS: GameSettings = {
  type: "Last Player Standing",
};

export const DEFAULT_PLAYER_NAME: string = "USER";

export const DEFAULT_PLAYER_COLOR: number = 1;

export const DEFAULT_PLAYER_ICON: number = 1;

export const PROPERTY_DEEDS: PropertyDeed[] = propertyDeedData.map(
  ([position, region, name, cost, rents, houseCost, castleCost, mortgage]) =>
    new PropertyDeed(
      position,
      region,
      name,
      cost,
      rents,
      houseCost,
      castleCost,
      mortgage
    )
);

export const STABLES_DEEDS: StablesDeed[] = stableDeedData.map(
  ([position, name]) => new StablesDeed(position, name)
);

export const UTILITIES_DEEDS: UtilityDeed[] = utilityDeedData.map(
  ([position, name]) => new UtilityDeed(position, name)
);

export const ALL_DEEDS: BasicDeed<DeedType>[] = [
  ...PROPERTY_DEEDS,
  ...STABLES_DEEDS,
  ...UTILITIES_DEEDS,
];

export const BOARD_ARRAY: Cell[] = [
  { cellType: "START", deed: null, id: 0 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[0], id: 1 },
  { cellType: "COMMUNITY", deed: null, id: 2 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[1], id: 3 },
  { cellType: "INCOME_TAX", deed: null, id: 4 },
  { cellType: "STABLES", deed: STABLES_DEEDS[0], id: 5 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[2], id: 6 },
  { cellType: "CHANCE", deed: null, id: 7 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[3], id: 8 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[4], id: 9 },
  { cellType: "JAIL", deed: null, id: 10 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[5], id: 11 },
  { cellType: "UTILITY", deed: UTILITIES_DEEDS[0], id: 12 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[6], id: 13 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[7], id: 14 },
  { cellType: "STABLES", deed: STABLES_DEEDS[1], id: 15 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[8], id: 16 },
  { cellType: "COMMUNITY", deed: null, id: 17 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[9], id: 18 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[10], id: 19 },
  { cellType: "LODGING", deed: null, id: 20 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[11], id: 21 },
  { cellType: "CHANCE", deed: null, id: 22 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[12], id: 23 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[13], id: 24 },
  { cellType: "STABLES", deed: STABLES_DEEDS[2], id: 25 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[14], id: 26 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[15], id: 27 },
  { cellType: "UTILITY", deed: UTILITIES_DEEDS[1], id: 28 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[16], id: 29 },
  { cellType: "GO_TO_JAIL", deed: null, id: 30 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[17], id: 31 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[18], id: 32 },
  { cellType: "CHANCE", deed: null, id: 33 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[19], id: 34 },
  { cellType: "STABLES", deed: STABLES_DEEDS[3], id: 35 },
  { cellType: "CHANCE", deed: null, id: 36 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[20], id: 37 },
  { cellType: "LUXURY_TAX", deed: null, id: 38 },
  { cellType: "PROPERTY", deed: PROPERTY_DEEDS[21], id: 39 },
];

export const TOTAL_DEEDS: number =
  PROPERTY_DEEDS.length + STABLES_DEEDS.length + UTILITIES_DEEDS.length;

export const GET_OUT_OF_JAIL_FREE_CARDS_COUNT: number = 3;
export const MAX_PLAYER_COUNT: number = 4;
export const VALID_GAME_DURATIONS: number[] = [45]; //TODO: Check with the game creating page component to confirm
export const BOARD_SIZE: number = BOARD_ARRAY.length;
export const MAX_JAIL_TURNS = 3;
