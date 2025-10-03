import type { CellType, Cell, GameSettings, Event } from "../../utils/types";
import type { ModalContent, SerializedGame } from "../../utils/interfaces";

import {
  BOARD_SIZE,
  MAX_JAIL_TURNS,
  MAX_PLAYER_COUNT,
  VALID_GAME_DURATIONS,
} from "../../utils/constants";
import { Finances } from "../../utils/enums";
import {
  getRandomChanceCard,
  getRandomCommunityChestCard,
  isPropertyDeed,
  isStablesDeed,
  isUtilityDeed,
} from "../../utils/helpers";
import { Serializable } from "../abstract/serializable";
import { Player } from "./player";
import { GameDeserializerSingleton } from "./gameDeserializer";
import { Dice } from "./dice";
import eventsSingleton from "./events";
import type { PropertyDeed } from "./propertyDeed";
import { Modals } from "../static/modals";
import type { StablesDeed } from "./stablesDeed";
import type { UtilityDeed } from "./utilityDeed";

export class Game extends Serializable {
  private readonly MOVE_TIMEOUT_MS = 500;

  private players: Player[];
  private gameSettings: GameSettings;
  private gameStarted: boolean;
  private gameEnded: boolean;
  private board: Cell[];
  private event: Event | null = "AWAIT_ROLL_DICE"; //FIXME: Fix for final version
  private currentPlayerIndex: number;
  private dice: Dice;
  private modalOpen: boolean;
  private modalContent: ModalContent | null;
  private pendingDrawCard: boolean;

  constructor(players: Player[], gameSettings: GameSettings, board: Cell[]) {
    super();

    this.setPlayers(players);
    this.setBoard(board);
    this.setSettings(gameSettings);
  }
  public serialize(): void {
    const serializedGame: SerializedGame = {
      playerIds: this.players.map((player) => player.getId()),
      gameSettings: this.gameSettings,
      gameStarted: this.gameStarted,
      gameEnded: this.gameEnded,
      event: this.event,
      currentPlayerIndex: this.currentPlayerIndex,
      modalOpen: this.modalOpen,
      modalContent: this.modalContent,
      pendingDrawCard: this.pendingDrawCard,
    };

    localStorage.setItem("game", JSON.stringify(serializedGame));

    this.dice.serialize();
    for (let player of this.players) {
      player.serialize();
    }
  }
  public deserialize(): Game | undefined {
    const retrievedData: string | null = localStorage.getItem("game");

    if (!retrievedData) return undefined;

    let game: SerializedGame = JSON.parse(retrievedData);

    let players: Player[] = [];
    for (let playerId of game.playerIds) {
      players.push(GameDeserializerSingleton.deserializePlayer(playerId));
    }

    let dice: Dice = GameDeserializerSingleton.deserializeDice();

    this.setPlayers(players);
    this.setSettings(game.gameSettings);

    if (game.gameStarted) {
      this.startGame();
    } else if (game.gameEnded) {
      this.endGame();
    }
    this.setEvent(game.event);
    this.setCurrentPlayerIndex(game.currentPlayerIndex);
    this.dice = dice;

    if (game.pendingDrawCard) {
      this.drawCard(game.modalContent);
    } else if (game.modalOpen) {
      this.openModal(game.modalContent);
    }

    return this;
  }
  public startGame(): void {
    if (this.gameStarted) throw new Error("Game already started");

    this.gameStarted = true;
    this.gameEnded = false;
  }
  public handleGameFlow(): void {
    switch (this.event) {
      case "ROLL_DICE":
        this.rollDice();
        break;
      case "MOVE_PLAYER":
        this.movePlayer();
        break;
      case "CELL_ACTION":
        this.cellAction();
        break;
      case "END_TURN":
        this.endTurn();
        break;
      default:
        return;
    }
    this.setEvent(eventsSingleton.nextEvent(this.event));
  }
  public handleAwaitFlow(): void {
    switch (this.event) {
      case "AWAIT_ROLL_DICE":
        break;
      case "AWAIT_END_TURN":
        break;
      default:
        return;
    }

    this.setEvent(eventsSingleton.nextEvent(this.event));
  }

  //TODO: Implement logic (modal setting logic)
  public handleAction(): void {}

  public getEvent(): Event | null {
    return this.event;
  }

  //TODO: Create interfaces and a method in the player class for giving only the data that the frontend needs to show the UI
  //public allPlayerInfo
  //public specificPlayerMoreInfo
  public isGameStarted(): boolean {
    return this.gameStarted;
  }
  public isGameEnded(): boolean {
    return this.gameEnded;
  }
  public isModalOpen(): boolean {
    return this.modalOpen;
  }
  public getModalContent(): ModalContent | null {
    return this.modalContent;
  }
  private rollDice(): void {
    this.dice.roll();
  }
  private movePlayer(): void {
    if (this.dice.getDoublesCounter() === Dice.MAX_DOUBLES_COUNTER) {
      this.getCurrentPlayer().sendToJail();
      this.event = "AWAIT_END_TURN";
      return;
    }

    if (
      this.getCurrentPlayer().isInJail() &&
      this.getCurrentPlayer().getJailTurns() === MAX_JAIL_TURNS
    ) {
      this.getCurrentPlayer().releaseFromJail();
    } else if (
      this.getCurrentPlayer().isInJail() &&
      !this.dice.rolledDoubles()
    ) {
      this.getCurrentPlayer().updateJailTurns();
      this.event = "AWAIT_END_TURN";
      return;
    }

    let curPlayerPos = this.getCurrentPlayer().getPosition();
    let finalPlayerPos = curPlayerPos + this.dice.getDiceValues();

    if (finalPlayerPos > BOARD_SIZE) finalPlayerPos -= BOARD_SIZE;

    setTimeout(() => {
      while (curPlayerPos !== finalPlayerPos) {
        curPlayerPos++;

        if (curPlayerPos > BOARD_SIZE) curPlayerPos -= BOARD_SIZE;

        this.getCurrentPlayer().setPosition(curPlayerPos);
      }
    }, this.MOVE_TIMEOUT_MS);
  }
  private cellAction(): void {
    const cell: Cell = this.board[this.getCurrentPlayer().getPosition()];
    const cellType: CellType = cell.cellType;

    switch (cellType) {
      case "START":
        this.getCurrentPlayer().addBalance(Finances.PASS_MONEY);
        break;
      case "PROPERTY":
        if (!cell.deed?.getOwnerId()) {
          this.openModal(
            Modals.AUCTION_MODAL<"PROPERTY">(cell.deed as PropertyDeed)
          );
        } else if (
          cell.deed!.getOwnerId() !== this.getCurrentPlayer().getId()
        ) {
          this.decreasePlayerBal(
            (cell.deed as PropertyDeed).getRentOwed(
              this.getPlayerById(cell.deed.getOwnerId())
            )
          );
        }
        break;
      case "STABLES":
        if (!cell.deed?.getOwnerId()) {
          this.openModal(
            Modals.AUCTION_MODAL<"STABLES">(cell.deed as StablesDeed)
          );
        } else if (
          cell.deed!.getOwnerId() !== this.getCurrentPlayer().getId()
        ) {
          this.decreasePlayerBal(
            cell.deed.getRentOwed(this.getPlayerById(cell.deed.getOwnerId()))
          );
        }
        break;
      case "UTILITY":
        if (!cell.deed?.getOwnerId()) {
          this.openModal(
            Modals.AUCTION_MODAL<"UTILITY">(cell.deed as UtilityDeed)
          );
        } else if (
          cell.deed!.getOwnerId() !== this.getCurrentPlayer().getId()
        ) {
          this.decreasePlayerBal(
            cell.deed.getRentOwed(this.getPlayerById(cell.deed.getOwnerId()))
          );
        }
        break;
      case "CHANCE":
        const randomChanceCard: ModalContent = getRandomChanceCard();
        this.openModal(randomChanceCard);
        break;
      case "COMMUNITY":
        const randomCommunityChestCard: ModalContent =
          getRandomCommunityChestCard();
        this.openModal(randomCommunityChestCard);
        break;
      case "INCOME_TAX":
        this.openModal(Modals.INCOME_TAX_MODAL());
        break;
      case "JAIL":
        break;
      case "LODGING":
        break;
      case "GO_TO_JAIL":
        this.getCurrentPlayer().sendToJail();
        break;
      case "LUXURY_TAX":
        this.decreasePlayerBal(Finances.LUXURY_TAX_FEE);
        break;
      default:
        throw new Error("Invalid cell type.");
    }
  }
  private endTurn(): void {
    if (this.getCurrentPlayer().isBankrupt()) {
      this.removePlayer(this.getCurrentPlayer().getId());
      this.nextPlayer();
    } else if (
      !this.dice.rolledDoubles() ||
      (this.dice.rolledDoubles() && this.getCurrentPlayer().isInJail())
    ) {
      this.nextPlayer();
    }

    this.dice.resetDice();
  }
  private decreasePlayerBal(balance: number): void {
    this.getCurrentPlayer().addBalance(-balance);

    if (this.getCurrentPlayer().isBankrupt()) return;

    if (this.getCurrentPlayer().getBalance() < 0) {
      this.openModal(Modals.SELL_MODAL(this.getCurrentPlayer()));
    }
  }
  private endGame(): void {
    if (!this.checkGameOver()) {
      throw new Error("Game cannot be ended: requirements not met");
    }
    if (this.gameEnded) throw new Error("Game already ended");
    this.gameEnded = true;
    this.gameStarted = false;
  }
  private setEvent(event: Event): void {
    if (this.event && !eventsSingleton.validTransition(this.event, event))
      throw new Error("Invalid event transition");

    this.event = event;
  }
  private openModal(content: ModalContent): void {
    this.modalOpen = true;
    this.modalContent = content;
  }
  private closeModal(): void {
    this.modalOpen = false;
    this.modalContent = null;
  }
  private drawCard(card: ModalContent): void {
    if (this.pendingDrawCard) throw new Error("A card is already being drawn.");

    this.pendingDrawCard = true;
    this.openModal(card);
  }
  private endDrawCard(): void {
    if (!this.pendingDrawCard) throw new Error("No card is being drawn");

    this.pendingDrawCard = false;
    this.closeModal();
  }
  //TODO: Add functionality
  // changePlayerOrder(): void {}

  //TODO: Add functionality for different game modes
  private checkGameOver(): boolean {
    return this.players.filter((player) => !player.isBankrupt()).length <= 1;
  }
  private setPlayers(players: Player[]): void {
    if (players.length > MAX_PLAYER_COUNT)
      throw new Error(`Too many players - count: ${players.length}`);

    this.players = players;
  }
  private setBoard(board: Cell[]): void {
    if (board.length !== BOARD_SIZE) throw new Error("Invalid board supplied");

    this.board = board.map((cell) => {
      return {
        id: cell.id,
        cellType: cell.cellType,
        deed: cell.deed.clone(),
      };
    });
  }
  private setSettings(gameSettings: GameSettings): void {
    if (
      gameSettings.type === "Timed" &&
      !VALID_GAME_DURATIONS.includes(gameSettings.duration)
    )
      throw new Error("Invalid game settings duration");
    if (gameSettings.type === "Last Player Standing" && gameSettings.duration)
      throw new Error("Settings mismatch");
  }
  private getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  private getPlayerById(playerId: number): Player {
    for (let p of this.players) {
      if (p.getId() === playerId) return p;
    }

    throw new Error("Invalid Player ID");
  }
  private nextPlayer(): void {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    if (this.getCurrentPlayer().isBankrupt())
      throw new Error("Bankrupt player cannot be in the game flow");
  }
  private removePlayer(playerId: number): void {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].getId() === playerId) {
        this.players.splice(i, 1);
        return;
      }
    }

    throw new Error("Player not found");
  }
  private setCurrentPlayerIndex(index: number): void {
    if (index < 0 || index > MAX_PLAYER_COUNT)
      throw new Error("Invalid number of players given");

    this.currentPlayerIndex = index;
  }
}
