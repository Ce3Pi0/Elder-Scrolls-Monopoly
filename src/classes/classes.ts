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
  //  Finances,
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
  Positions,
  type CellType,
} from "../utils/utils";

// TODO: Move to a separate file
enum Finances {
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
  INCOME_TAX_FEE = 200,
  LUXURY_TAX_FEE = 150,
  JAIL_FEE = 50,
}

export abstract class BasicDeed {
  protected id: number;
  protected owner: Player | null = null;
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
  getOwner(): Player | null {
    return this.owner;
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
  setOwner(owner: Player | null): void {
    this.owner = owner;
  }
  canMortgage(player: Player): boolean {
    return this.owner === player && !this.isMortgaged;
  }
  canUnmortgage(player: Player): boolean {
    return (
      this.owner === player &&
      this.mortgaged &&
      player.getBalance() >= this.mortgageValue + this.price * 0.1
    );
  }
  isMortgaged(): boolean {
    return this.mortgaged;
  }
  mortgage(): void {
    if (this.canMortgage(this.owner!)) {
      this.mortgaged = true;
      this.owner!.addBalance(this.mortgageValue); // Adding mortgage value to owner's balance
    } else {
      throw new Error("Cannot mortgage: conditions not met.");
    }
  }
  unmortgage(): void {
    if (this.canUnmortgage(this.owner!)) {
      this.mortgaged = false;
      this.owner!.addBalance(-(this.mortgageValue + this.price * 0.1)); // 10% interest
    } else {
      throw new Error("Cannot unmortgage: conditions not met.");
    }
  }
  abstract getRent(): number;
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
    cloned.setOwner(this.getOwner());
    if (this.mortgaged) cloned.mortgage();

    return cloned;
  }
  getRent(): number {
    if (!this.getOwner()) return 0;
    return this.rent[this.getOwner()!.getOwnedUtilities() - 1];
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
    const cloned = new UtilityDeed(
      this.id,
      this.deedName,
      this.price,
      [...this.rent],
      this.mortgageValue
    );
    cloned.setOwner(this.getOwner());
    if (this.mortgaged) cloned.mortgage();

    return cloned;
  }
  getRent(): number {
    if (!this.getOwner()) return 0;
    return this.rent[this.getOwner()!.getOwnedStables() - 1];
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

    cloned.setOwner(this.getOwner());
    cloned.setNumberOfHouses(this.numberOfHouses);
    cloned.setNumberOfCastles(this.numberOfCastles);
    if (this.mortgaged) cloned.mortgage();

    return cloned;
  }
  getRegion(): string {
    return this.region;
  }
  getRent(): number {
    if (this.numberOfHouses === 0 && this.numberOfCastles === 0) {
      if (this.getOwner()!.regionOwned(this.region)) return 2 * this.rent[0];
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
  setNumberOfHouses(numberOfHouses: number): void {
    if (numberOfHouses < 0 || numberOfHouses > 4) {
      throw new Error("Invalid number of houses");
    }
    this.numberOfHouses = numberOfHouses;
  }
  setNumberOfCastles(numberOfCastles: number): void {
    if (numberOfCastles < 0 || numberOfCastles > 4) {
      throw new Error("Invalid number of castles");
    }
    this.numberOfCastles = numberOfCastles;
  }
  private canBuildHouse(): boolean {
    return (
      this.numberOfHouses < 4 &&
      this.owner !== null &&
      this.owner.getBalance() >= this.houseCost
    );
  }
  private canBuildCastle(): boolean {
    return (
      this.numberOfCastles < 4 &&
      this.owner !== null &&
      this.owner.getBalance() >= this.castleCost
    );
  }
  buildHouse(): void {
    if (this.canBuildHouse()) {
      this.numberOfHouses++;
      this.owner!.addBalance(-this.houseCost); // Deducting cost from owner's balance
    } else {
      throw new Error("Cannot build house: conditions not met.");
    }
  }
  buildCastle(): void {
    if (this.canBuildCastle()) {
      this.numberOfCastles++;
      this.owner!.addBalance(-this.castleCost); // Deducting cost from owner's balance
    } else {
      throw new Error("Cannot build castle: conditions not met.");
    }
  }
  private canSellHouse(): boolean {
    return (
      this.numberOfHouses > 0 &&
      this.numberOfCastles === 0 &&
      this.owner !== null &&
      this.owner.getBalance() <= 0
    );
  }
  private canSellCastle(): boolean {
    return (
      this.numberOfCastles > 0 &&
      this.owner !== null &&
      this.owner.getBalance() <= 0
    );
  }
  sellHouse(): void {
    if (this.canSellHouse()) {
      this.numberOfHouses--;
      this.owner!.addBalance(this.houseCost * 0.5); // Selling at half price
    } else {
      throw new Error("Cannot sell house: conditions not met.");
    }
  }
  sellCastle(): void {
    if (this.canSellCastle()) {
      this.numberOfCastles--;
      this.owner!.addBalance(this.castleCost * 0.5); // Selling at half price
    } else {
      throw new Error("Cannot sell castle: conditions not met.");
    }
  }
  canMortgage(player: Player): boolean {
    return (
      this.owner === player &&
      this.owner.getBalance() < 0 &&
      this.getNumberOfHouses() === 0 &&
      this.getNumberOfCastles() === 0
    );
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
  private getOutOfJailCards: number = 0;
  private bankrupt: boolean = false;

  constructor(id: number, name: string, color: number, icon: number) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.icon = icon;
  }
  clone(): Player {
    const cloned = new Player(this.id, this.name, this.color, this.icon);

    cloned.balance = this.balance;
    cloned.position = this.position;
    cloned.inJail = this.inJail;
    cloned.jailTurns = this.jailTurns;
    cloned.bankrupt = this.bankrupt;
    cloned.getOutOfJailCards = this.getOutOfJailCards;

    cloned.deeds = this.deeds.flatMap((d) =>
      isPropertyDeed(d) || isUtilityDeed(d) || isStablesDeed(d)
        ? [d.clone()]
        : []
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
        let houseVal = 0,
          castleVal = 0;
        if (isPropertyDeed(deed)) {
          houseVal = deed.getNumberOfHouses() * deed.getHouseCost();
          castleVal = deed.getNumberOfCastles() * deed.getCastleCost();
        }
        return houseVal + castleVal + acc + deed.getPrice();
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
  getGetOutOfJailCards(): number {
    return this.getOutOfJailCards;
  }
  setPosition(position: number): void {
    if (position < Positions.START || position > Positions.END) {
      throw new Error(
        `Invalid position: must be between ${Positions.START} and ${Positions.END}.`
      );
    }
    if (position <= this.position) this.addBalance(Finances.PASS_MONEY);
    while (this.position !== position) {
      this.position++;
      if (this.position === Positions.END) this.position = Positions.START;
    }
  }
  setBalance(balance: number): void {
    this.balance = balance;
  }
  goToJail(): void {
    this.inJail = true;
    this.jailTurns = 0;
    this.position = Positions.JAIL; // Jail position
  }
  useGetOutOfJailCard(): void {
    if (this.getOutOfJailCards > 0) {
      this.getOutOfJailCards--;
      this.inJail = false;
      this.jailTurns = 0;
    } else {
      throw new Error("No Get Out of Jail cards available.");
    }
  }
  releaseFromJail(): void {
    if (this.inJail && this.jailTurns >= this.MAX_JAIL_TURNS) {
      this.inJail = false;
      this.jailTurns = 0;
    } else {
      throw new Error("Player is not in jail.");
    }
  }
  payReleaseFromJail(): void {
    if (this.inJail) {
      if (this.balance >= 50) {
        this.balance -= Finances.JAIL_FEE; // Pay $50 to get out of jail
        this.inJail = false;
        this.jailTurns = 0;
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
      if (this.jailTurns >= this.MAX_JAIL_TURNS) {
        this.releaseFromJail(); // Automatically release after 3 turns
      }
    }
  }
  addDeed(deed: BasicDeed): void {
    if (this.deeds.some((d) => d.getId() === deed.getId())) {
      throw new Error("PropertyDeed already owned by this player.");
    }
    this.deeds.push(deed);
    deed.setOwner(this);
  }
  removeDeed(deed: BasicDeed): void {
    const index = this.deeds.findIndex((d) => d.getId() === deed.getId());
    if (index === -1) {
      throw new Error("PropertyDeed not owned by this player.");
    }
    deed.setOwner(null);
    this.deeds.splice(index, 1);
  }
  addBalance(amount: number): void {
    this.balance += amount;
    if (this.balance < 0) this.bankrupt = true;
  }
  canAfford(amount: number): boolean {
    return this.balance >= amount;
  }
  declareBankruptcy(): void {
    this.bankrupt = true;
    this.balance = 0;
    this.deeds.forEach((deed) => {
      if (isPropertyDeed(deed)) {
        deed.setNumberOfCastles(0);
        deed.setNumberOfHouses(0);
      }
      deed.setOwner(null);
    });
    this.deeds = [];
  }
  hasDeed(deed: PropertyDeed): boolean {
    return this.deeds.some((d) => d.getId() === deed.getId());
  }
  hasGetOutOfJailCard(): boolean {
    return this.getOutOfJailCards > 0;
  }
  addGetOutOfJailCard(): void {
    this.getOutOfJailCards++;
  }
  removeGetOutOfJailCard(): void {
    if (this.getOutOfJailCards > 0) {
      this.getOutOfJailCards--;
    } else {
      throw new Error("No Get Out of Jail cards to remove.");
    }
  }
  getOwnedUtilities(): number {
    return this.deeds.filter(isUtilityDeed).length;
  }
  getOwnedStables(): number {
    return this.deeds.filter(isStablesDeed).length;
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
  private gameStarted: boolean = false;
  private gameEnded: boolean = true;
  private board: Cell[] = [];
  private currentPlayerIndex: number = 0;
  private diceRolled: boolean = false;
  private diceValue: Pair = { diceOne: 0, diceTwo: 0 };
  private doublesCounter: number = 0;
  private modalOpen: boolean = false;
  private modalContent: Object | null = null;
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
    clonedGame.modalOpen = this.modalOpen;
    clonedGame.modalContent = this.modalContent
      ? structuredClone(this.modalContent)
      : null;
    clonedGame.pendingDrawCard = this.pendingDrawCard;

    // Re-link deed ownership references
    clonedPlayers.forEach((player) => {
      player.getDeeds().forEach((deed: BasicDeed) => deed.setOwner(player));
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
  isModalOpen(): boolean {
    return this.modalOpen;
  }
  getModalContent(): Object | null {
    return this.modalContent;
  }
  isPendingDrawCard(): boolean {
    return this.pendingDrawCard;
  }
  changePlayerOrder(players: Player[]): void {
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
  setDoublesCounter(count: number): void {
    this.doublesCounter = count;
  }
  getPlayers(): Player[] {
    return this.players;
  }
  setCurrentPlayerIndex(index: number): void {
    if (!this.gameStarted) return;

    if (index < 0 || index >= this.players.length) {
      throw new Error("Invalid player index.");
    }
    this.currentPlayerIndex = index;
  }
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  addPlayer(player: Player): void {
    this.players.push(player);
  }
  updatePlayer(playerData: PlayerData): void {
    if (playerData === undefined || playerData === null) {
      return;
    }
    let index: number = -1;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].getId() === playerData.id) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.players[index] = new Player(
        playerData.id,
        playerData.name,
        playerData.color,
        playerData.icon
      );
    }
  }
  removePlayer(player: Player): void {
    if (player === undefined || player === null) {
      return;
    }
    let index: number = -1;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].getId() === player.getId()) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }
  getPlayerById(id: number): Player | undefined {
    return this.players.find((player) => player.getId() === id);
  }
  nextPlayer(): void {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }
  setDiceValue(diceValue: Pair): void {
    if (!this.diceRolled) return;

    if (
      diceValue.diceOne < 1 ||
      diceValue.diceOne > 6 ||
      diceValue.diceTwo < 1 ||
      diceValue.diceTwo > 6
    ) {
      throw new Error("Invalid dice value.");
    }
    this.diceValue = diceValue;
  }
  setDiceRolled(diceRolled: boolean): void {
    this.diceRolled = diceRolled;
  }
  setGameStarted(gameStarted: boolean): void {
    this.gameStarted = gameStarted;
  }
  setGameEnded(gameEnded: boolean): void {
    this.gameEnded = gameEnded;
  }
  setModalOpen(modalOpen: boolean): void {
    this.modalOpen = modalOpen;
  }
  setModalContent(modalContent: Object | null): void {
    this.modalContent = modalContent;
  }
  setPendingDrawCard(pendingDrawCard: boolean): void {
    this.pendingDrawCard = pendingDrawCard;
  }
  handleCellAction(): void {
    const cell: Cell = this.board[this.getCurrentPlayer().getPosition()];
    const cellType: CellType = cell.actionType;

    switch (cellType) {
      case "start":
        this.getCurrentPlayer().addBalance(Finances.PASS_MONEY);
        break;
      case "property":
        if (!cell.deed?.getOwner()) {
          this.modalOpen = true;
          this.modalContent = {
            title: "Purchase Modal",
            ...cell.deed,
          };
        } else if (cell.deed.getOwner() !== this.getCurrentPlayer()) {
          this.getCurrentPlayer().addBalance(-cell.deed.getPrice());

          if (this.getCurrentPlayer().isBankrupt()) {
            this.modalOpen = true;
            this.modalContent = {
              title: "Bankruptcy Modal",
              ...this.getCurrentPlayer().getDeeds(),
            };
          }
        }
        break;
      case "chance":
        const randomCard: ModalContent = getRandomChanceCard();
        this.modalOpen = true;
        this.modalContent = {
          title: randomCard.title,
          content: randomCard.content,
        };
        break;
      case "community":
        const randomCommunityCard: ModalContent = getRandomCommunityChestCard();
        this.modalOpen = true;
        this.modalContent = {
          title: randomCommunityCard.title,
          content: randomCommunityCard.content,
        };
        break;
      case "incomeTax":
        this.modalOpen = true;
        this.modalContent = {
          title: "Income Tax Modal",
          const_amount: Finances.INCOME_TAX_FEE,
          variable_amount: this.getCurrentPlayer().getTotalBalance() * 0.1,
        };
        break;
      case "jail":
        break;
      case "lodging":
        break;
      case "goToJail":
        this.getCurrentPlayer().goToJail();
        break;
      case "luxuryTax":
        this.getCurrentPlayer().addBalance(-Finances.LUXURY_TAX_FEE);
        break;
      default:
        throw new Error("Invalid cell type.");
    }
  }
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
  rollDice(): Pair {
    if (this.diceRolled) {
      throw new Error("Dice already rolled this turn.");
    }
    this.diceValue.diceOne = Math.floor(Math.random() * 6) + 1;
    this.diceValue.diceTwo = Math.floor(Math.random() * 6) + 1;
    this.diceRolled = true;
    return this.diceValue;
  }
  resetDice(): void {
    this.diceRolled = false;
    this.diceValue = { diceOne: 0, diceTwo: 0 };
  }
  rolledDoubles(): boolean {
    return this.diceValue.diceOne === this.diceValue.diceTwo;
  }
  openModal(content: Object): void {
    this.modalOpen = true;
    this.modalContent = content;
  }
  closeModal(): void {
    this.modalOpen = false;
    this.modalContent = null;
  }
  drawCard(card: Object): void {
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
