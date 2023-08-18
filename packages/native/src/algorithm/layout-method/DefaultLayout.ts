import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {parseContainer} from "@/utils";


export class DefaultLayout extends Layout {
  public name = 'default'

  public defaultDirection(name) {
    const {toItem, dragItem} = this.options
    if (!toItem) return
    this.manager.exchange(this.items, dragItem, toItem)
  }

  public right() {
    const {dragItem, toItem} = this.options
    this.manager.move(this.items, dragItem, toItem)
  }

  public left() {
    const {dragItem, toItem} = this.options
    this.manager.move(this.items, dragItem, toItem)
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
    if (distance < 10 || speed < 15) return
    this.items = items
    this.throttle(() => {
      this.patchDirection()
      const engine = mouseOverContainer.engine
      const res = this.manager.analysis(this.items)
      res.patch()
      engine.items.forEach((item) => item.updateItemLayout())
      engine.items = this.manager.getCurrentMatrixSortItems(this.items)
    })
  }
}
