import {
  PropertyDeed,
  Game,
  Player,
  UtilityDeed,
  StablesDeed,
  BasicDeed,
} from "../classes/classes";
import type { Cell, PlayerData } from "../interfaces/interfaces";

export const PLAYER_COLORS: { [key: number]: [string, string] } = {
  1: ["#FF0000", "Red"], // Red
  2: ["#00FF00", "Green"],
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

type PROPERTY_DEED_TUPLE = [
  number,
  string,
  string,
  number,
  number[],
  number,
  number,
  number
];

type REST_DEED_TUPLE = [number, string];

const PROPERTY_DEED_DATA: PROPERTY_DEED_TUPLE[] = [
  [1, "Black Marsh", "Lilmoth", 60, [7, 28, 64, 130, 180, 200], 30, 30, 30],
  [3, "Black Marsh", "Kvatch", 90, [11, 44, 90, 150, 200, 220], 30, 30, 45],
  [6, "Cyrodiil", "Stormhold", 120, [15, 60, 120, 200, 240, 260], 50, 50, 60],
  [8, "Cyrodiil", "Skingard", 130, [16, 65, 125, 205, 245, 265], 50, 50, 65],
  [
    9,
    "Cyrodiil",
    "Imperial City",
    150,
    [19, 75, 140, 220, 260, 280],
    50,
    50,
    75,
  ],

  [
    11,
    "South Skyrim",
    "Falkreath",
    160,
    [20, 80, 160, 240, 280, 300],
    70,
    70,
    80,
  ],
  [
    13,
    "South Skyrim",
    "Markarth",
    160,
    [20, 80, 160, 240, 280, 300],
    70,
    70,
    80,
  ],
  [14, "South Skyrim", "Riften", 170, [22, 88, 175, 255, 290, 310], 70, 70, 85],

  [
    16,
    "North Skyrim",
    "Winterhold",
    180,
    [23, 95, 180, 260, 300, 360],
    90,
    90,
    90,
  ],
  [
    18,
    "North Skyrim",
    "Windhlem",
    200,
    [25, 100, 200, 280, 360, 400],
    90,
    90,
    100,
  ],
  [
    19,
    "North Skyrim",
    "Soltitude",
    200,
    [25, 100, 200, 280, 360, 400],
    90,
    90,
    100,
  ],

  [
    21,
    "High Rock",
    "Evermore",
    220,
    [27, 110, 220, 300, 380, 420],
    100,
    100,
    110,
  ],
  [
    23,
    "High Rock",
    "Wayrest",
    220,
    [27, 110, 220, 300, 380, 420],
    100,
    100,
    110,
  ],
  [
    24,
    "High Rock",
    "Daggerfall",
    240,
    [30, 120, 240, 320, 400, 440],
    100,
    100,
    120,
  ],

  [
    26,
    "Morrowind",
    "Raven Rock",
    260,
    [32, 125, 250, 350, 430, 480],
    120,
    120,
    130,
  ],
  [
    27,
    "Morrowind",
    "Mournhold",
    260,
    [32, 125, 250, 350, 430, 480],
    120,
    120,
    130,
  ],
  [
    29,
    "Morrowind",
    "Ebonheart",
    280,
    [35, 140, 280, 380, 460, 500],
    120,
    120,
    140,
  ],

  [
    31,
    "Hammerfell ",
    "Orsinium",
    300,
    [38, 150, 300, 400, 480, 540],
    140,
    140,
    150,
  ],
  [
    32,
    "Hammerfell ",
    "Sentinel",
    320,
    [40, 160, 320, 420, 500, 560],
    140,
    140,
    160,
  ],
  [
    34,
    "Hammerfell ",
    "Abah's Landing",
    340,
    [42, 170, 340, 440, 520, 600],
    140,
    140,
    170,
  ],

  [
    37,
    "Summerset Isles",
    "Lillandril",
    450,
    [56, 220, 440, 800, 900, 1000],
    200,
    200,
    225,
  ],
  [
    39,
    "Summerset Isles",
    "Alinor",
    500,
    [60, 240, 480, 860, 1000, 1200],
    200,
    200,
    250,
  ],
];

const STABLES_DEED_DATA: REST_DEED_TUPLE[] = [
  [5, "White Run Stables"],
  [15, "Riften Stables"],
  [25, "Markarth Stables"],
  [35, "Windhelm Stables"],
];

const UTILITIES_DEED_DATA: REST_DEED_TUPLE[] = [
  [12, "Raven Rock Mine"],
  [28, "Soltitude Sawmill"],
];

export const PROPERTY_DEEDS: PropertyDeed[] = PROPERTY_DEED_DATA.map(
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

export const STABLES_DEEDS: StablesDeed[] = STABLES_DEED_DATA.map(
  ([position, name]) => new StablesDeed(position, name)
);

export const UTILITIES_DEEDS: UtilityDeed[] = UTILITIES_DEED_DATA.map(
  ([position, name]) => new UtilityDeed(position, name)
);

export enum Finances {
  UTILITY_PRICE = 150,
  STABLES_PRICE = 200,
  UTILITY_PRICE_MULTIPLIER = 4,
  UTILITY_PRICE_MULTIPLIER_2 = 10,
  STABLES_RENT_1 = 25,
  STABLES_RENT_2 = 50,
  STABLES_RENT_3 = 100,
  STABLES_RENT_4 = 200,
  START_MONEY = 1500,
  PASS_MONEY = 200,
  JAIL_FEE = 50,
}

export enum Positions {
  START = 0,
  END = 39,
  JAIL = 10,
  GO_TO_JAIL = 30,
}

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

export type CellType =
  | "start"
  | "property"
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
  | { type: "SET_MODAL_CONTENT"; payload: Object | null }
  | { type: "CLOSE_MODAL"; payload: null }
  | { type: "DRAW_CARD"; payload: null }
  | { type: "END_DRAW_CARD"; payload: null }
  | { type: "BUY_DEED"; payload: { deed: BasicDeed; playerId: number } } //TODO: Might need to change payload deed type
  //TODO: SELL DEED
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
  | { type: "ADD_GET_OUT_OF_JAIL_CARD"; payload: number }
  | { type: "REMOVE_GET_OUT_OF_JAIL_CARD"; payload: number }
  | { type: "ADD_PLAYER"; payload: Player }
  | { type: "UPDATE_PLAYER"; payload: PlayerData }
  | { type: "REMOVE_PLAYER"; payload: Player };

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
