import { PropertyDeed } from "../classes/concrete/propertyDeed";
import { StablesDeed } from "../classes/concrete/stablesDeed";
import { UtilityDeed } from "../classes/concrete/utilityDeed";
import type { ModalContent } from "./interfaces";
import {
  CHANCE_CARDS,
  COMMUNITY_CHEST_CARDS,
  PLAYER_COLORS,
  PLAYER_ICONS,
} from "./constants";
import type {
  ChanceCard,
  CommunityChestCard,
  GetOutOfJailCardType,
} from "./types";

export const regionsToColors = (key: string): string | undefined => {
  switch (key) {
    case "Black Marsh":
      return "#A8714E";
    case "Cyrodiil":
      return "#4EA8A0";
    case "South Skyrim":
      return "#F06BEC";
    case "North Skyrim":
      return "#D16420";
    case "High Rock":
      return "#EA0B0F";
    case "Morrowind":
      return "#D8CB18";
    case "Hammerfell":
      return "#12AA2";
    case "Summerset Isles":
      return "#5871FF";
    default:
      return undefined;
  }
};

export const citiesToPictures = (key: string): string | undefined => {
  switch (key) {
    case "Lilmoth":
      return "src/assets/images/Lilmoth.png";
    case "Kvatch":
      return "src/assets/images/Kvatch.png";
    case "Stormhold":
      return "src/assets/images/Stormhold.png";
    case "Skingrad":
      return "src/assets/images/Skingrad.png";
    case "Imperial City":
      return "src/assets/images/ImperialCity.png";
    case "Falkreath":
      return "src/assets/images/Falkreath.png";
    case "Markarth":
      return "src/assets/images/Markarth.png";
    case "Riften":
      return "src/assets/images/Riften.png";
    case "Winterhold":
      return "src/assets/images/Winterhold.png";
    case "Windhelm":
      return "src/assets/images/Windhelm.png";
    case "Solitude":
      return "src/assets/images/Solitude.png";
    case "Evermore":
      return "src/assets/images/Evermore.png";
    case "Wayrest":
      return "src/assets/images/Wayrest.png";
    case "Daggerfall":
      return "src/assets/images/Daggerfall.png";
    case "Raven Rock":
      return "src/assets/images/RavenRock.png";
    case "Mournhold":
      return "src/assets/images/Mournhold.png";
    case "Ebonheart":
      return "src/assets/images/Ebonheart.png";
    case "Orsinium":
      return "src/assets/images/Orsinium.png";
    case "Sentinel":
      return "src/assets/images/Sentinel.png";
    case "Abah's Landing":
      return "src/assets/images/AbahsLanding.png";
    case "Lillandril":
      return "src/assets/images/Lillandril.png";
    case "Alinor":
      return "src/assets/images/Alinor.png";

    default:
      return undefined;
  }
};

export const utilitiesToPictures = (key: string): string | undefined => {
  switch (key) {
    case "Raven Rock Mine":
      return "src/assets/images/RavenRockMine.png";
    case "Soltitude Sawmill":
      return "src/assets/images/SoltitudeSawmill.png";

    default:
      return undefined;
  }
};

export const utilitiesToLogos = (key: string): string | undefined => {
  switch (key) {
    case "Raven Rock Mine":
      return "src/assets/icons/MineLogo.png";
    case "Soltitude Sawmill":
      return "src/assets/icons/SawmillLogo.png";

    default:
      return undefined;
  }
};
export const getRandomColor = (colors: number[]) => {
  const availableColors: number[] = Object.keys(PLAYER_COLORS).map(Number);
  for (const color of colors) {
    if (availableColors.indexOf(color) !== -1) {
      availableColors.splice(availableColors.indexOf(color), 1);
    }
  }

  return availableColors[Math.floor(Math.random() * availableColors.length)];
};
export const getRandomIcon = (icons: number[]) => {
  const availableIcons: number[] = Object.keys(PLAYER_ICONS).map(Number);
  for (const icon of icons) {
    if (availableIcons.indexOf(icon) !== -1) {
      availableIcons.splice(availableIcons.indexOf(icon), 1);
    }
  }

  return availableIcons[Math.floor(Math.random() * availableIcons.length)];
};
export const isPropertyDeed = (deed: any): deed is PropertyDeed => {
  return deed instanceof PropertyDeed;
};
export const isUtilityDeed = (deed: any): deed is UtilityDeed => {
  return deed instanceof UtilityDeed;
};
export const isStablesDeed = (deed: any): deed is StablesDeed => {
  return deed instanceof StablesDeed;
};
let drawnChanceGetOutOfJailCard = true;
export const getRandomChanceCard = (): ModalContent => {
  if (!drawnChanceGetOutOfJailCard) {
    const card: ChanceCard =
      CHANCE_CARDS[Math.trunc(Math.random() * CHANCE_CARDS.length) + 1];
    return {
      title: "CHANCE",
      content: card,
    };
  }

  //Avoid the last index because that is the one with the get out of JAIL card
  const card: ChanceCard =
    CHANCE_CARDS[Math.trunc(Math.random() * CHANCE_CARDS.length)];

  return {
    title: "COMMUNITY",
    content: card,
  };
};
let drawnCommunityChestGetOutOfJailCard = false;
export const getRandomCommunityChestCard = (): ModalContent => {
  if (!drawnCommunityChestGetOutOfJailCard) {
    const card: CommunityChestCard =
      COMMUNITY_CHEST_CARDS[
        Math.trunc(Math.random() * COMMUNITY_CHEST_CARDS.length) + 1
      ];
    return {
      title: "COMMUNITY",
      content: card,
    };
  }

  //Avoid the last index because that is the one with the get out of JAIL card
  const card: CommunityChestCard =
    COMMUNITY_CHEST_CARDS[
      Math.trunc(Math.random() * COMMUNITY_CHEST_CARDS.length)
    ];

  return {
    title: "COMMUNITY",
    content: card,
  };
};
export const returnGetOutOfJailCard = (type: GetOutOfJailCardType): void => {
  if (type === "CHANCE") {
    drawnChanceGetOutOfJailCard = true;
  } else {
    drawnCommunityChestGetOutOfJailCard = true;
  }
};
