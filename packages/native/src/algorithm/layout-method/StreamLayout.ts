import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";

export class StreamLayout extends Layout {
  public name = 'stream'
  public wait = 150

  /** 进行布局 */
  public layout(items: Item[], dragItem: Item, x: number, y: number): void {
    const manager = this.manager
    const toPos = {
      ...dragItem.pos,
      x,
      y
    }
    const isCanMove = manager.isCanMove(items, dragItem, toPos)
    const foundAreaItems = manager.findCoverItemsFromPosition(items, toPos)
    if (isCanMove) {
      const foundToIndex = items.findIndex((item) => item === dragItem)
      if (foundToIndex > -1) {
        this.throttle(() => {
          manager.move(items, dragItem, foundAreaItems[0])
        })
      }
    }
  }
}
