import {
  BOARD_ARRAY,
  DEFAULT_PLAYER_COLOR,
  DEFAULT_PLAYER_ICON,
  DEFAULT_PLAYER_NAME,
  DEFAULT_SETTINGS,
} from "../../utils/constants";
import { Dice } from "./dice";
import { Game } from "./game";
import { Player } from "./player";

class GameDeserializer {
  private static _instance: GameDeserializer | null = null;

  private constructor() {}

  public static get instance(): GameDeserializer {
    if (!GameDeserializer._instance) {
      GameDeserializer._instance = new GameDeserializer();
    }

    return GameDeserializer._instance;
  }
  public deserializeData(): Game {
    let game = new Game([], DEFAULT_SETTINGS, BOARD_ARRAY);
    game = game.deserialize();
    return game;
  }

  public deserializePlayer(playerId: number): Player {
    let player = new Player(
      playerId,
      DEFAULT_PLAYER_NAME,
      DEFAULT_PLAYER_COLOR,
      DEFAULT_PLAYER_ICON
    );
    player = player.deserialize();

    if (!player) throw new Error("Player deserialization error!");

    return player;
  }

  public deserializeDice(): Dice {
    let dice = new Dice();
    dice = dice.deserialize();

    if (!dice) throw new Error("Dice deserialization error!");

    return dice;
  }
}

export const GameDeserializerSingleton: GameDeserializer =
  GameDeserializer.instance;
