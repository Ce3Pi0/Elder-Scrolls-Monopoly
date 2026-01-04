import {
  ALL_DEEDS,
  MAX_JAIL_TURNS,
  PLAYER_COLORS,
  PLAYER_ICONS,
} from "../../utils/constants";
import { Finances, Positions, Region_Cities_Count } from "../../utils/enums";
import {
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
} from "../../utils/helpers";
import type { SerializedPlayer } from "../../utils/interfaces";
import type { DeedType, GetOutOfJailCardType } from "../../utils/types";
import { BasicDeed } from "../abstract/basicDeed";
import { Serializable } from "../abstract/serializable";
import { CardHandler } from "../static/cardHandler";
import { PropertyDeed } from "./propertyDeed";

export class Player extends Serializable {
  private id: number;
  private name: string;
  private color: number;
  private icon: number;

  private balance: number = Finances.START_MONEY;
  private position: number = 0;
  private inJail: boolean = false;
  private jailTurns: number = 0;
  private deeds: BasicDeed<DeedType>[] = [];
  private getOutOfJailCards: GetOutOfJailCardType[] = [];
  private bankrupt: boolean = false;

  constructor(id: number, name: string, color: number, icon: number) {
    super();

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
  public serialize(): void {
    const retrievedData: string | null = localStorage.getItem("players");
    let players: SerializedPlayer[] = [];

    if (retrievedData !== null) {
      players = JSON.parse(retrievedData);
    }

    const serializedPlayer: SerializedPlayer = {
      id: this.id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      balance: this.balance,
      position: this.position,
      inJail: this.inJail,
      jailTurns: this.jailTurns,
      deeds: this.deeds.map((deed) => deed.getId()),
      getOutOfJailFreeCards: this.getOutOfJailCards,
      bankrupt: this.bankrupt,
    };

    if (!players.some((p) => p.id === this.id)) {
      players.push(serializedPlayer);
    }

    localStorage.setItem("players", JSON.stringify(players));
  }
  public deserialize(): Player | undefined {
    const retrievedData: string | null = localStorage.getItem("players");

    if (!retrievedData) return undefined;

    let players: SerializedPlayer[] = JSON.parse(retrievedData);

    for (let player of players) {
      if (player.id === this.id) {
        this.id = player.id;
        this.name = player.name;
        this.color = player.color;
        this.icon = player.icon;
        this.balance = player.balance;
        this.position = player.position;
        this.inJail = player.inJail;
        this.jailTurns = player.jailTurns;
        const playerDeeds: BasicDeed<DeedType>[] = ALL_DEEDS.filter((deed) =>
          player.deeds.includes(deed.getId())
        );
        for (let deed of playerDeeds) {
          const deserializedDeed = deed.deserialize();
          if (
            deserializedDeed &&
            (isPropertyDeed(deserializedDeed) ||
              isStablesDeed(deserializedDeed) ||
              isUtilityDeed(deserializedDeed))
          ) {
            this.deeds.push(deserializedDeed);
          }
        }
        this.getOutOfJailCards = player.getOutOfJailFreeCards;
        this.bankrupt = player.bankrupt;

        return this;
      }
    }

    return undefined;
  }
  public getId(): number {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getColor(): number {
    return this.color;
  }
  public getIcon(): number {
    return this.icon;
  }
  public getBalance(): number {
    return this.balance;
  }
  public getTotalBalance(): number {
    return (
      this.balance +
      this.deeds.reduce((acc, deed) => {
        if (isPropertyDeed(deed)) return acc + deed.getTotalValue();
        return acc + deed.getPrice();
      }, 0)
    );
  }
  public getPosition(): number {
    return this.position;
  }
  public isInJail(): boolean {
    return this.inJail;
  }
  public getJailTurns(): number {
    return this.jailTurns;
  }
  public setPosition(position: number): void {
    if (position < Positions.START || position > Positions.END) {
      throw new Error(
        `Invalid position: must be larger than ${Positions.START} and less than ${Positions.END}.`
      );
    }
    this.position = position;
  }
  public sendToJail(): void {
    this.inJail = true;
    this.jailTurns = 0;
    this.position = Positions.JAIL;
  }
  public releaseFromJail(): void {
    if (this.inJail) {
      this.inJail = false;
      this.jailTurns = 0;
    } else {
      throw new Error("Player is not in jail.");
    }
  }
  public getGetOutOfJailFreeCardsCount(): number {
    return this.getOutOfJailCards.length;
  }
  public addGetOutOfJailFreeCard(
    getOutOfJailFreeCard: GetOutOfJailCardType
  ): void {
    this.getOutOfJailCards.push(getOutOfJailFreeCard);
  }
  public useGetOutOfJailCard(): void {
    if (this.getOutOfJailCards.length > 0) {
      const card: GetOutOfJailCardType = this.getOutOfJailCards.pop()!;
      CardHandler.returnGetOutOfJailCard(card);
      this.releaseFromJail();
    } else {
      throw new Error("No Get Out of Jail cards available.");
    }
  }
  public payReleaseFromJail(): void {
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
  public updateJailTurns(): void {
    if (this.inJail) {
      this.jailTurns++;
      if (this.jailTurns >= MAX_JAIL_TURNS) this.releaseFromJail();
    } else throw new Error("Player not in jail");
  }
  public addDeed(deed: BasicDeed<DeedType>): void {
    if (this.deeds.some((d) => d.getId() === deed.getId())) {
      throw new Error("PropertyDeed already owned by this player.");
    }
    if (deed.getOwnerId() !== null) throw new Error("Deed already owned");
    deed.setOwnerId(this.id);
    this.deeds.push(deed);
  }
  public removeDeed(deed: BasicDeed<DeedType>): void {
    const index = this.deeds.findIndex((d) => d.getId() === deed.getId());
    if (index === -1) {
      throw new Error("PropertyDeed not owned by this player.");
    }
    deed.setOwnerId(null);
    this.deeds.splice(index, 1);
  }
  public mortgageDeed(deed: BasicDeed<DeedType>): void {
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
  public unMortgageDeed(deed: BasicDeed<DeedType>): void {
    if (deed.getOwnerId() !== this.id)
      throw new Error("Deed not owned by player");

    if (this.balance < deed.getMortgageValue())
      throw new Error("Cannot un-mortgage: too little money");
    this.addBalance(deed.getUnMortgageValue());

    deed.unMortgage();
  }
  public canBuildHouse(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfHouses() < 4 &&
      propertyDeed.getOwnerId() === this.id &&
      this.balance >= propertyDeed.getHouseCost()
    );
  }
  public canBuildCastle(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfCastles() < 4 &&
      propertyDeed.getOwnerId() === this.id &&
      this.balance >= propertyDeed.getCastleCost()
    );
  }
  public numHouses(): number {
    let count: number = 0;
    for (let deed of this.deeds) {
      if (isPropertyDeed(deed)) count += deed.getNumberOfHouses();
    }

    return count;
  }
  public numCastles(): number {
    let count: number = 0;
    for (let deed of this.deeds) {
      if (isPropertyDeed(deed)) count += deed.getNumberOfCastles();
    }

    return count;
  }
  public buildHouse(propertyDeed: PropertyDeed): void {
    if (this.canBuildHouse(propertyDeed)) {
      this.balance -= propertyDeed.getHouseCost();
      propertyDeed.addHouse();
    } else throw new Error("Cannot build house: conditions not met.");
  }
  public buildCastle(propertyDeed: PropertyDeed): void {
    if (this.canBuildCastle(propertyDeed)) {
      this.balance -= propertyDeed.getCastleCost();
      propertyDeed.addCastle();
    } else throw new Error("Cannot build castle: conditions not met.");
  }
  public canSellHouse(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfHouses() > 0 &&
      propertyDeed.getNumberOfCastles() === 0 &&
      propertyDeed.getOwnerId() !== this.id &&
      this.balance <= 0
    );
  }
  public canSellCastle(propertyDeed: PropertyDeed): boolean {
    return (
      propertyDeed.getNumberOfCastles() > 0 &&
      propertyDeed.getOwnerId() !== this.id &&
      this.balance <= 0
    );
  }
  public sellHouse(propertyDeed: PropertyDeed): void {
    if (this.canSellHouse(propertyDeed)) {
      propertyDeed.removeHouse();
      this.balance += propertyDeed.getHouseCost() * 0.5; // Selling at half price
    } else {
      throw new Error("Cannot sell house: conditions not met.");
    }
  }
  public sellCastle(propertyDeed: PropertyDeed): void {
    if (this.canSellCastle(propertyDeed)) {
      propertyDeed.removeCastle();
      this.balance += propertyDeed.getCastleCost() * 0.5; // Selling at half price
    } else {
      throw new Error("Cannot sell castle: conditions not met.");
    }
  }
  public addBalance(amount: number): void {
    this.balance += amount;
    if (this.getTotalBalance() < 0) this.declareBankruptcy();
  }
  public canAfford(amount: number): boolean {
    return this.balance >= amount;
  }
  public declareBankruptcy(): void {
    if (this.bankrupt) throw new Error("Player is already");
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
    while (this.hasGetOutOfJailCard()) {
      this.removeGetOutOfJailCard();
    }
  }
  public hasGetOutOfJailCard(): boolean {
    return this.getOutOfJailCards.length > 0;
  }
  public removeGetOutOfJailCard(): void {
    if (this.getOutOfJailCards.length > 0) {
      const card: GetOutOfJailCardType = this.getOutOfJailCards.pop()!;
      CardHandler.returnGetOutOfJailCard(card);
    } else throw new Error("No Get Out of Jail cards to remove.");
  }
  public getNumOwnedUtilities(): number {
    return this.deeds.filter(isUtilityDeed).length;
  }
  public getNumOwnedStables(): number {
    return this.deeds.filter(isStablesDeed).length;
  }
  public getNumOwnedProperties(): number {
    return this.deeds.filter(isPropertyDeed).length;
  }
  public isBankrupt(): boolean {
    return this.bankrupt;
  }
  public regionOwned(region: string): boolean {
    switch (region) {
      case "Black Marsh":
        return this.countRegion(Region_Cities_Count.BLACK_MARSH, "Black Marsh");
      case "Cyrodiil":
        return this.countRegion(Region_Cities_Count.CYRODIIL, "Cyrodiil");
      case "South Skyrim":
        return this.countRegion(
          Region_Cities_Count.SOUTH_SKYRIM,
          "South Skyrim"
        );
      case "North Skyrim":
        return this.countRegion(
          Region_Cities_Count.NORTH_SKYRIM,
          "North Skyrim"
        );
      case "High Rock":
        return this.countRegion(Region_Cities_Count.HIGH_ROCK, "High Rock");
      case "Morrowind":
        return this.countRegion(Region_Cities_Count.HIGH_ROCK, "Morrowind");
      case "Hammerfell":
        return this.countRegion(Region_Cities_Count.HAMMERFELL, "Hammerfell");
      case "Summerset Isles":
        return this.countRegion(
          Region_Cities_Count.SUMMERSET_ISLES,
          "Summerset Isles"
        );
      default:
        return false;
    }
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
}
