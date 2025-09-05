import type { Event } from "../../utils/types";

class EventsSingleton {
  static _instance: EventsSingleton | null = null;

  private _events: { EventType: Event };

  private initEvents(): void {
    //FIXME: Testing only
    this._events["TESTING"] = "AWAIT_ROLL_DICE";

    //Game Flow
    this._events["DECIDE_ORDER"] = "AWAIT_ROLL_DICE";
    this._events["AWAIT_ROLL_DICE"] = "ROLL_DICE";
    this._events["ROLL_DICE"] = "MOVE_PLAYER";
    this._events["MOVE_PLAYER"] = "CELL_ACTION";
    this._events["CELL_ACTION"] = "AWAIT_END_TURN";
    this._events["AWAIT_END_TURN"] = "END_TURN";
    this._events["END_TURN"] = "AWAIT_ROLL_DICE";
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

  public validTransition(curEvent: Event, nextEvent: Event): boolean {
    if (this._events[curEvent] === nextEvent) return true;
    return false;
  }
}

const eventsSingleton: EventsSingleton = EventsSingleton.instance;

export default eventsSingleton;
