import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {LayoutOptions} from "@/types";
import {tempStore} from "@/events";

/**
 * 流式布局
 * 建议只在item大小全部一样的时候使用该算法
 * 优点: 不会打乱源次序
 * 缺点: 在固定宽高的时候想移动到某位置时正好布局后容器会溢出，此时移动会失败
 * 建议: 1.只用在不固定宽高的容器中
 *      2.建议Item大小都一致
 *      3.不要使用static item
 * */
export class StreamLayout extends Layout {
  public name = 'stream'

  public defaultDirection(name) {
    const {toItem, dragItem} = tempStore
    if (!dragItem) return
    if (toItem) {
      this.manager.move(this.layoutItems, dragItem, toItem)
    }
  }

  public async layout(items: Item[], options: LayoutOptions) {
    const {dragItem} = tempStore
    const container = this.manager.container
    if (!container || !this.allowLayout()) return
    return this.throttle(() => {
      if (dragItem) this.patchDirection()
      const baseLine = container.getConfig("baseLine")
      const res = this.manager.analysis(this.layoutItems, null, {
        auto: this.hasAutoDirection(),
        baseline: baseLine
      })
      if (!res.isSuccess) return
      res.patch()
      return true
    })
  }

}
