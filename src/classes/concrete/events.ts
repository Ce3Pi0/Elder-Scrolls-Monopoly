import type { Event } from "../../utils/types";

class EventsSingleton {
  static _instance: EventsSingleton | null = null;

  private _events: { EventType: Event };

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
    if (!EventsSingleton._instance) {
      EventsSingleton._instance = new EventsSingleton();
    }

    return EventsSingleton._instance;
  }

  public nextEvent(event: Event): Event {
    return this._events[event];
  }
}

export default EventsSingleton;
