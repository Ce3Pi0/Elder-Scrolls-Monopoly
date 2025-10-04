import type { CellType, Cell, GameSettings, Event } from "../../utils/types";
import type {
  ActionData,
  ModalContent,
  SerializedGame,
} from "../../utils/interfaces";

import {
  BOARD_SIZE,
  MAX_JAIL_TURNS,
  MAX_PLAYER_COUNT,
  PROPERTY_DEEDS,
  STABLES_DEEDS,
  UTILITIES_DEEDS,
  VALID_GAME_DURATIONS,
} from "../../utils/constants";
import { Finances } from "../../utils/enums";
import { Serializable } from "../abstract/serializable";
import { Player } from "./player";
import { GameDeserializerSingleton } from "./gameDeserializer";
import { Dice } from "./dice";
import eventsSingleton from "./events";
import type { PropertyDeed } from "./propertyDeed";
import { ModalCreator } from "../static/modalCreator";
import type { StablesDeed } from "./stablesDeed";
import type { UtilityDeed } from "./utilityDeed";

export class Game extends Serializable {
  private readonly MOVE_TIMEOUT_MS = 500;
  private changedPlayerOrder = false;

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
  public handleAction(actionData: ActionData): void {
    if (actionData.curPlayerId === actionData.tradePlayerId)
      throw new Error("Player cannot trade with themselves");

    const curPlayer: Player = this.getPlayerById(actionData.curPlayerId);
    let tradePlayer: Player | null = null;
    if (actionData.tradePlayerId)
      tradePlayer = this.getPlayerById(actionData.tradePlayerId);

    const propertyDeeds: PropertyDeed[] | null = PROPERTY_DEEDS.filter(
      (deed) => deed.getOwnerId() === curPlayer.getId()
    );

    let otherDeeds: UtilityDeed[] | StablesDeed[] | null = null;
    if (actionData.otherDeedType === "UTILITIES")
      otherDeeds = [...UTILITIES_DEEDS];
    else if (actionData.otherDeedType === "STABLES")
      otherDeeds = [...STABLES_DEEDS];

    const mortgageDeed: PropertyDeed | UtilityDeed | StablesDeed | undefined =
      this.board.find((cell) => cell.deed.getId() === actionData.mortgageDeedId)
        ?.deed as PropertyDeed | UtilityDeed | StablesDeed | undefined;

    switch (actionData.actionType) {
      case "OPEN_DEED_MODAL":
        this.openModal(ModalCreator.DEED_MODAL(curPlayer));
        break;
      case "OPEN_DEED_PROPERTIES_MODAL":
        this.openModal(ModalCreator.DEED_PROPERTIES_MODAL(propertyDeeds));
        break;
      case "OPEN_DEED_OTHER_MODAL":
        this.openModal(ModalCreator.DEED_OTHER_MODAL(otherDeeds));
        break;
      case "OPEN_TRADE_MODAL":
        this.openModal(ModalCreator.TRADE_MODAL(curPlayer, tradePlayer));
        break;
      case "OPEN_SELL_DEED_PROPERTIES_MODAL":
        this.openModal(ModalCreator.SELL_DEED_PROPERTIES_MODAL(propertyDeeds));
        break;
      case "OPEN_SELL_DEED_OTHER_MODAL":
        this.openModal(ModalCreator.SELL_DEED_OTHER_MODAL(otherDeeds));
        break;
      case "OPEN_MORTGAGE_MODAL":
        this.openModal(ModalCreator.MORTGAGE_MODAL(mortgageDeed));
        break;
      case "OPEN_SELL_DEED_ASSETS_MODAL":
        this.openModal(ModalCreator.SELL_ASSETS_MODAL(actionData.assetType));
        break;
      case "CLOSE_MODAL":
        this.closeModal();
        break;
      case "END_DRAW_CARD":
        this.endDrawCard();
        break;
      default:
        throw new Error("Invalid action event");
    }
  }
  public getEvent(): Event | null {
    return this.event;
  }
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
            ModalCreator.AUCTION_MODAL<"PROPERTY">(cell.deed as PropertyDeed)
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
            ModalCreator.AUCTION_MODAL<"STABLES">(cell.deed as StablesDeed)
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
            ModalCreator.AUCTION_MODAL<"UTILITY">(cell.deed as UtilityDeed)
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
        this.drawCard(ModalCreator.CHANCE_MODAL());
        break;
      case "COMMUNITY":
        this.drawCard(ModalCreator.COMMUNITY_MODAL());
        break;
      case "INCOME_TAX":
        this.openModal(ModalCreator.INCOME_TAX_MODAL());
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
      this.openModal(ModalCreator.SELL_DEED_MODAL(this.getCurrentPlayer()));
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
  public changePlayerOrder(): void {
    if (this.changedPlayerOrder)
      throw new Error("Player order already changed");
    //TODO: Separate player storing functionality
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
