import chanceCardsJson from "../../data/chanceCards.json";
import communityChestCardsJson from "../../data/communityChestCards.json";
import type {
  ChanceCard,
  CommunityChestCard,
  GetOutOfJailCardType,
} from "../../utils/types";

export class CardHandler {
  private static CHANCE_CARDS: ChanceCard[] =
    chanceCardsJson.chanceCards as ChanceCard[];

  private static COMMUNITY_CHEST_CARDS: CommunityChestCard[] =
    communityChestCardsJson.communityChestCards as CommunityChestCard[];

  private static drawnChanceGetOutOfJailCard: boolean = false;
  private static drawnCommunityChestGetOutOfJailCard: boolean = false;
  public static getChanceCards(): ChanceCard[] {
    return CardHandler.CHANCE_CARDS;
  }
  public static getCommunityChestCards(): CommunityChestCard[] {
    return CardHandler.COMMUNITY_CHEST_CARDS;
  }
  public static getRandomChanceCard(): ChanceCard {
    if (!CardHandler.drawnChanceGetOutOfJailCard) {
      const card: ChanceCard =
        CardHandler.CHANCE_CARDS[
          Math.trunc(Math.random() * CardHandler.CHANCE_CARDS.length) + 1
        ];
      return card;
    }

    //Avoid the last index because that is the one with the get out of JAIL card
    const card: ChanceCard =
      CardHandler.CHANCE_CARDS[
        Math.trunc(Math.random() * CardHandler.CHANCE_CARDS.length)
      ];

    return card;
  }
  public static getRandomCommunityChestCard = (): CommunityChestCard => {
    if (!CardHandler.drawnCommunityChestGetOutOfJailCard) {
      const card: CommunityChestCard =
        CardHandler.COMMUNITY_CHEST_CARDS[
          Math.trunc(Math.random() * CardHandler.COMMUNITY_CHEST_CARDS.length) +
            1
        ];
      return card;
    }

    //Avoid the last index because that is the one with the get out of JAIL card
    const card: CommunityChestCard =
      CardHandler.COMMUNITY_CHEST_CARDS[
        Math.trunc(Math.random() * CardHandler.COMMUNITY_CHEST_CARDS.length)
      ];

    return card;
  };
  public static returnGetOutOfJailCard = (type: GetOutOfJailCardType): void => {
    if (type === "CHANCE") {
      CardHandler.drawnChanceGetOutOfJailCard = true;
    } else {
      CardHandler.drawnCommunityChestGetOutOfJailCard = true;
    }
  };
}
