import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {tempStore} from "@/global";

/**
 * Item resize事件对象
 * 请注意，如果想实现Limit限制，请尽量使用maxWidth,minHeight...等限制样式
 * */
export class ItemResizeEvent extends ItemLayoutEvent {
  public readonly w: number // 当前的占用网格的宽
  public readonly h: number // 当前的占用网格的宽
  public readonly startX: number // 克隆元素左上角位于当前网格容器左上角相对的栅格X位置,和drag解释一样
  public readonly startY: number // 克隆元素左上角位于当前网格容器左上角相对中的栅格Y位置,和drag解释一样
  constructor(...args) {
    super(...args);
    const {
      isResizing,
      isLeftMousedown,
      fromItem,
      mousedownResizeStartX,
      mousedownResizeStartY,
      mousemoveEvent: resizeEv,
    } = tempStore
    if (!isResizing || !isLeftMousedown) return
    if (!fromItem || !resizeEv || !isLeftMousedown) return
    const curW = this.container.pxToW(this.mousePointX) // 这里非精确计算，差了多col时一个margin的距离，影响不大
    const curH = this.container.pxToH(this.mousePointY)
    this.w = curW < 1 ? 1 : curW
    this.h = curH < 1 ? 1 : curH
    this.startX = <number>mousedownResizeStartX
    this.startY = <number>mousedownResizeStartY
  }

  /**
   * 派发判定resize方向
   * */
  public patchResizeDirection() {
    let {
      fromItem,
      mousemoveEvent: resizeEv,
    } = tempStore
    if (!fromItem || !resizeEv) return
    const bus = this.container.bus
    if (this.mousePointX > this.lastMousePointX) {
      bus.emit('resizeToRight')
    }
    if (this.mousePointX < this.lastMousePointX) {
      bus.emit('resizeToLeft')
    }
    if (this.mousePointY > this.lastMousePointY) {
      bus.emit('resizeToBottom')
    }
    if (this.mousePointY < this.lastMousePointY) {
      bus.emit('resizeToTop')
    }
  }

  /**
   * 尝试更新当前Item的大小
   * 其他Item静止,只会更新一个Item
   * 如果不传入任何参数，则使用fromItem 或 relativeX，relativeY生成的pos
   * @param item？ 当前要移动的item
   * @param pos  当前移动到新位置的pos
   * */
  public tryChangeSize(item?: Item, pos?: Partial<Pick<CustomItemPos, 'w' | 'h'>>): boolean {
    let {
      fromItem,
    } = tempStore
    const targetItem = item || fromItem
    if (!targetItem) return false
    const targetPos = pos
      ? {
        ...targetItem.pos,
        ...pos
      }
      : {
        ...targetItem.pos,
        w: Math.min(this.w, this.spaceW),
        h: Math.min(this.h, this.spaceH),
      }
    //-------------------------------------
    const container = this.container
    const manager = container.layoutManager
    const isBlank = manager.unmark(targetItem.pos).isBlank(targetPos)
    if (!isBlank) {
      manager.mark(targetItem.pos, targetItem)  // 如果失败，标记回去
      return false
    }
    manager.mark(targetPos, targetItem)
    targetItem.pos.w = targetPos.w
    targetItem.pos.h = targetPos.h
    targetItem.updateItemLayout()
    return true
  }
}
