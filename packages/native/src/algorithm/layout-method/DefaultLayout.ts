import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {parseContainer} from "@/utils";

export class DefaultLayout extends Layout {
  public name = 'default'
  protected wait = 30

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

  public layout(items: Item[], options: any): void {
    this.options = options
    const {
      ev,
      distance,
      speed,
      toItem
    } = options
    const mouseOverContainer = parseContainer(ev)
    if (!mouseOverContainer) return
    if (distance < 10 || speed < 20) return
    this.items = items

    this.throttle(() => {
      if (toItem) {  // 检测是否在动画中，如果还在动画且完成距离较长，退出该次执行
        const to: Item = toItem
        if (Math.abs(to.offsetLeft() - to.element.offsetLeft) > (to.nowWidth() / 15)) return
        if (Math.abs(to.offsetTop() - to.element.offsetTop) > (to.nowHeight() / 15)) return
      }
      this.patchDirection()
      const engine = mouseOverContainer.engine
      const res = this.manager.analysis(this.items)
      res.patch()
      engine.items = this.manager.getCurrentMatrixSortItems(this.items)
    })
  }
}
