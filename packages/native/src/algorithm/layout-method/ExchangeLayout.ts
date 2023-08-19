import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {parseContainer} from "@/utils";

/**
 * 交换算法，fromItem和toItem两两交换
 * 建议只在item大小全部一样的时候使用该算法
 *   TODO  优化算法和交互
 * */

export class ExchangeLayout extends Layout {
  public name = 'exchange'
  public wait = 50

  public defaultDirection(name) {
    const {toItem, dragItem} = this.options
    if(!toItem) return
    this.manager.exchange(this.items, dragItem, toItem)
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
      const res = this.manager.analysis(this.items)
      res.patch()
    })
  }
}
