import type {
  CellType,
  Cell,
  GameSettings,
  Pair,
  Event,
} from "../../utils/types";
import type { ModalContent, SerializedGame } from "../../utils/interfaces";

import {
  BOARD_SIZE,
  MAX_DICE_VALUE,
  MAX_DOUBLES_COUNTER,
  MAX_PLAYER_COUNT,
  VALID_GAME_DURATIONS,
} from "../../utils/constants";
import { Finances } from "../../utils/enums";
import {
  getRandomChanceCard,
  getRandomCommunityChestCard,
} from "../../utils/helpers";
import { Serializable } from "../abstract/serializable";
import { Player } from "./player";
import { GameDeserializerSingleton } from "./gameDeserializer";

export class Game extends Serializable {
  private players: Player[];
  private gameSettings: GameSettings;
  private gameStarted: boolean;
  private gameEnded: boolean;
  private board: Cell[];
  private event: Event | null;
  private currentPlayerIndex: number;
  private diceRolled: boolean;
  private diceValue: Pair;
  private doublesCounter: number;
  private modalOpen: boolean;
  private modalContent: ModalContent | null;
  private pendingDrawCard: boolean;

  constructor(
    players: Player[],
    gameSettings: GameSettings,
    board: Cell[],
    gameStarted: boolean = false,
    gameEnded: boolean = true,
    event: Event | null = null,
    currentPlayerIndex: number = 0,
    diceRolled: boolean = false,
    diceValue: Pair = { diceOne: 0, diceTwo: 0 },
    doublesCounter: number = 0,
    modalOpen: boolean = false,
    modalContent: ModalContent | null = null,
    pendingDrawCard: boolean = false
  ) {
    super();

    if (players.length > MAX_PLAYER_COUNT)
      throw new Error("Invalid player count");
    if (VALID_GAME_DURATIONS.includes(gameSettings.duration) === undefined)
      throw new Error("Invalid game duration");
    if (gameStarted && gameEnded)
      throw new Error("Game cannot be started and ended at the same time");
    if (!gameStarted && !gameEnded)
      throw new Error("Game has to be started or ended");
    if (board.length !== BOARD_SIZE) throw new Error("Invalid board");
    if (currentPlayerIndex < 0 || currentPlayerIndex > MAX_PLAYER_COUNT)
      throw new Error("Invalid player index");
    if (
      (diceRolled && diceValue.diceOne === 0 && diceValue.diceTwo === 0) ||
      (!diceRolled && diceValue.diceOne !== 0 && diceValue.diceTwo !== 0)
    )
      throw new Error("Dice values and dice rolled variables error");
    if (
      diceValue.diceOne < 0 ||
      diceValue.diceOne > MAX_DICE_VALUE ||
      diceValue.diceTwo < 0 ||
      diceValue.diceTwo > MAX_DICE_VALUE
    )
      throw new Error("Invalid dice values");
    if (doublesCounter < 0 || doublesCounter > MAX_DOUBLES_COUNTER)
      throw new Error("Invalid doubles counter value");
    if ((modalContent === null && modalOpen) || (modalContent && !modalOpen))
      throw new Error("Modal content and modal open values error");

    this.players = players.map((player) => player.clone());
    this.gameSettings.type = gameSettings.type;
    this.gameSettings.duration = gameSettings.duration;
    this.gameStarted = gameStarted;
    this.gameEnded = gameEnded;
    this.board = board.map((cell) => {
      return {
        id: cell.id,
        cellType: cell.cellType,
        deed: cell.deed.clone(),
      };
    });
    this.event = event;
    this.currentPlayerIndex = currentPlayerIndex;
    (this.diceRolled = diceRolled),
      (this.diceValue = {
        diceOne: diceValue.diceOne,
        diceTwo: diceValue.diceTwo,
      });
    this.doublesCounter = doublesCounter;
    this.modalOpen = modalOpen;
    this.modalContent = {
      title: modalContent.title,
      content: modalContent.content,
    };
    this.pendingDrawCard = pendingDrawCard;
  }
  clone(): Game {
    const clonedPlayers = this.players.map((p) => p.clone());
    const clonedBoard = this.board.map((cell) => ({
      id: cell.id,
      cellType: cell.cellType,
      deed: cell.deed ? cell.deed.clone() : null,
    }));
    const clonedSettings: GameSettings = { ...this.gameSettings };

    const clonedGame = new Game(clonedPlayers, clonedSettings, clonedBoard);

    while (this.currentPlayerIndex !== clonedGame.getCurrentPlayerIndex())
      clonedGame.nextPlayer();
    if (this.diceRolled) clonedGame.setDiceRolled(true);
    clonedGame.setDiceValue(this.diceValue);
    if (this.gameEnded) clonedGame.endGame();
    clonedGame.setEvent(this.event);
    if (this.pendingDrawCard) clonedGame.drawCard(this.modalContent);
    else if (this.modalOpen && !this.pendingDrawCard)
      clonedGame.openModal(this.modalContent);

    return clonedGame;
  }
  startGame(): void {
    this.gameStarted = true;
    this.gameEnded = false;
  }
  isGameStarted(): boolean {
    return this.gameStarted;
  }
  isGameEnded(): boolean {
    return this.gameEnded;
  }
  getEvent(): Event | null {
    return this.event;
  }
  setEvent(event: Event): void {
    this.event = event;
  }
  isModalOpen(): boolean {
    return this.modalOpen;
  }
  getModalContent(): ModalContent | null {
    return this.modalContent;
  }
  isPendingDrawCard(): boolean {
    return this.pendingDrawCard;
  }
  //TODO: Add functionality
  // changePlayerOrder(): void {

  // }

  setPlayers(players: Player[]): void {
    this.players = players;
  }
  getGameSettings(): GameSettings {
    return this.gameSettings;
  }
  getDiceValue(): Pair {
    return this.diceValue;
  }
  getDiceRolled(): boolean {
    return this.diceRolled;
  }
  getDoublesCounter(): number {
    return this.doublesCounter;
  }
  //TODO: Check functionality
  incrementDoublesCounter(): void {
    this.doublesCounter++;

    if (this.doublesCounter === 3) {
      this.players[this.currentPlayerIndex].sendToJail;
      this.nextPlayer();
      this.doublesCounter = 0;
    }
  }
  getPlayers(): Player[] {
    return this.players;
  }
  getBoard(): Cell[] {
    return this.board;
  }
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex;
  }
  removePlayer(playerId: number): void {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].getId() === playerId) {
        this.players.splice(i, 1);
        return;
      }
    }

    throw new Error("Player not found");
  }
  nextPlayer(): void {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }
  setDiceValue(diceValue: Pair): void {
    if (
      diceValue.diceOne < 0 ||
      diceValue.diceOne > 6 ||
      diceValue.diceTwo < 0 ||
      diceValue.diceTwo > 6
    ) {
      throw new Error("Invalid dice value.");
    }
    this.diceValue = diceValue;
  }
  setDiceRolled(diceRolled: boolean): void {
    this.diceRolled = diceRolled;
  }
  //TODO: Figure out what to do with this method
  handleCellAction(): void {
    const cell: Cell = this.board[this.getCurrentPlayer().getPosition()];
    const cellType: CellType = cell.cellType;

    switch (cellType) {
      case "START":
        this.getCurrentPlayer().addBalance(Finances.PASS_MONEY);
        break;
      case "PROPERTY":
        if (!cell.deed?.getOwnerId()) {
          this.modalOpen = true;
          // this.modalContent = {
          //   title: "auction",
          //   content: { ...cell.deed },
          // };
        } else if (
          cell.deed!.getOwnerId() !== this.getCurrentPlayer().getId()
        ) {
          this.getCurrentPlayer().addBalance(-cell.deed!.getPrice());

          // if (this.getCurrentPlayer().isBankrupt()) {
          //   this.modalOpen = true;
          //   this.modalContent = {
          //     title: "bankruptcy",
          //     ...this.getCurrentPlayer().getDeeds(),
          //   };
          // }
        }
        break;
      case "STABLES":
        //TODO: Add stables actions
        break;
      case "UTILITY":
        //TODO: Add utility actions
        break;
      case "CHANCE":
        const randomCard: ModalContent = getRandomChanceCard();
        this.modalOpen = true;
        this.modalContent = {
          title: randomCard.title,
          content: randomCard.content,
        };
        break;
      case "COMMUNITY":
        const randomCommunityCard: ModalContent = getRandomCommunityChestCard();
        this.modalOpen = true;
        this.modalContent = {
          title: randomCommunityCard.title,
          content: randomCommunityCard.content,
        };
        break;
      // case "incomeTax":
      //   this.modalOpen = true;
      //   this.modalContent = {
      //     title: "incomeTax",
      //     const_amount: Finances.INCOME_TAX_FEE,
      //     variable_amount: this.getCurrentPlayer().getTotalBalance() * 0.1,
      //   };
      //   break;
      case "JAIL":
        break;
      case "LODGING":
        break;
      case "GO_TO_JAIL":
        this.getCurrentPlayer().sendToJail();
        break;
      case "LUXURY_TAX":
        this.getCurrentPlayer().addBalance(-Finances.LUXURY_TAX_FEE);
        break;
      default:
        throw new Error("Invalid cell type.");
    }
  }
  //TODO: Add functionality for different game modes
  endGame(): void {
    if (!this.checkGameOver()) {
      throw new Error("Game cannot be ended: not enough players bankrupt.");
    }
    this.gameEnded = true;
    this.gameStarted = false;
  }
  checkGameOver(): boolean {
    return this.players.filter((player) => !player.isBankrupt()).length <= 1;
  }
  rollDice(): void {
    if (this.diceRolled) {
      throw new Error("Dice already rolled this turn.");
    }
    this.diceValue.diceOne = Math.floor(Math.random() * 6) + 1;
    this.diceValue.diceTwo = Math.floor(Math.random() * 6) + 1;
    this.diceRolled = true;
  }
  resetDice(): void {
    this.diceRolled = false;
    this.diceValue = { diceOne: 0, diceTwo: 0 };
  }
  rolledDoubles(): boolean {
    if (this.diceValue.diceOne === 0 && this.diceValue.diceTwo === 0)
      return false;
    return this.diceValue.diceOne === this.diceValue.diceTwo;
  }
  openModal(content: ModalContent): void {
    this.modalOpen = true;
    this.modalContent = content;
  }
  closeModal(): void {
    this.modalOpen = false;
    this.modalContent = null;
  }
  drawCard(card: ModalContent): void {
    if (this.pendingDrawCard) {
      throw new Error("A card is already being drawn.");
    }
    this.pendingDrawCard = true;
    this.openModal(card);
  }
  endDrawCard(): void {
    this.pendingDrawCard = false;
    this.closeModal();
  }
  serialize(): void {
    const serializedGame: SerializedGame = {
      playerIds: this.players.map((player) => player.getId()),
      gameSettings: this.gameSettings,
      gameStarted: this.gameStarted,
      gameEnded: this.gameEnded,
      event: this.event,
      currentPlayerIndex: this.currentPlayerIndex,
      diceRolled: this.diceRolled,
      diceValue: this.diceValue,
      doublesCounter: this.doublesCounter,
      modalOpen: this.modalOpen,
      modalContent: this.modalContent,
      pendingDrawCard: this.pendingDrawCard,
    };

    localStorage.setItem("game", JSON.stringify(serializedGame));

    for (let player of this.players) {
      player.serialize();
    }
  }
  deserialize(): Game {
    const retrievedData: string | null = localStorage.getItem("game");

    if (!retrievedData) return undefined;

    let game: SerializedGame = JSON.parse(retrievedData);

    let players: Player[] = [];
    for (let playerId of game.playerIds) {
      players.push(GameDeserializerSingleton.deserializePlayer(playerId));
    }

    this.gameSettings = game.gameSettings;
    this.gameStarted = game.gameStarted;
    this.gameEnded = game.gameEnded;
    this.event = game.event;
    this.currentPlayerIndex = game.currentPlayerIndex;
    this.diceRolled = game.diceRolled;
    this.diceValue = game.diceValue;
    this.doublesCounter = game.doublesCounter;
    this.modalOpen = game.modalOpen;
    this.modalContent = game.modalContent;
    this.pendingDrawCard = game.pendingDrawCard;

    return this;
  }
}
