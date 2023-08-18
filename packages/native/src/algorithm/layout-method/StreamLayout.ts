import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {parseContainer} from "@/utils";

/**
 * 流式布局
 * 建议只在item大小全部一样的时候使用该算法
 * TODO  优化算法和交互
 * */
export class StreamLayout extends Layout {
  public name = 'stream'
  public wait = 20

  public defaultDirection(name) {
    const {toItem, dragItem, x, y} = this.options
    if (toItem) this.manager.moveToPos(this.items, dragItem, {
      ...dragItem.pos,
      x,
      y,
    })
  }

  left() {
    const {toItem, dragItem} = this.options
    if (toItem) this.manager.move(this.items, dragItem, toItem)
  }

  right() {
    const {toItem, dragItem} = this.options
    if (toItem) this.manager.move(this.items, dragItem, toItem)
  }

  public layout(items: Item[], options: object): void {
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
      const engine = mouseOverContainer.engine
      const res = this.manager.analysis(this.items)
      res.patch()
      engine.items.forEach((item) => item.updateItemLayout())
    })
  }
}
