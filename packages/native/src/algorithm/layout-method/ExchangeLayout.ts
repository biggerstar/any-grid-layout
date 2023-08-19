import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {LayoutOptions} from "@/types";

/**
 * 交换算法，fromItem和toItem两两交换
 * 建议只在item大小全部一样的时候使用该算法
 *
 * @beta 不要用在生产环境
 * TODO  优化算法和交互
 *
 * */

export class ExchangeLayout extends Layout {
  public options: Required<LayoutOptions>
  public name = 'exchange'
  public wait = 50

  public defaultDirection(name) {
    const {toItem, dragItem} = this.options
    if (!toItem) return
    this.manager.exchange(this.items, dragItem, toItem)
  }

  public layout(items: Item[], options: any): void {
    const {
      distance,
      speed,
    } = options
    const mouseOverContainer = this.manager.container
    if (!mouseOverContainer) return
    if (distance < 10 || speed < 30) return
    this.throttle(() => {
      this.patchDirection()
      const res = this.manager.analysis(this.items)
      res.patch()
      this.patchStyle()
    })
  }
}
