import {
  PROPERTY_DEEDS,
  STABLES_DEEDS,
  UTILITIES_DEEDS,
} from "../../utils/constants";
import { isPropertyDeed } from "../../utils/helpers";
import type { ModalContent } from "../../utils/interfaces";
import type {
  Asset,
  ChanceCard,
  CommunityChestCard,
  DeedType,
} from "../../utils/types";
import type { BasicDeed } from "../abstract/basicDeed";
import { CardHandler } from "./cardHandler";
import type { Player } from "../concrete/player";
import type { PropertyDeed } from "../concrete/propertyDeed";
import type { StablesDeed } from "../concrete/stablesDeed";
import type { UtilityDeed } from "../concrete/utilityDeed";

//ModalCreator and ModalType are co-dependant
export class ModalCreator {
  public static CHANCE_MODAL(): ModalContent {
    const chanceCard: ChanceCard = CardHandler.getRandomChanceCard();

    return {
      title: "CHANCE",
      content: chanceCard,
    };
  }
  public static COMMUNITY_MODAL(): ModalContent {
    const communityChestCard: CommunityChestCard =
      CardHandler.getRandomCommunityChestCard();

    return {
      title: "COMMUNITY",
      content: communityChestCard,
    };
  }
  public static DEED_MODAL(player: Player): ModalContent {
    return {
      title: "DEED",
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
  public static DEED_PROPERTIES_MODAL(
    propertyDeeds: PropertyDeed[]
  ): ModalContent {
    return {
      title: "DEED_PROPERTIES",
      content: {
        deeds: propertyDeeds,
      },
    };
  }
  public static DEED_OTHER_MODAL(
    otherDeeds: UtilityDeed[] | StablesDeed[]
  ): ModalContent {
    return {
      title: "DEED_OTHER",
      content: {
        deeds: otherDeeds,
      },
    };
  }
  public static TRADE_MODAL(
    curPlayer: Player,
    tradePlayer: Player
  ): ModalContent {
    return {
      title: "TRADE",
      content: {
        curPlayer: curPlayer,
        tradePlayer: tradePlayer,
      },
    };
  }
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
  public static SELL_DEED_MODAL(player: Player): ModalContent {
    return {
      title: "SELL_DEED",
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
  public static SELL_DEED_PROPERTIES_MODAL(
    propertyDeeds: PropertyDeed[]
  ): ModalContent {
    return {
      title: "DEED_PROPERTIES",
      content: {
        deeds: propertyDeeds,
      },
    };
  }
  public static SELL_DEED_OTHER_MODAL(
    otherDeeds: UtilityDeed[] | StablesDeed[]
  ): ModalContent {
    return {
      title: "DEED_OTHER",
      content: {
        deeds: otherDeeds,
      },
    };
  }
  public static SELL_ASSETS_MODAL(type: Asset): ModalContent {
    return {
      title: "SELL_ASSETS",
      content: {
        type: type,
      },
    };
  }
  public static MORTGAGE_MODAL(
    mortgage: PropertyDeed | StablesDeed | UtilityDeed
  ): ModalContent {
    return {
      title: "MORTGAGE",
      content: {
        mortgage: mortgage,
      },
    };
  }
  public static BANKRUPTCY_MODAL(playerName: string): ModalContent {
    return {
      title: "BANKRUPTCY",
      content: {
        playerName: playerName,
      },
    };
  }
  public static INCOME_TAX_MODAL(): ModalContent {
    return {
      title: "INCOME_TAX",
      content: null,
    };
  }
  public static LUXURY_TAX_MODAL(): ModalContent {
    return {
      title: "LUXURY_TAX",
      content: null,
    };
  }
}
