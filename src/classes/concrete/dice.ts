import type { SerializedDice } from "../../utils/interfaces";
import type { Pair } from "../../utils/types";
import { Serializable } from "../abstract/serializable";

export class Dice extends Serializable {
  static readonly MAX_DICE_VALUE: number = 6;
  static readonly MAX_DOUBLES_COUNTER: number = 3;

  private diceValues: Pair = { diceOne: 0, diceTwo: 0 };
  private diceRolled: boolean = false;
  private doublesCounter: number = 0;

  public constructor() {
    super();
  }
  public roll(): void {
    if (this.diceRolled) {
      throw new Error("Dice already rolled this turn.");
    }
    //FIXME: Change for final version
    this.diceValues.diceOne = 6;
    //Math.floor(Math.random() * Dice.MAX_DICE_VALUE) + 1;
    this.diceValues.diceTwo = 1;
    //Math.floor(Math.random() * Dice.MAX_DICE_VALUE) + 1;
    this.diceRolled = true;

    if (this.rolledDoubles()) {
      this.incrementDoublesCounter();
    }
  }
  public getDiceValues(): number[] {
    return [this.diceValues.diceOne, this.diceValues.diceTwo];
  }
  public areDiceRolled(): boolean {
    return this.diceRolled;
  }
  public rolledDoubles(): boolean {
    if (this.diceValues.diceOne === 0 && this.diceValues.diceTwo === 0)
      return false;
    return this.diceValues.diceOne === this.diceValues.diceTwo;
  }
  public getDoublesCounter(): number {
    return this.doublesCounter;
  }
  public resetDice(): void {
    this.diceRolled = false;
    this.diceValues = { diceOne: 0, diceTwo: 0 };
  }
  public serialize(): void {
    const serializedDice: SerializedDice = {
      diceRolled: this.diceRolled,
      diceValues: this.diceValues,
      doublesCounter: this.doublesCounter,
    };

    localStorage.setItem("dice", JSON.stringify(serializedDice));
  }
  public deserialize(): Dice | undefined {
    const retrievedData: string | null = localStorage.getItem("dice");

    if (!retrievedData) return undefined;

    let dice: SerializedDice = JSON.parse(retrievedData);

    this.setDiceRolled(dice.diceRolled);
    this.setDiceValues(dice.diceValues);
    this.setDoublesCounter(dice.doublesCounter);

    return this;
  }
  private incrementDoublesCounter(): void {
    this.doublesCounter++;
    if (this.doublesCounter > Dice.MAX_DICE_VALUE)
      throw new Error(`Cannot roll ${this.doublesCounter} doubles in a row`);
  }
  private setDiceValues(diceValues: Pair) {
    if (!this.validDice(diceValues))
      throw new Error(`Invalid dice values ${diceValues}`);
    this.diceValues.diceOne = diceValues.diceOne;
    this.diceValues.diceTwo = diceValues.diceTwo;
  }
  private validDice(diceValues: Pair): boolean {
    if (
      diceValues.diceOne < 0 ||
      diceValues.diceOne > Dice.MAX_DICE_VALUE ||
      diceValues.diceTwo < 0 ||
      diceValues.diceTwo > Dice.MAX_DICE_VALUE
    )
      return false;
    if (diceValues.diceOne === 0 && diceValues.diceTwo === 0 && this.diceRolled)
      return false;
    return true;
  }
  private setDiceRolled(diceRolled: boolean): void {
    this.diceRolled = diceRolled;
  }
  private setDoublesCounter(doublesCounter: number): void {
    if (doublesCounter < 0 || doublesCounter > Dice.MAX_DOUBLES_COUNTER)
      throw new Error(`Invalid doubles counter value ${doublesCounter}`);
    this.doublesCounter = doublesCounter;
  }
}
