import {
  GET_OUT_OF_JAIL_FREE_CARDS_COUNT,
  MAX_JAIL_TURNS,
  PLAYER_COLORS,
  PLAYER_ICONS,
  TOTAL_DEEDS,
} from "../../utils/constants";
import { Finances, Positions } from "../../utils/enums";
import {
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
  returnGetOutOfJailCard,
} from "../../utils/helpers";
import type { GetOutOfJailCardType } from "../../utils/types";
import { BasicDeed } from "../abstract/basicDeed";
import { Serializable } from "../abstract/serializable";
import { PropertyDeed } from "./propertyDeed";
import { StablesDeed } from "./stablesDeed";
import { UtilityDeed } from "./utilityDeed";

export class Player extends Serializable {
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
    super();

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
      if (this.jailTurns >= MAX_JAIL_TURNS) this.releaseFromJail();
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
  //TODO: Implement logic
  serialize(): void {}
  //TODO: Implement logic
  deserialize(): void {}
}
