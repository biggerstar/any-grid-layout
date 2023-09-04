import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {tempStore} from "@/events";
import {AnalysisResult} from "@/types";

/**
 * 静态布局
 * */
export class StaticLayout extends Layout {
  public name = 'static'
  public wait = 10

  public defaultDirection(name) {
    const {
      dragItem,
      gridX: x,
      gridY: y,
    } = tempStore
    if (!dragItem) return
    const manager = this.manager
    manager.reset()
    this.layoutItems.forEach((item) => {
      if (item === dragItem) return  // 当前的dragItem另外判断
      if (!manager.isBlank(item.pos)) return;
      manager.mark(item.pos)
    })
    const toPos = {
      w: dragItem.pos.w,
      h: dragItem.pos.h,
      x,
      y
    }
    const hasDragPosBlank = manager.isBlank(toPos)
    if (!hasDragPosBlank) return
    manager.mark(toPos)
    dragItem.pos.x = x
    dragItem.pos.y = y
  }

  public async layout(items: Item[], options: any) {
    if (!this.manager.container) return
    return this.throttle(() => {
      this.patchDirection()
      return true
    })
  }

  init(...args: any[]): AnalysisResult | void {
    return undefined;
  }
}
