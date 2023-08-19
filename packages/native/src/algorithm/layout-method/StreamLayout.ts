import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {LayoutOptions} from "@/types";

/**
 * 流式布局
 * 建议只在item大小全部一样的时候使用该算法
 *
 * @beta 不要用在生产环境
 * TODO  优化算法和交互
 * */
export class StreamLayout extends Layout {
  public options:Required<LayoutOptions>
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

  public layout(items: Item[], options: any): void {
    const {
      distance,
      speed,
    } = options
    const mouseOverContainer = this.manager.container
    if (!mouseOverContainer) return
    if (distance < 12 || speed < 30) return
    this.throttle(() => {
      this.patchDirection()
      const res = this.manager.analysis(this.items)
      res.patch()
      this.patchStyle()
    })
  }
}
