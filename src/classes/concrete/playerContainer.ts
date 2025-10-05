import { MAX_PLAYER_COUNT } from "../../utils/constants";
import { Container } from "../abstract/container";
import type { Player } from "./player";

export class PlayersContainer extends Container {
  private currentIndex: number = 0;
  private players: Player[];

  constructor(players: Player[]) {
    super();

    this.setData(players);
  }

  public setCurrentIndex(index: number): void {
    if (index < 0 || index > this.players.length)
      throw new Error("Invalid number of players given");

    this.currentIndex = index;
  }
  public getCurrent(): Player {
    return this.players[this.currentIndex];
  }
  public getCurrentIndex(): number {
    return this.currentIndex;
  }
  public getCurrentId(): number {
    return this.players[this.currentIndex].getId();
  }
  public getAllPlayerIds(): number[] {
    return this.players.map((player) => player.getId());
  }
  public getByIndex(index: number): Player {
    if (index < 0 || index >= this.players.length)
      throw new Error("Invalid index");

    return this.players[index];
  }
  public getById(id: number): Player {
    for (let p of this.players) {
      if (p.getId() === id) return p;
    }

    throw new Error("Invalid Player ID");
  }
  public getCount(): number {
    return this.players.length;
  }
  public setData(players: Player[]): void {
    if (players.length > MAX_PLAYER_COUNT)
      throw new Error("Too many players supplied");
    this.players = players;
  }
  public changeOrder(order: number[]): void {
    let swapped: boolean;

    for (let i = 0; i < this.players.length; i++) {
      swapped = false;
      for (let j = 0; j < this.players.length - i; j++) {
        if (order[j] < order[j + 1]) {
          let tempP: Player = this.players[j];
          this.players[j] = this.players[j + 1];
          this.players[j + 1] = tempP;
          swapped = true;
        }
      }

      if (!swapped) break;
    }
  }

  public richestPlayer(): Player {
    let richest: number = -1;
    let curPlayer: Player | null = null;
    for (let player of this.players) {
      if (player.getTotalBalance() > richest) {
        richest = player.getTotalBalance();
        curPlayer = player;
      }
    }

    return curPlayer;
  }
  public removeByIndex(index: number): void {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].getId() === index) {
        this.players.splice(i, 1);
        return;
      }
    }

    throw new Error("Player not found");
  }
  public removeCurrent(): void {
    this.players.splice(this.currentIndex, 1);
  }
  public next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.players.length;
    if (this.getCurrent().isBankrupt())
      throw new Error("Bankrupt player cannot be in the game flow");
  }

  public serializePlayers(): void {
    for (let player of this.players) {
      player.serialize();
    }
  }
}
