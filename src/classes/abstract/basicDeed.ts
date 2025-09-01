import type { Player } from "../concrete/player";
import { Serializable } from "./serializable";

export abstract class BasicDeed extends Serializable {
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
    super();

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
