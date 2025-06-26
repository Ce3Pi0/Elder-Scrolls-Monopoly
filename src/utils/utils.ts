import {
  PropertyDeed,
  Game,
  Player,
  UtilityDeed,
  StablesDeed,
  BasicDeed,
} from "../classes/classes";
import propertyDeedsJson from "../data/propertyDeeds.json";
import stablesDeedsJson from "../data/stablesDeeds.json";
import utilitiesDeedsJson from "../data/utilityDeeds.json";
import chanceCardsJson from "../data/chanceCards.json";
import communityChestCardsJson from "../data/communityChestCards.json";
import type { Cell, ModalContent } from "../interfaces/interfaces";
import type {
  ChanceCard,
  CommunityChestCard,
  GetOutOfJailCardType,
  OtherDeedTuple,
  PropertyDeedTuple,
} from "./types";

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

const propertyDeedData = propertyDeedsJson.propertyDeeds as PropertyDeedTuple[];
const stableDeedData = stablesDeedsJson.stablesDeeds as OtherDeedTuple[];
const utilityDeedData = utilitiesDeedsJson.utilitiesDeeds as OtherDeedTuple[];

export const CHANCE_CARDS: ChanceCard[] =
  chanceCardsJson.chanceCards as ChanceCard[];

export const COMMUNITY_CHEST_CARDS: ChanceCard[] =
  communityChestCardsJson.communityChestCards as CommunityChestCard[];

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

export const serializeGame = (game: Game) => {
  return {
    players: game.getPlayers().map((p) => ({
      id: p.getId(),
      name: p.getName(),
      color: p.getColor(),
      icon: p.getIcon(),
      balance: p.getBalance(),
      position: p.getPosition(),
      inJail: p.isInJail(),
      jailTurns: p.getJailTurns(),
      deeds: p.getDeeds().map((d) => d?.getId()),
      bankrupt: p.isBankrupt(),
      getOutOfJailCards: p.getGetOutOfJailCards(),
    })),
    board: game.getBoard().map((cell) => {
      let deedData = null;

      if (cell.deed) {
        const baseData = {
          type: cell.deed.constructor.name,
          id: cell.deed.getId(),
          deedName: cell.deed.getDeedName(),
          price: cell.deed.getPrice(),
          rent: cell.deed.getRent(),
          mortgageValue: cell.deed.getMortgageValue(),
          isMortgaged: cell.deed.isMortgaged(),
          ownerId: cell.deed.getOwner()?.getId() ?? null,
        };

        if (cell.deed instanceof PropertyDeed) {
          deedData = {
            ...baseData,
            region: cell.deed.getRegion(),
            houseCost: cell.deed.getHouseCost(),
            castleCost: cell.deed.getCastleCost(),
            numberOfHouses: cell.deed.getNumberOfHouses(),
            numberOfCastles: cell.deed.getNumberOfCastles(),
          };
        } else {
          deedData = baseData;
        }
      }

      return {
        id: cell.id,
        actionType: cell.actionType,
        deed: deedData,
      };
    }),
    gameSettings: game.getGameSettings(),
    currentPlayerIndex: game.getCurrentPlayer().getId(),
    diceValue: game.getDiceValue(),
    diceRolled: game.getDiceRolled(),
    gameStarted: game.isGameStarted(),
    gameEnded: game.isGameEnded(),
    modalOpen: game.isModalOpen(),
    modalContent: game.getModalContent(),
    pendingDrawCard: game.isPendingDrawCard(),
  };
};

export const deserializeGame = (data: any): Game => {
  const players = data.players.map((p: any) => {
    const tempP = new Player(p.id, p.name, p.color, p.icon);
    tempP.setBalance(p.balance);
    return tempP;
  });

  const allDeeds: BasicDeed[] = [];
  const board: Cell[] = data.board.map((cellData: any) => {
    let deed: PropertyDeed | UtilityDeed | StablesDeed | null = null;

    if (cellData.deed) {
      const d = cellData.deed;

      switch (d.type) {
        case "PropertyDeed":
          deed = new PropertyDeed(
            d.id,
            d.region,
            d.deedName,
            d.price,
            d.rent,
            d.houseCost,
            d.castleCost,
            d.mortgageValue
          );
          (deed as PropertyDeed).setNumberOfHouses(d.numberOfHouses);
          (deed as PropertyDeed).setNumberOfCastles(d.numberOfCastles);
          break;

        case "UtilityDeed":
          deed = new UtilityDeed(d.id, d.deedName);
          break;

        case "StablesDeed":
          deed = new StablesDeed(d.id, d.deedName);
          break;

        default:
          console.warn("Unknown deed type:", d.type);
      }

      if (deed) {
        deed.isMortgaged = d.isMortgaged;
        (deed as any)._ownerId = d.ownerId;
        if (
          deed instanceof PropertyDeed ||
          deed instanceof UtilityDeed ||
          deed instanceof StablesDeed
        ) {
          allDeeds.push(deed);
        }
      }
    }

    return {
      id: cellData.id,
      actionType: cellData.actionType,
      deed,
    };
  });

  for (const deed of allDeeds) {
    const ownerId = (deed as any)._ownerId;
    if (ownerId !== null) {
      const owner = players.find((p: Player) => p.getId() === ownerId);
      if (owner) {
        owner.addDeed(deed);
      }
    }
    delete (deed as any)._ownerId; // clean up temp property
  }

  const game = new Game(players, data.gameSettings);
  game.setBoard(board);
  game.setCurrentPlayerIndex(data.currentPlayerIndex);
  game.setDiceValue(data.diceValue);
  game.setDiceRolled(data.diceRolled);
  game.setGameStarted(data.gameStarted);
  game.setGameEnded(data.gameEnded);
  game.setModalOpen(data.modalOpen);
  game.setModalContent(data.modalContent);
  game.setPendingDrawCard(data.pendingDrawCard);

  return game;
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
      title: "community",
      content: card,
    };
  }

  //Avoid the last index because that is the one with the get out of jail card
  const card: ChanceCard =
    CHANCE_CARDS[Math.trunc(Math.random() * CHANCE_CARDS.length)];

  return {
    title: "community",
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
      title: "community",
      content: card,
    };
  }

  //Avoid the last index because that is the one with the get out of jail card
  const card: CommunityChestCard =
    COMMUNITY_CHEST_CARDS[
      Math.trunc(Math.random() * COMMUNITY_CHEST_CARDS.length)
    ];

  return {
    title: "community",
    content: card,
  };
};

export const returnGetOutOfJailCard = (type: GetOutOfJailCardType): void => {
  if (type === "chance") {
    drawnChanceGetOutOfJailCard = true;
  } else {
    drawnCommunityChestGetOutOfJailCard = true;
  }
};
