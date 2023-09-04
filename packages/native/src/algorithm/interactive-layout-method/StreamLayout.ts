import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {AnalysisResult, LayoutOptions} from "@/types";

/**
 * 流式布局
 * 建议只在item大小全部一样的时候使用该算法
 * 优点: 不会打乱源次序
 * 缺点: 在固定宽高的时候想移动到某位置时正好布局后容器会溢出，此时移动会失败
 * 建议: 只用在不固定宽高的容器中
 * */
export class StreamLayout extends Layout {
  public options: Required<LayoutOptions>
  public name = 'stream'

  public defaultDirection(name) {
    const {toItem, dragItem} = this.options
    if (toItem) this.manager.move(this.layoutItems, dragItem, toItem)
  }

  public async layout(items: Item[], options: LayoutOptions) {
    const {
      distance,
      speed,
      toItem
    } = options
    const mouseOverContainer = this.manager.container
    if (!mouseOverContainer) return
    if (distance < 12 || speed < 30) return
    return this.throttle(() => {
      if (toItem && this.isAnimation(toItem)) return
      this.patchDirection()
      const res = this.manager.analysis(this.layoutItems, this.getModifyItems())
      if (!res.isSuccess) return
      res.patch()
      return true
    })
  }

  init(...args: any[]): AnalysisResult | void {
    return undefined;
  }
}
