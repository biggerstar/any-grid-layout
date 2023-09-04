import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {AnalysisResult, LayoutOptions} from "@/types";

/**
 * 交换算法，fromItem和toItem两两交换
 * 建议只在item大小全部一样的时候使用该算法
 * 如果Item大小不一样最好使用不固定宽高的容器
 *
 * @beta 还在设计中，建议不要用在生产环境
 * TODO  优化算法和交互
 * */

export class ExchangeLayout extends Layout {
  public options: Required<LayoutOptions>
  public name = 'exchange'
  public wait = 50
  public init(...args): AnalysisResult | void {
    return undefined;
  }

  public defaultDirection(name) {
    const {toItem, dragItem} = this.options
    if (!toItem) return
    this.manager.exchange(this.layoutItems, dragItem, toItem)
  }

  public async layout(items: Item[], options: any) {
    const {
      distance,
      speed,
      toItem
    } = options
    const mouseOverContainer = this.manager.container
    if (!mouseOverContainer) return
    if (distance < 10 || speed < 30) return
    return this.throttle(() => {
      if (toItem && this.isAnimation(toItem)) return
      this.patchDirection()
      const res = this.manager.analysis(this.layoutItems)
      if (res.failedItems.length) return
      res.patch()
      return true
    })
  }
}
