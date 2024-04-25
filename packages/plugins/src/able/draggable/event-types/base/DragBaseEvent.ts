import {Container, Item, tempStore} from "@biggerstar/layout";

export class DragBaseEvent {
  public offsetLeft: number
  public offsetTop: number
  public offsetGridX: number
  public offsetGridY: number
  /* ---------------------------------------- */
  public toItem: Item | null
  public fromItem: Item | null
  public fromContainer: Container
  public toContainer: Container | null

  constructor() {
    this.toItem = tempStore.toItem
    this.fromItem = tempStore.fromItem
    this.fromContainer = tempStore.fromContainer
    this.toContainer = tempStore.toContainer
  }
}
