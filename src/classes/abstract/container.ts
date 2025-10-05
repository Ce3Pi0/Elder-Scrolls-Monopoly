export abstract class Container {
  abstract setCurrentIndex(index: number): void;
  abstract getCurrent(): any;
  abstract getByIndex(index: number): any;
  abstract getCount(): number;
  abstract setData(data: any): void;
  abstract changeOrder(order: any): void;
  abstract removeByIndex(index: number): void;
  abstract removeCurrent(): void;
  abstract next(): void;
}
