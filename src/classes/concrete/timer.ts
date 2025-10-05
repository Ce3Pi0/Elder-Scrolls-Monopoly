export class Timer {
  readonly VALID_GAME_DURATIONS: number[] = [45];

  private duration: number;
  private startTime: number;
  constructor(duration: number) {
    if (!this.VALID_GAME_DURATIONS.includes(duration))
      throw new Error("Invalid game duration");
    this.duration = duration;
    this.startTime = new Date().getMinutes();
  }

  public expired(): boolean {
    let curTime: number = new Date().getMinutes();
    return Math.abs(curTime - this.startTime) >= this.duration;
  }
}
