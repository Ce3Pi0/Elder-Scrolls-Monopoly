import type { EventType } from "../utils/types";

class EventsSingleton {
  static #instance: EventsSingleton | null = null;

  private _events: { EventType: EventType };

  private initEvents(): void {
    //FIXME: Testing only
    this._events["TESTING"] = "ROLL_DICE";

    //Game Flow
    this._events["START_GAME"] = "DECIDE_ORDER";
    this._events["DECIDE_ORDER"] = "ROLL_DICE";
    this._events["ROLL_DICE"] = "MOVE_PLAYER";
    this._events["MOVE_PLAYER"] = "CELL_ACTION";
    this._events["CELL_ACTION"] = "END_TURN";
    this._events["END_TURN"] = "ROLL_DICE";
  }

  private constructor() {
    this.initEvents();
  }

  public static get instance(): EventsSingleton {
    if (!EventsSingleton.#instance) {
      EventsSingleton.#instance = new EventsSingleton();
    }

    return EventsSingleton.#instance;
  }

  public nextEvent(event: EventType): EventType {
    return this._events[event];
  }
}

export default EventsSingleton;
