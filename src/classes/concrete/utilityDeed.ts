import { Finances } from "../../utils/enums";
import { BasicDeed } from "../abstract/basicDeed";
import type { Serializable } from "../abstract/serializable";
import type { Player } from "./player";

export class UtilityDeed extends BasicDeed<"UTILITY"> {
  protected readonly type = "UTILITY";

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
  serialize(): void {
    super.serialize();
  }
  deserialize(): Serializable {
    return super.deserialize();
  }
}
