export abstract class Serializable {
  constructor() {
    return;
  }
  abstract serialize(): void;
  abstract deserialize(): Serializable;
}
