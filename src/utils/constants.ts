import propertyDeedsJson from "../data/propertyDeeds.json";
import stablesDeedsJson from "../data/stablesDeeds.json";
import utilitiesDeedsJson from "../data/utilityDeeds.json";
import chanceCardsJson from "../data/chanceCards.json";
import communityChestCardsJson from "../data/communityChestCards.json";
import type { Cell } from "../interfaces/interfaces";
import type {
  ChanceCard,
  CommunityChestCard,
  OtherDeedTuple,
  PropertyDeedTuple,
} from "./types";
import { StablesDeed } from "../classes/concrete/stablesDeed";
import { UtilityDeed } from "../classes/concrete/utilityDeed";
import { PropertyDeed } from "../classes/concrete/propertyDeed";

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

export const CHANCE_CARDS: ChanceCard[] =
  chanceCardsJson.chanceCards as ChanceCard[];

export const COMMUNITY_CHEST_CARDS: ChanceCard[] =
  communityChestCardsJson.communityChestCards as CommunityChestCard[];

const propertyDeedData = propertyDeedsJson.propertyDeeds as PropertyDeedTuple[];
const stableDeedData = stablesDeedsJson.stablesDeeds as OtherDeedTuple[];
const utilityDeedData = utilitiesDeedsJson.utilitiesDeeds as OtherDeedTuple[];

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

export const BoardArray: Cell[] = [
  { actionType: "START", deed: null, id: 0 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[0], id: 1 },
  { actionType: "COMMUNITY", deed: null, id: 2 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[1], id: 3 },
  { actionType: "INCOME_TAX", deed: null, id: 4 },
  { actionType: "STABLES", deed: STABLES_DEEDS[0], id: 5 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[2], id: 6 },
  { actionType: "CHANCE", deed: null, id: 7 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[3], id: 8 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[4], id: 9 },
  { actionType: "JAIL", deed: null, id: 10 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[5], id: 11 },
  { actionType: "UTILITY", deed: UTILITIES_DEEDS[0], id: 12 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[6], id: 13 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[7], id: 14 },
  { actionType: "STABLES", deed: STABLES_DEEDS[1], id: 15 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[8], id: 16 },
  { actionType: "COMMUNITY", deed: null, id: 17 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[9], id: 18 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[10], id: 19 },
  { actionType: "LODGING", deed: null, id: 20 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[11], id: 21 },
  { actionType: "CHANCE", deed: null, id: 22 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[12], id: 23 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[13], id: 24 },
  { actionType: "STABLES", deed: STABLES_DEEDS[2], id: 25 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[14], id: 26 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[15], id: 27 },
  { actionType: "UTILITY", deed: UTILITIES_DEEDS[1], id: 28 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[16], id: 29 },
  { actionType: "GO_TO_JAIL", deed: null, id: 30 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[17], id: 31 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[18], id: 32 },
  { actionType: "CHANCE", deed: null, id: 33 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[19], id: 34 },
  { actionType: "STABLES", deed: STABLES_DEEDS[3], id: 35 },
  { actionType: "CHANCE", deed: null, id: 36 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[20], id: 37 },
  { actionType: "LUXURY_TAX", deed: null, id: 38 },
  { actionType: "PROPERTY", deed: PROPERTY_DEEDS[21], id: 39 },
];

export const TOTAL_DEEDS: number =
  PROPERTY_DEEDS.length + STABLES_DEEDS.length + UTILITIES_DEEDS.length;

export const GET_OUT_OF_JAIL_FREE_CARDS_COUNT: number = 3;
export const MAX_PLAYER_COUNT: number = 4;
export const VALID_GAME_DURATIONS: number[] = [45]; //TODO: Check with the game creating page component to confirm
export const BOARD_SIZE: number = BoardArray.length;
export const MAX_DICE_VALUE: number = 6;
export const MAX_DOUBLES_COUNTER: number = 3;
export const MAX_JAIL_TURNS = 3;
