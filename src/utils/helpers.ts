import { PropertyDeed } from "../classes/concrete/propertyDeed";
import { StablesDeed } from "../classes/concrete/stablesDeed";
import { UtilityDeed } from "../classes/concrete/utilityDeed";
import type { ModalContent } from "../interfaces/interfaces";
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

//TODO: Switch to function
export const REGIONS_TO_COLORS: { [key: string]: string } = {
  "Black Marsh": "#A8714E",
  Cyrodiil: "#4EA8A0",
  "South Skyrim": "#F06BEC",
  "North Skyrim": "#D16420",
  "High Rock": "#EA0B0F",
  Morrowind: "#D8CB18",
  Hammerfell: "#12AA2",
  "Summerset Isles": "#5871FF",
};

//TODO: Switch to function

export const CITIES_TO_PICTURES: { [key: string]: string } = {
  Lilmoth: "src/assets/images/Lilmoth.png",
  Kvatch: "src/assets/images/Kvatch.png",
  Stormhold: "src/assets/images/Stormhold.png",
  Skingrad: "src/assets/images/Skingrad.png",
  "Imperial City": "src/assets/images/ImperialCity.png",
  Falkreath: "src/assets/images/Falkreath.png",
  Markarth: "src/assets/images/Markarth.png",
  Riften: "src/assets/images/Riften.png",
  Winterhold: "src/assets/images/Winterhold.png",
  Windhelm: "src/assets/images/Windhelm.png",
  Solitude: "src/assets/images/Solitude.png",
  Evermore: "src/assets/images/Evermore.png",
  Wayrest: "src/assets/images/Wayrest.png",
  Daggerfall: "src/assets/images/Daggerfall.png",
  "Raven Rock": "src/assets/images/RavenRock.png",
  Mournhold: "src/assets/images/Mournhold.png",
  Ebonheart: "src/assets/images/Ebonheart.png",
  Orsinium: "src/assets/images/Orsinium.png",
  Sentinel: "src/assets/images/Sentinel.png",
  "Abah's Landing": "src/assets/images/AbahsLanding.png",
  Lillandril: "src/assets/images/Lillandril.png",
  Alinor: "src/assets/images/Alinor.png",
};

//TODO: Switch to function
export const UTILITIES_TO_PICTURES: { [key: string]: string } = {
  "Raven Rock Mine": "src/assets/images/RavenRockMine.png",
  "Soltitude Sawmill": "src/assets/images/SoltitudeSawmill.png",
};

//TODO: Switch to function
export const UTILITIES_TO_LOGOS: { [key: string]: string } = {
  "Raven Rock Mine": "src/assets/icons/MineLogo.png",
  "Soltitude Sawmill": "src/assets/icons/SawmillLogo.png",
};

//FIXME: Change how data gets saved to local storage
// export const serializeGame = (game: Game) => {
//   return {
//     players: game.getPlayers().map((p) => ({
//       id: p.getId(),
//       name: p.getName(),
//       color: p.getColor(),
//       icon: p.getIcon(),
//       balance: p.getBalance(),
//       position: p.getPosition(),
//       inJail: p.isInJail(),
//       jailTurns: p.getJailTurns(),
//       deeds: p.getDeeds().map((d) => d?.getId()),
//       getOutOfJailCards: p.getGetOutOfJailCards(),
//       bankrupt: p.isBankrupt(),
//     })),
//     gameSettings: game.getGameSettings(),
//     event: game.getEvent(),
//     gameStarted: game.isGameStarted(),
//     gameEnded: game.isGameEnded(),
//     board: game.getBoard().map((cell) => {
//       let deedData = null;

//       if (cell.deed) {
//         const baseData = {
//           type: cell.deed.constructor.name,
//           id: cell.deed.getId(),
//           deedName: cell.deed.getDeedName(),
//           price: cell.deed.getPrice(),
//           rent: cell.deed.getRent(),
//           mortgageValue: cell.deed.getMortgageValue(),
//           isMortgaged: cell.deed.isMortgaged(),
//           ownerId: cell.deed.getOwnerId() ?? null,
//         };

//         if (cell.deed instanceof PropertyDeed) {
//           deedData = {
//             ...baseData,
//             region: cell.deed.getRegion(),
//             houseCost: cell.deed.getHouseCost(),
//             castleCost: cell.deed.getCastleCost(),
//             numberOfHouses: cell.deed.getNumberOfHouses(),
//             numberOfCastles: cell.deed.getNumberOfCastles(),
//           };
//         } else {
//           deedData = baseData;
//         }
//       }

//       return {
//         id: cell.id,
//         actionType: cell.actionType,
//         deed: deedData,
//       };
//     }),
//     currentPlayerIndex: game.getCurrentPlayer().getId(),
//     diceRolled: game.getDiceRolled(),
//     diceValue: game.getDiceValue(),
//     doublesCounter: game.getDoublesCounter(),
//     modalOpen: game.isModalOpen(),
//     modalContent: game.getModalContent(),
//     pendingDrawCard: game.isPendingDrawCard(),
//   };
// };
// export const deserializeGame = (data: any): Game => {
//   const players = data.players.map((p: any) => {
//     const tempP = new Player(p.id, p.name, p.color, p.icon);
//     tempP.setBalance(p.balance);
//     tempP.setPosition(p.position);
//     tempP.setInJail(p.inJail);
//     tempP.setJailTurns(p.jailTurns);
//     for (const getOutOfJailCard of p.getOutOfJailCards) {
//       tempP.addGetOutOfJailCard(getOutOfJailCard);
//     }
//     return tempP;
//   });

//   const allDeeds: BasicDeed[] = [];
//   const board: Cell[] = data.board.map((cellData: any) => {
//     let deed: PropertyDeed | UtilityDeed | StablesDeed | null = null;

//     if (cellData.deed) {
//       const d = cellData.deed;

//       switch (d.type) {
//         case "PropertyDeed":
//           deed = new PropertyDeed(
//             d.id,
//             d.region,
//             d.deedName,
//             d.price,
//             d.rent,
//             d.houseCost,
//             d.castleCost,
//             d.mortgageValue
//           );
//           (deed as PropertyDeed).setNumberOfHouses(d.numberOfHouses);
//           (deed as PropertyDeed).setNumberOfCastles(d.numberOfCastles);
//           break;

//         case "UtilityDeed":
//           deed = new UtilityDeed(d.id, d.deedName);
//           break;

//         case "StablesDeed":
//           deed = new StablesDeed(d.id, d.deedName);
//           break;

//         default:
//           console.warn("Unknown deed type:", d.type);
//       }

//       if (deed) {
//         if (d.isMortgaged) {
//           deed.mortgage();
//         }
//         (deed as any)._ownerId = d.ownerId;
//         if (
//           deed instanceof PropertyDeed ||
//           deed instanceof UtilityDeed ||
//           deed instanceof StablesDeed
//         ) {
//           allDeeds.push(deed);
//         }
//       }
//     }

//     return {
//       id: cellData.id,
//       actionType: cellData.actionType,
//       deed,
//     };
//   });

//   for (const deed of allDeeds) {
//     const ownerId = (deed as any)._ownerId;
//     if (ownerId !== null) {
//       const owner = players.find((p: Player) => p.getId() === ownerId);
//       if (owner) {
//         owner.addDeed(deed);
//       }
//     }
//     delete (deed as any)._ownerId; // clean up temp PROPERTY
//   }

//   const game = new Game(players, data.gameSettings);
//   game.setEvent(data.event);
//   game.setBoard(board);
//   game.setDiceRolled(data.diceRolled);

//   game.setDiceValue(data.diceValue);
//   game.setGameStarted(data.gameStarted);
//   game.setGameEnded(data.gameEnded);
//   game.setModalOpen(data.modalOpen);
//   if (data.modalContent !== null) {
//     if (data.modalContent.title === "trade") {
//       const playerId = data.modalContent.content.player.id;
//       data.modalContent.content.player = players.find(
//         (p: Player) => p.getId() === playerId
//       );
//     }
//   }
//   game.setModalContent(data.modalContent);
//   game.setPendingDrawCard(data.pendingDrawCard);
//   game.setCurrentPlayerIndex(data.currentPlayerIndex);

//   return game;
// };
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
