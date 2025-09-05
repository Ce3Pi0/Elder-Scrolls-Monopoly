import type { SerializedDeed } from "../../utils/interfaces";
import type { DeedType } from "../../utils/types";
import type { Player } from "../concrete/player";
import { Serializable } from "./serializable";

export abstract class BasicDeed<T extends DeedType> extends Serializable {
  protected id: number;
  protected ownerId: number | null;
  protected deedName: string;
  protected price: number;
  protected rent: number[];
  protected mortgageValue: number;
  protected mortgaged: boolean;

  protected abstract readonly type: T;

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
  abstract clone(): BasicDeed<T>;
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
  serialize(): void {
    const retrievedData: string | null = localStorage.getItem("deeds");
    let deeds: SerializedDeed[] = [];

    if (retrievedData !== null) {
      deeds = JSON.parse(retrievedData);
    }

    const serializedDeed: SerializedDeed = {
      id: this.id,
      ownerId: this.ownerId,
      mortgaged: this.mortgaged,
      type: this.type,
    };

    deeds.push(serializedDeed);

    localStorage.setItem("deeds", JSON.stringify(deeds));
  }

  deserialize(): Serializable | undefined {
    const retrievedData: string | null = localStorage.getItem("deeds");

    if (!retrievedData) return undefined;

    let deeds: SerializedDeed[] = JSON.parse(retrievedData);

    for (let deed of deeds) {
      if (deed.id === this.id && deed.type === this.type) {
        this.ownerId = deed.ownerId;
        this.mortgaged = deed.mortgaged;

        return this;
      }
    }

    return undefined;
  }
  abstract getRentOwed(owner: Player): number;
}
