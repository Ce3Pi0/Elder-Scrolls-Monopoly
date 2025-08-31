import type {
  Cell,
  GameType,
  ModalContent,
  Pair,
  PlayerData,
} from "../interfaces/interfaces";
import {
  getRandomChanceCard,
  getRandomCommunityChestCard,
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
  PLAYER_COLORS,
  PLAYER_ICONS,
  REGIONS,
  returnGetOutOfJailCard,
} from "../utils/utils";
import type { CellType, EventType, GetOutOfJailCardType } from "../utils/types";
import { Finances, Positions } from "../utils/enums";

export abstract class BasicDeed {
  protected id: number;
  protected ownerId: number | null = null;
  protected deedName: string;
  protected price: number;
  protected rent: number[];
  protected mortgageValue: number;
  protected mortgaged: boolean = false;

  constructor(
    id: number,
    deedName: string,
    price: number,
    rent: number[],
    mortgageValue: number
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
    mortgageValue: number = Finances.UTILITY_PRICE / 2
  ) {
    super(id, deedName, price, rent, mortgageValue);
  }
  clone(): UtilityDeed {
    const cloned = new UtilityDeed(
      this.id,
      this.deedName,
      this.price,
      [...this.rent],
      this.mortgageValue
    );
    cloned.setOwnerId(this.getOwnerId());
    if (this.mortgaged) cloned.mortgage();

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
    mortgageValue: number = Finances.STABLES_PRICE / 2
  ) {
    super(id, deedName, price, rent, mortgageValue);
  }
  clone(): StablesDeed {
    const cloned = new StablesDeed(
      this.id,
      this.deedName,
      this.price,
      [...this.rent],
      this.mortgageValue
    );
    cloned.setOwnerId(this.getOwnerId());
    if (this.mortgaged) cloned.mortgage();

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
  private numberOfHouses: number = 0;
  private numberOfCastles: number = 0;
  constructor(
    id: number,
    region: string,
    deedName: string,
    price: number,
    rent: number[],
    houseCost: number,
    castleCost: number,
    mortgageValue: number
  ) {
    super(id, deedName, price, rent, mortgageValue);
    if (houseCost < 0) throw new Error("Houses cannot cost negative values");
    if (castleCost < 0) throw new Error("Castles cannot cost negative values");
    if (REGIONS.includes(this.region) === undefined)
      throw new Error("Invalid region");

    this.region = region;
    this.deedName = deedName;
    this.houseCost = houseCost;
    this.castleCost = castleCost;
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

  constructor(id: number, name: string, color: number, icon: number) {
    if (id < 0) throw new Error("Invalid player ID number");
    if (PLAYER_COLORS[color] === undefined)
      throw new Error("Invalid player color");
    if (PLAYER_ICONS[icon] === undefined)
      throw new Error("Invalid player icon");

    this.id = id;
    this.name = name;
    this.color = color;
    this.icon = icon;
  }

  clone(): Player {
    const cloned = new Player(this.id, this.name, this.color, this.icon);

    cloned.position = this.position;
    if (this.inJail) cloned.sendToJail();
    for (let i = 0; i < this.jailTurns; i++) cloned.updateJailTurns();
    if (this.bankrupt) cloned.declareBankruptcy();
    for (let i = 0; i < this.getOutOfJailCards.length; i++)
      cloned.addGetOutOfJailFreeCard(this.getOutOfJailCards[i]);
    for (let i = 0; i < this.deeds.length; i++)
      cloned.addDeed(this.deeds[i].clone());
    cloned.addBalance(this.balance);

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
  private event: EventType | null = null;
  private gameSettings: GameType;
  private gameStarted: boolean = false;
  private gameEnded: boolean = true;
  private board: Cell[] = [];
  private currentPlayerIndex: number = 0;
  private diceRolled: boolean = false;
  private diceValue: Pair = { diceOne: 0, diceTwo: 0 };
  private doublesCounter: number = 0;
  private modalOpen: boolean = false;
  private modalContent: ModalContent | null = null;
  private pendingDrawCard: boolean = false;

  constructor(players: Player[], gameSettings: GameType) {
    this.players = players;
    this.gameSettings = gameSettings;
    this.gameStarted = false; // Game starts when initialized
    this.gameEnded = false; // Game is not ended when initialized
  }
  clone(): Game {
    const clonedPlayers = this.players.map((p) => p.clone());

    const clonedSettings: GameType = { ...this.gameSettings };

    const clonedGame = new Game(clonedPlayers, clonedSettings);

    //FIXME:
    clonedGame.board = this.board.map((cell) => ({
      id: cell.id,
      actionType: cell.actionType,
      deed: cell.deed ? cell.deed.clone() : null,
    }));

    clonedGame.currentPlayerIndex = this.currentPlayerIndex;
    clonedGame.diceRolled = this.diceRolled;
    clonedGame.diceValue = { ...this.diceValue };
    clonedGame.gameStarted = this.gameStarted;
    clonedGame.gameEnded = this.gameEnded;
    clonedGame.event = this.event;
    clonedGame.modalOpen = this.modalOpen;
    clonedGame.modalContent = this.modalContent
      ? structuredClone(this.modalContent)
      : null;
    clonedGame.pendingDrawCard = this.pendingDrawCard;

    // Re-link deed ownership references
    clonedPlayers.forEach((player) => {
      player
        .getDeeds()
        .forEach((deed: BasicDeed) => deed.setOwnerId(player.getId()));
    });

    return clonedGame;
  }
  startGame(board: Cell[]): void {
    this.board = board;
    this.gameStarted = true;
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
  setBoard(board: Cell[]): void {
    this.board = board;
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
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
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
  getBoard(): Cell[] {
    return this.board;
  }
}
