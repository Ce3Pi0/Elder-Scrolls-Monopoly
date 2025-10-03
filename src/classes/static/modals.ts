import {
  PROPERTY_DEEDS,
  STABLES_DEEDS,
  UTILITIES_DEEDS,
} from "../../utils/constants";
import { isPropertyDeed } from "../../utils/helpers";
import type { ModalContent } from "../../utils/interfaces";
import type { DeedType } from "../../utils/types";
import type { BasicDeed } from "../abstract/basicDeed";
import type { Player } from "../concrete/player";
import type { PropertyDeed } from "../concrete/propertyDeed";
import type { StablesDeed } from "../concrete/stablesDeed";
import type { UtilityDeed } from "../concrete/utilityDeed";

export class Modals {
  public static AUCTION_MODAL<T extends DeedType>(
    deed: BasicDeed<T>
  ): ModalContent {
    const auctionModalContent: ModalContent = {
      title: "AUCTION",
      content: {
        deed: {
          name: deed.getDeedName(),
          region: null,
          rent: deed.getRent(),
          mortgageValue: deed.getMortgageValue(),
          houseCost: null,
        },
      },
    };

    if (isPropertyDeed(deed) && "deed" in auctionModalContent.content) {
      (auctionModalContent.content.deed.region = deed.getRegion()),
        (auctionModalContent.content.deed.houseCost = deed.getHouseCost());
    }

    return auctionModalContent;
  }
  public static INCOME_TAX_MODAL(): ModalContent {
    return {
      title: "INCOME_TAX",
      content: null,
    };
  }

  public static SELL_MODAL(player: Player): ModalContent {
    return {
      title: "SELL_ASSETS",
      content: {
        player: {
          name: player.getName(),
          icon: player.getIcon(),
          balance: player.getBalance(),
        },
        getOutOfJailFreeCardsCount: player.getGetOutOfJailFreeCardsCount(),
        deeds: {
          propertyDeeds: PROPERTY_DEEDS.filter(
            (deed: PropertyDeed) => deed.getOwnerId() === player.getId()
          ),
          stablesDeeds: STABLES_DEEDS.filter(
            (deed: StablesDeed) => deed.getOwnerId() === player.getId()
          ),
          utilityDeeds: UTILITIES_DEEDS.filter(
            (deed: UtilityDeed) => deed.getOwnerId() === player.getId()
          ),
        },
      },
    };
  }
}
