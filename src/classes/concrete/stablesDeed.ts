import { Finances } from "../../utils/enums";
import type { SerializedDeed } from "../../utils/interfaces";
import { BasicDeed } from "../abstract/basicDeed";
import type { Serializable } from "../abstract/serializable";
import type { Player } from "./player";

export class StablesDeed extends BasicDeed<"STABLES"> {
  protected readonly type = "STABLES";
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

  serialize(): void {
    super.serialize();
  }
  deserialize(): Serializable {
    return super.deserialize();
  }
}
