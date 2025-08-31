import type {
  Cell,
  GameType,
  ModalContent,
  Pair,
  PlayerData,
} from "../interfaces/interfaces";
import {
  BOARD_SIZE,
  GET_OUT_OF_JAIL_FREE_CARDS_COUNT,
  getRandomChanceCard,
  getRandomCommunityChestCard,
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
  MAX_DICE_VALUE,
  MAX_DOUBLES_COUNTER,
  MAX_PLAYER_COUNT,
  PLAYER_COLORS,
  PLAYER_ICONS,
  REGIONS,
  returnGetOutOfJailCard,
  TOTAL_DEEDS,
  VALID_GAME_DURATIONS,
} from "../utils/utils";
import type { CellType, EventType, GetOutOfJailCardType } from "../utils/types";
import { Finances, Positions } from "../utils/enums";

export abstract class BasicDeed {
  protected id: number;
  protected ownerId: number | null;
  protected deedName: string;
  protected price: number;
  protected rent: number[];
  protected mortgageValue: number;
  protected mortgaged: boolean;

  constructor(
    id: number,
    deedName: string,
    price: number,
    rent: number[],
    mortgageValue: number,
    ownerId: number | null,
    mortgaged: boolean
  ) {
    if (id < 0) throw new Error("Invalid deed ID number");
    if (price < 0) throw new Error("Invalid deed price");
    if (rent.length < 0) throw new Error("Invalid deed rent");
    for (let r of rent) if (r < 0) throw new Error("Invalid deed rent");
    if (mortgageValue < 0) throw new Error("Invalid deed mortgage value");

    this.id = id;
    this.deedName = deedName;
    this.price = price;
    this.rent = rent;
    this.mortgageValue = mortgageValue;
    this.ownerId = ownerId;
    this.mortgaged = mortgaged;
  }
  abstract clone(): BasicDeed;
  getId(): number {
    return this.id;
  }
  getOwnerId(): number | null {
    return this.ownerId;
  }
  getDeedName(): string {
    return this.deedName;
  }
  getPrice(): number {
    return this.price;
  }
  getMortgageValue(): number {
    return this.mortgageValue;
  }

  getUnMortgageValue(): number {
    return this.mortgageValue + 0.1 * this.price;
  }
  setOwnerId(ownerId: number | null): void {
    if (ownerId < 0) throw new Error("Invalid deed owner ID");
    this.ownerId = ownerId;
  }

  isMortgaged(): boolean {
    return this.mortgaged;
  }

  mortgage(): void {
    if (this.mortgaged) throw new Error("Deed already mortgaged.");
    this.mortgaged = true;
  }
  unMortgage(): void {
    if (!this.mortgaged) throw new Error("Deed not mortgaged.");
    this.mortgaged = false;
  }
  getRent(): number[] {
    return this.rent;
  }
  abstract getRentOwed(owner: Player): number;
}
export class UtilityDeed extends BasicDeed {
  constructor(
    id: number,
    deedName: string,
    price: number = Finances.UTILITY_PRICE,
    rent: number[] = [
      Finances.UTILITY_PRICE_MULTIPLIER,
      Finances.UTILITY_PRICE_MULTIPLIER_2,
    ],
    mortgageValue: number = Finances.UTILITY_PRICE / 2,
    ownerId: number | null = null,
    mortgaged: boolean = false
  ) {
    super(id, deedName, price, rent, mortgageValue, ownerId, mortgaged);
  }
  clone(): UtilityDeed {
    const cloned = new UtilityDeed(
      this.id,
      this.deedName,
      this.price,
      [...this.rent],
      this.mortgageValue,
      this.ownerId,
      this.mortgaged
    );

    return cloned;
  }
  getRentOwed(owner: Player): number {
    if (this.getOwnerId() !== owner.getId())
      throw new Error(
        `Player with player ID ${owner.getId()} doesn't own this deed`
      );
    return this.rent[owner.getOwnedUtilities().length - 1];
  }
}
export class StablesDeed extends BasicDeed {
  constructor(
    id: number,
    deedName: string,
    price: number = Finances.STABLES_PRICE,
    rent: number[] = [
      Finances.STABLES_RENT_1,
      Finances.STABLES_RENT_2,
      Finances.STABLES_RENT_3,
      Finances.STABLES_RENT_4,
    ],
    mortgageValue: number = Finances.STABLES_PRICE / 2,
    ownerId: number | null = null,
    mortgaged: boolean = false
  ) {
    super(id, deedName, price, rent, mortgageValue, ownerId, mortgaged);
  }
  clone(): StablesDeed {
    const cloned = new StablesDeed(
      this.id,
      this.deedName,
      this.price,
      [...this.rent],
      this.mortgageValue,
      this.ownerId,
      this.mortgaged
    );

    return cloned;
  }
  getRentOwed(owner: Player): number {
    if (this.getOwnerId() !== owner.getId())
      throw new Error(
        `Player with player ID ${owner.getId()} doesn't own this deed`
      );
    return this.rent[owner.getOwnedStables().length - 1];
  }
}
export class PropertyDeed extends BasicDeed {
  private region: string;
  private houseCost: number;
  private castleCost: number;
  private numberOfHouses: number;
  private numberOfCastles: number;
  constructor(
    id: number,
    region: string,
    deedName: string,
    price: number,
    rent: number[],
    houseCost: number,
    castleCost: number,
    mortgageValue: number,
    ownerId: number | null = null,
    mortgaged: boolean = false,
    numberOfHouses: number = 0,
    numberOfCastles: number = 0
  ) {
    super(id, deedName, price, rent, mortgageValue, ownerId, mortgaged);
    if (houseCost < 0) throw new Error("Houses cannot cost negative values");
    if (castleCost < 0) throw new Error("Castles cannot cost negative values");
    if (REGIONS.includes(this.region) === undefined)
      throw new Error("Invalid region");
    if (numberOfCastles < 0) throw new Error("Invalid number of castles");
    if (numberOfHouses < 0) throw new Error("Invalid number of houses");

    this.region = region;
    this.deedName = deedName;
    this.houseCost = houseCost;
    this.castleCost = castleCost;

    this.numberOfHouses = numberOfHouses;
    this.numberOfCastles = numberOfCastles;
  }
  clone(): PropertyDeed {
    const cloned = new PropertyDeed(
      this.id,
      this.region,
      this.deedName,
      this.price,
      [...this.rent],
      this.houseCost,
      this.castleCost,
      this.mortgageValue
    );

    cloned.setOwnerId(this.getOwnerId());

    for (let i = 0; i < this.numberOfHouses; i++) cloned.addHouse();
    for (let i = 0; i < this.numberOfCastles; i++) cloned.addCastle();

    if (this.mortgaged) cloned.mortgage();

    return cloned;
  }
  getRegion(): string {
    return this.region;
  }
  getRentOwed(owner: Player): number {
    if (this.getOwnerId() !== owner.getId())
      throw new Error(
        `Player with player ID ${owner.getId()} doesn't own this deed`
      );

    if (this.numberOfHouses === 0 && this.numberOfCastles === 0) {
      if (owner.regionOwned(this.region)) return 2 * this.rent[0];
      return this.rent[0];
    }
    return this.rent[this.numberOfHouses + this.numberOfCastles];
  }
  getHouseCost(): number {
    return this.houseCost;
  }
  getCastleCost(): number {
    return this.castleCost;
  }
  getTotalValue(): number {
    return (
      this.price +
      this.numberOfHouses * this.houseCost +
      this.numberOfCastles * this.castleCost
    );
  }
  getNumberOfHouses(): number {
    return this.numberOfHouses;
  }
  getNumberOfCastles(): number {
    return this.numberOfCastles;
  }
  addHouse(): void {
    if (this.numberOfHouses === 4) throw new Error("Cannot add more houses.");
    this.numberOfHouses++;
  }
  removeHouse(): void {
    if (this.numberOfCastles > 0) throw new Error("Cannot remove house.");
    if (this.numberOfHouses === 0)
      throw new Error("Cannot remove more houses.");
    this.numberOfHouses--;
  }
  addCastle(): void {
    if (this.numberOfHouses !== 4) throw new Error("Cannot add castle.");
    if (this.numberOfCastles === 4) throw new Error("Cannot add more castles.");
    this.numberOfCastles++;
  }
  removeCastle(): void {
    if (this.numberOfCastles === 0) throw new Error("Cannot remove castle.");
    this.numberOfCastles--;
  }
}
export class Player {
  private readonly MAX_JAIL_TURNS: number = 3;

  private id: number;
  private name: string;
  private color: number;
  private icon: number;

  private balance: number = Finances.START_MONEY;
  private position: number = 0;
  private inJail: boolean = false;
  private jailTurns: number = 0;
  private deeds: BasicDeed[] = [];
  private getOutOfJailCards: GetOutOfJailCardType[] = [];
  private bankrupt: boolean = false;

  constructor(
    id: number,
    name: string,
    color: number,
    icon: number,
    balance: number = Finances.START_MONEY,
    position: number = 0,
    inJail: boolean = false,
    jailTurns: number = 0,
    deeds: BasicDeed[] = [],
    getOutOfJailCards: GetOutOfJailCardType[] = [],
    bankrupt: boolean = false
  ) {
    if (id < 0) throw new Error("Invalid player ID number");
    if (PLAYER_COLORS[color] === undefined)
      throw new Error("Invalid player color");
    if (PLAYER_ICONS[icon] === undefined)
      throw new Error("Invalid player icon");
    if (position < Positions.START || position > Positions.END) {
      throw new Error(
        `Invalid position: must be larger than ${Positions.START} and less than ${Positions.END}.`
      );
    }
    if (jailTurns < 0 || jailTurns > 3)
      throw new Error("Invalid number of jail turns");
    if (deeds.length > TOTAL_DEEDS) throw new Error("Invalid number of deeds");
    if (
      getOutOfJailCards.length > GET_OUT_OF_JAIL_FREE_CARDS_COUNT ||
      getOutOfJailCards.length < 0
    )
      throw new Error("Invalid number of get out of jail free cards");

    this.id = id;
    this.name = name;
    this.color = color;
    this.icon = icon;
    this.balance = balance;
    this.position = position;
    this.inJail = inJail;
    this.jailTurns = jailTurns;
    this.deeds = deeds.map((deed) => deed.clone());
    this.getOutOfJailCards = [...getOutOfJailCards];

    if (this.getTotalBalance() > 0 && bankrupt)
      throw new Error("Player not bankrupt");

    this.bankrupt = bankrupt;
  }
  clone(): Player {
    const cloned = new Player(
      this.id,
      this.name,
      this.color,
      this.icon,
      this.balance,
      this.position,
      this.inJail,
      this.jailTurns,
      this.deeds,
      this.getOutOfJailCards,
      this.bankrupt
    );

    return cloned;
  }
  getId(): number {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getColor(): number {
    return this.color;
  }
  getIcon(): number {
    return this.icon;
  }
  getBalance(): number {
    return this.balance;
  }
  getTotalBalance(): number {
    return (
      this.balance +
      this.deeds.reduce((acc, deed) => {
        if (isPropertyDeed(deed)) return acc + deed.getTotalValue();
        return acc + deed.getPrice();
      }, 0)
    );
  }
  getPosition(): number {
    return this.position;
  }
  isInJail(): boolean {
    return this.inJail;
  }
  getJailTurns(): number {
    return this.jailTurns;
  }
  getDeeds(): BasicDeed[] {
    return this.deeds;
  }
  setPosition(position: number): void {
    if (position < Positions.START || position > Positions.END) {
      throw new Error(
        `Invalid position: must be larger than ${Positions.START} and less than ${Positions.END}.`
      );
    }
    this.position = position;
  }
  sendToJail(): void {
    this.inJail = true;
    this.jailTurns = 0;
    this.position = Positions.JAIL; // Jail position
  }
  releaseFromJail(): void {
    if (this.inJail) {
      this.inJail = false;
      this.jailTurns = 0;
    } else {
      throw new Error("Player is not in jail.");
    }
  }
  addGetOutOfJailFreeCard(getOutOfJailFreeCard: GetOutOfJailCardType): void {
    this.getOutOfJailCards.push(getOutOfJailFreeCard);
  }
  useGetOutOfJailCard(): void {
    if (this.getOutOfJailCards.length > 0) {
      const card: GetOutOfJailCardType = this.getOutOfJailCards.pop()!;
      returnGetOutOfJailCard(card);
      this.releaseFromJail();
    } else {
      throw new Error("No Get Out of Jail cards available.");
    }
  }
  payReleaseFromJail(): void {
    if (this.inJail) {
      if (this.balance >= 50) {
        this.balance -= Finances.JAIL_FEE; // Pay $50 to get out of jail
        this.releaseFromJail();
      } else {
        throw new Error("Insufficient balance to pay for release from jail.");
      }
    } else {
      throw new Error("Player is not in jail.");
    }
  }
  updateJailTurns(): void {
    if (this.inJail) {
      this.jailTurns++;
      if (this.jailTurns >= this.MAX_JAIL_TURNS) this.releaseFromJail();
    } else throw new Error("Player not in jail");
  }
  addDeed(deed: BasicDeed): void {
    if (this.deeds.some((d) => d.getId() === deed.getId())) {
      throw new Error("PropertyDeed already owned by this player.");
    }
    if (deed.getOwnerId() !== null) throw new Error("Deed already owned");
    deed.setOwnerId(this.id);
    this.deeds.push(deed);
  }
  removeDeed(deed: BasicDeed): void {
    const index = this.deeds.findIndex((d) => d.getId() === deed.getId());
    if (index === -1) {
      throw new Error("PropertyDeed not owned by this player.");
    }
    deed.setOwnerId(null);
    this.deeds.splice(index, 1);
  }
  mortgageDeed(deed: BasicDeed): void {
    if (deed.getOwnerId() !== this.id)
      throw new Error("Deed not owned by player");

    if (this.balance > 0) throw new Error("Cannot mortgage: too much money");

    if (isPropertyDeed(deed)) {
      if (deed.getNumberOfCastles() > 0)
        throw new Error("Cannot mortgage: castles on property deed");
      if (deed.getNumberOfHouses() > 0)
        throw new Error("Cannot mortgage: houses on property deed");
    }

    deed.mortgage();
    this.addBalance(deed.getMortgageValue());
  }
  unMortgageDeed(deed: BasicDeed): void {
    if (deed.getOwnerId() !== this.id)
      throw new Error("Deed not owned by player");

    if (this.balance < deed.getMortgageValue())
      throw new Error("Cannot un-mortgage: too little money");
    this.addBalance(deed.getUnMortgageValue());

    deed.unMortgage();
  }
  canBuildHouse(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfHouses() < 4 &&
      propertyDeed.getOwnerId() === this.id &&
      this.balance >= propertyDeed.getHouseCost()
    );
  }
  canBuildCastle(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfCastles() < 4 &&
      propertyDeed.getOwnerId() === this.id &&
      this.balance >= propertyDeed.getCastleCost()
    );
  }
  buildHouse(propertyDeed: PropertyDeed): void {
    if (this.canBuildHouse(propertyDeed)) {
      this.balance -= propertyDeed.getHouseCost();
      propertyDeed.addHouse();
    } else throw new Error("Cannot build house: conditions not met.");
  }
  buildCastle(propertyDeed: PropertyDeed): void {
    if (this.canBuildCastle(propertyDeed)) {
      this.balance -= propertyDeed.getCastleCost();
      propertyDeed.addCastle();
    } else throw new Error("Cannot build castle: conditions not met.");
  }
  canSellHouse(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfHouses() > 0 &&
      propertyDeed.getNumberOfCastles() === 0 &&
      propertyDeed.getOwnerId() !== this.id &&
      this.balance <= 0
    );
  }
  canSellCastle(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfCastles() > 0 &&
      propertyDeed.getOwnerId() !== this.id &&
      this.balance <= 0
    );
  }
  sellHouse(propertyDeed: PropertyDeed): void {
    if (this.canSellHouse(propertyDeed)) {
      propertyDeed.removeHouse();
      this.balance += propertyDeed.getHouseCost() * 0.5; // Selling at half price
    } else {
      throw new Error("Cannot sell house: conditions not met.");
    }
  }
  sellCastle(propertyDeed: PropertyDeed): void {
    if (this.canSellCastle(propertyDeed)) {
      propertyDeed.removeCastle();
      this.balance += propertyDeed.getCastleCost() * 0.5; // Selling at half price
    } else {
      throw new Error("Cannot sell castle: conditions not met.");
    }
  }
  addBalance(amount: number): void {
    this.balance += amount;
    if (this.getTotalBalance() < 0) this.declareBankruptcy();
  }
  canAfford(amount: number): boolean {
    return this.balance >= amount;
  }
  declareBankruptcy(): void {
    this.bankrupt = true;
    this.balance = 0;
    this.deeds.forEach((deed) => {
      if (isPropertyDeed(deed)) {
        for (let i = 0; i < deed.getNumberOfCastles(); i++) deed.removeCastle();
        for (let i = 0; i < deed.getNumberOfHouses(); i++) deed.removeHouse();
      }
      deed.setOwnerId(null);
    });
    this.deeds = [];
  }
  hasGetOutOfJailCard(): boolean {
    return this.getOutOfJailCards.length > 0;
  }
  removeGetOutOfJailCard(): void {
    if (this.getOutOfJailCards.length > 0) {
      const card: GetOutOfJailCardType = this.getOutOfJailCards.pop()!;
      returnGetOutOfJailCard(card);
    } else throw new Error("No Get Out of Jail cards to remove.");
  }
  getOwnedUtilities(): UtilityDeed[] {
    return this.deeds.filter(isUtilityDeed);
  }
  getOwnedStables(): StablesDeed[] {
    return this.deeds.filter(isStablesDeed);
  }
  isBankrupt(): boolean {
    return this.bankrupt;
  }
  private countRegion(numCities: number, region: string): boolean {
    let count = 0;
    for (const deed of this.deeds) {
      if (isPropertyDeed(deed)) {
        if (deed.getRegion() === region) count++;
      }
    }
    return count === numCities;
  }
  regionOwned(region: string): boolean {
    switch (region) {
      case "Black Marsh":
        return this.countRegion(3, "Black Marsh");
      case "Cyrodiil":
        return this.countRegion(3, "Cyrodiil");
      case "South Skyrim":
        return this.countRegion(3, "South Skyrim");
      case "North Skyrim":
        return this.countRegion(3, "North Skyrim");
      case "High Rock":
        return this.countRegion(3, "High Rock");
      case "Morrowind":
        return this.countRegion(3, "Morrowind");
      case "Hammerfell":
        return this.countRegion(3, "Hammerfell");
      case "Summerset Isles":
        return this.countRegion(2, "Summerset Isles");
      default:
        return false;
    }
  }
}
export class Game {
  private players: Player[];
  private gameSettings: GameType;
  private gameStarted: boolean;
  private gameEnded: boolean;
  private board: Cell[];
  private event: EventType | null;
  private currentPlayerIndex: number;
  private diceRolled: boolean;
  private diceValue: Pair;
  private doublesCounter: number;
  private modalOpen: boolean;
  private modalContent: ModalContent | null;
  private pendingDrawCard: boolean;

  constructor(
    players: Player[],
    gameSettings: GameType,
    gameStarted: boolean = false,
    gameEnded: boolean = true,
    board: Cell[],
    event: EventType | null = null,
    currentPlayerIndex: number = 0,
    diceRolled: boolean = false,
    diceValue: Pair = { diceOne: 0, diceTwo: 0 },
    doublesCounter: number = 0,
    modalOpen: boolean = false,
    modalContent: ModalContent | null = null,
    pendingDrawCard: boolean = false
  ) {
    if (players.length > MAX_PLAYER_COUNT)
      throw new Error("Invalid player count");
    if (VALID_GAME_DURATIONS.includes(gameSettings.duration) === undefined)
      throw new Error("Invalid game duration");
    if (gameStarted && gameEnded)
      throw new Error("Game cannot be started and ended at the same time");
    if (!gameStarted && !gameEnded)
      throw new Error("Game has to be started or ended");
    if (board.length !== BOARD_SIZE) throw new Error("Invalid board");
    if (currentPlayerIndex < 0 || currentPlayerIndex > MAX_PLAYER_COUNT)
      throw new Error("Invalid player index");
    if (
      (diceRolled && diceValue.diceOne === 0 && diceValue.diceTwo === 0) ||
      (!diceRolled && diceValue.diceOne !== 0 && diceValue.diceTwo !== 0)
    )
      throw new Error("Dice values and dice rolled variables error");
    if (
      diceValue.diceOne < 0 ||
      diceValue.diceOne > MAX_DICE_VALUE ||
      diceValue.diceTwo < 0 ||
      diceValue.diceTwo > MAX_DICE_VALUE
    )
      throw new Error("Invalid dice values");
    if (doublesCounter < 0 || doublesCounter > MAX_DOUBLES_COUNTER)
      throw new Error("Invalid doubles counter value");
    if ((modalContent === null && modalOpen) || (modalContent && !modalOpen))
      throw new Error("Modal content and modal open values error");

    this.players = players.map((player) => player.clone());
    this.gameSettings.type = gameSettings.type;
    this.gameSettings.duration = gameSettings.duration;
    this.gameStarted = gameStarted;
    this.gameEnded = gameEnded;
    this.board = board.map((cell) => {
      return {
        id: cell.id,
        actionType: cell.actionType,
        deed: cell.deed.clone(),
      };
    });
    this.event = event;
    this.currentPlayerIndex = currentPlayerIndex;
    (this.diceRolled = diceRolled),
      (this.diceValue = {
        diceOne: diceValue.diceOne,
        diceTwo: diceValue.diceTwo,
      });
    this.doublesCounter = doublesCounter;
    this.modalOpen = modalOpen;
    this.modalContent = {
      title: modalContent.title,
      content: modalContent.content,
    };
    this.pendingDrawCard = pendingDrawCard;
  }
  clone(): Game {
    const clonedPlayers = this.players.map((p) => p.clone());
    const clonedBoard = this.board.map((cell) => ({
      id: cell.id,
      actionType: cell.actionType,
      deed: cell.deed ? cell.deed.clone() : null,
    }));
    const clonedSettings: GameType = { ...this.gameSettings };

    const clonedGame = new Game(clonedPlayers, clonedSettings);

    while (this.currentPlayerIndex !== clonedGame.getCurrentPlayerIndex())
      clonedGame.nextPlayer();
    if (this.diceRolled) clonedGame.setDiceRolled(true);
    clonedGame.setDiceValue(this.diceValue);
    if (this.gameStarted) clonedGame.startGame(clonedBoard);
    if (this.gameEnded) clonedGame.endGame();
    clonedGame.setEvent(this.event);
    if (this.pendingDrawCard) clonedGame.drawCard(this.modalContent);
    else if (this.modalOpen && !this.pendingDrawCard)
      clonedGame.openModal(this.modalContent);

    return clonedGame;
  }
  startGame(): void {
    this.gameStarted = true;
    this.gameEnded = false;
  }
  isGameStarted(): boolean {
    return this.gameStarted;
  }
  isGameEnded(): boolean {
    return this.gameEnded;
  }
  getEvent(): EventType | null {
    return this.event;
  }
  setEvent(event: EventType): void {
    this.event = event;
  }
  isModalOpen(): boolean {
    return this.modalOpen;
  }
  getModalContent(): ModalContent | null {
    return this.modalContent;
  }
  isPendingDrawCard(): boolean {
    return this.pendingDrawCard;
  }
  //TODO: Add functionality
  // changePlayerOrder(): void {

  // }

  setPlayers(players: Player[]): void {
    this.players = players;
  }
  getGameSettings(): GameType {
    return this.gameSettings;
  }
  getDiceValue(): Pair {
    return this.diceValue;
  }
  getDiceRolled(): boolean {
    return this.diceRolled;
  }
  getDoublesCounter(): number {
    return this.doublesCounter;
  }
  //TODO: Check functionality
  incrementDoublesCounter(): void {
    this.doublesCounter++;

    if (this.doublesCounter === 3) {
      this.players[this.currentPlayerIndex].sendToJail;
      this.nextPlayer();
      this.doublesCounter = 0;
    }
  }
  getPlayers(): Player[] {
    return this.players;
  }
  getBoard(): Cell[] {
    return this.board;
  }
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex;
  }
  removePlayer(playerId: number): void {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].getId() === playerId) {
        this.players.splice(i, 1);
        return;
      }
    }

    throw new Error("Player not found");
  }
  nextPlayer(): void {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }
  setDiceValue(diceValue: Pair): void {
    if (
      diceValue.diceOne < 0 ||
      diceValue.diceOne > 6 ||
      diceValue.diceTwo < 0 ||
      diceValue.diceTwo > 6
    ) {
      throw new Error("Invalid dice value.");
    }
    this.diceValue = diceValue;
  }
  setDiceRolled(diceRolled: boolean): void {
    this.diceRolled = diceRolled;
  }
  //TODO: Figure out what to do with this method
  handleCellAction(): void {
    const cell: Cell = this.board[this.getCurrentPlayer().getPosition()];
    const cellType: CellType = cell.actionType;

    switch (cellType) {
      case "START":
        this.getCurrentPlayer().addBalance(Finances.PASS_MONEY);
        break;
      case "PROPERTY":
        if (!cell.deed?.getOwnerId()) {
          this.modalOpen = true;
          // this.modalContent = {
          //   title: "auction",
          //   content: { ...cell.deed },
          // };
        } else if (
          cell.deed!.getOwnerId() !== this.getCurrentPlayer().getId()
        ) {
          this.getCurrentPlayer().addBalance(-cell.deed!.getPrice());

          // if (this.getCurrentPlayer().isBankrupt()) {
          //   this.modalOpen = true;
          //   this.modalContent = {
          //     title: "bankruptcy",
          //     ...this.getCurrentPlayer().getDeeds(),
          //   };
          // }
        }
        break;
      case "STABLES":
        //TODO: Add stables actions
        break;
      case "UTILITY":
        //TODO: Add utility actions
        break;
      case "CHANCE":
        const randomCard: ModalContent = getRandomChanceCard();
        this.modalOpen = true;
        this.modalContent = {
          title: randomCard.title,
          content: randomCard.content,
        };
        break;
      case "COMMUNITY":
        const randomCommunityCard: ModalContent = getRandomCommunityChestCard();
        this.modalOpen = true;
        this.modalContent = {
          title: randomCommunityCard.title,
          content: randomCommunityCard.content,
        };
        break;
      // case "incomeTax":
      //   this.modalOpen = true;
      //   this.modalContent = {
      //     title: "incomeTax",
      //     const_amount: Finances.INCOME_TAX_FEE,
      //     variable_amount: this.getCurrentPlayer().getTotalBalance() * 0.1,
      //   };
      //   break;
      case "JAIL":
        break;
      case "LODGING":
        break;
      case "GO_TO_JAIL":
        this.getCurrentPlayer().goToJail();
        break;
      case "LUXURY_TAX":
        this.getCurrentPlayer().addBalance(-Finances.LUXURY_TAX_FEE);
        break;
      default:
        throw new Error("Invalid cell type.");
    }
  }
  //TODO: Add functionality for different game modes
  endGame(): void {
    if (!this.checkGameOver()) {
      throw new Error("Game cannot be ended: not enough players bankrupt.");
    }
    this.gameEnded = true;
    this.gameStarted = false;
  }
  checkGameOver(): boolean {
    return this.players.filter((player) => !player.isBankrupt()).length <= 1;
  }
  rollDice(): void {
    if (this.diceRolled) {
      throw new Error("Dice already rolled this turn.");
    }
    this.diceValue.diceOne = Math.floor(Math.random() * 6) + 1;
    this.diceValue.diceTwo = Math.floor(Math.random() * 6) + 1;
    this.diceRolled = true;
  }
  resetDice(): void {
    this.diceRolled = false;
    this.diceValue = { diceOne: 0, diceTwo: 0 };
  }
  rolledDoubles(): boolean {
    if (this.diceValue.diceOne === 0 && this.diceValue.diceTwo === 0)
      return false;
    return this.diceValue.diceOne === this.diceValue.diceTwo;
  }
  openModal(content: ModalContent): void {
    this.modalOpen = true;
    this.modalContent = content;
  }
  closeModal(): void {
    this.modalOpen = false;
    this.modalContent = null;
  }
  drawCard(card: ModalContent): void {
    if (this.pendingDrawCard) {
      throw new Error("A card is already being drawn.");
    }
    this.pendingDrawCard = true;
    this.openModal(card);
  }
  endDrawCard(): void {
    this.pendingDrawCard = false;
    this.closeModal();
  }
}
