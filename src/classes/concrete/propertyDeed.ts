import { REGIONS } from "../../utils/constants";
import type {
  SerializedDeed,
  SerializedPropertyDeed,
} from "../../utils/interfaces";
import { BasicDeed } from "../abstract/basicDeed";
import type { Serializable } from "../abstract/serializable";
import type { Player } from "./player";

export class PropertyDeed extends BasicDeed<"PROPERTY"> {
  private region: string;
  private houseCost: number;
  private castleCost: number;
  private numberOfHouses: number;
  private numberOfCastles: number;

  protected readonly type = "PROPERTY";
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
  serialize(): void {
    const retrievedData: string | null = localStorage.getItem("deeds");
    let deeds: SerializedDeed[] = [];

    if (retrievedData !== null) {
      deeds = JSON.parse(retrievedData);
    }

    const serializedPropertyDeed: SerializedPropertyDeed = {
      id: this.id,
      ownerId: this.ownerId,
      mortgaged: this.mortgaged,
      type: this.type,
      numberOfHouses: this.numberOfHouses,
      numberOfCastles: this.numberOfCastles,
    };

    deeds.push(serializedPropertyDeed);

    localStorage.setItem("deeds", JSON.stringify(deeds));
  }
  deserialize(): PropertyDeed | undefined {
    const retrievedData: string | null = localStorage.getItem("deeds");

    if (!retrievedData) return undefined;

    let deeds: SerializedDeed[] = JSON.parse(retrievedData);

    for (let deed of deeds) {
      if (deed.id === this.id && deed.type === this.type) {
        this.ownerId = deed.ownerId;
        this.mortgaged = deed.mortgaged;
        this.numberOfHouses = (deed as SerializedPropertyDeed).numberOfHouses;
        this.numberOfCastles = (deed as SerializedPropertyDeed).numberOfCastles;

        return this;
      }
    }

    return undefined;
  }
}
