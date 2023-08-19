import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";

/**
 * 静态布局
 * */
export class StaticLayout extends Layout {
  public name = 'static'

  public defaultDirection(name) {
    const {
      dragItem,
      x,
      y,
    } = this.options
    if (!dragItem) return
    const manager = this.manager
    manager.reset()
    this.items.filter((item) => {
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

  public layout(items: Item[], options: any): void {
    if (!this.manager.container) return
    this.patchDirection()
    this.throttle(()=>{
      this.patchStyle()
    })
  }
}
