import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {parseContainer} from "@/utils";

/**
 * 静态布局
 * */
export class StaticLayout extends Layout {
  public name = 'static'
  public wait = 0

  public defaultDirection(name) {
    const {
      dragItem,
      x,
      y,
    } = this.options
    const manager = this.manager
    const noDragItemList = this.items.filter((item) => item !== dragItem)
    manager.reset()
    for (const k in noDragItemList) {
      const item = this.items[k]
      if (!manager.isBlank(item.pos)) return;
      manager.mark(item.pos)
    }
    const hasDragPosBlank = manager.isBlank({
      ...dragItem.pos,
      x,
      y
    })
    if (!hasDragPosBlank) return
    dragItem.pos.x = x
    dragItem.pos.y = y
  }

  public layout(items: Item[], options: any): void {
    this.options = options
    const {
      ev,
      distance,
      speed,
    } = options
    const mouseOverContainer = parseContainer(ev)
    if (!mouseOverContainer) return
    if (distance < 10 || speed < 30) return
    this.items = items
    this.throttle(() => {
      this.patchDirection()
    })
  }
}
