import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {tempStore} from "@/global";

/**
 * Item resize事件对象
 * 请注意，如果想实现Limit限制，请尽量使用maxWidth,minHeight...等限制样式
 * */
export class ItemResizeEvent extends ItemLayoutEvent {
  public w: number // 当前的占用网格的宽
  public h: number // 当前的占用网格的宽

  constructor(...args) {
    super(...args);
    const {
      isResizing,
      isLeftMousedown,
      fromItem,
      mousemoveEvent: resizeEv,
    } = tempStore
    if (!isResizing || !isLeftMousedown) return
    if (!fromItem || !resizeEv || !isLeftMousedown) return
    const curW = fromItem.pxToW(this.mousePointX) // 这里非精确计算，差了多col时一个margin的距离，影响不大
    const curH = fromItem.pxToH(this.mousePointY)
    this.w = curW < 1 ? 1 : curW
    this.h = curH < 1 ? 1 : curH
  }

  /**
   * 派发resize
   * */
  public patchResizeDirection() {
    let {
      fromItem,
      mousemoveEvent: resizeEv,
    } = tempStore
    if (!fromItem || !resizeEv) return
    const bus = this.container.bus

    if (this.mousePointX > this.lastMousePointX) {
      bus.emit('resizeToRight')   // resizeOuterRight 的同时 resizeToRight也会触发
      if (this.mousePointX > this.offsetRight) bus.emit('resizeOuterRight')
    }
    if (this.mousePointX < this.lastMousePointX) {
      bus.emit('resizeToLeft')
      if (this.mousePointX < 0 && Math.abs(this.mousePointX) > this.offsetLeft) bus.emit('resizeOuterLeft')
    }
    if (this.mousePointY > this.lastMousePointY) {
      bus.emit('resizeToBottom')
      if (this.mousePointY > this.offsetBottom) bus.emit('resizeOuterBottom')
    }
    if (this.mousePointY < this.lastMousePointY) {
      bus.emit('resizeToTop')
      if (this.mousePointY < 0 && Math.abs(this.mousePointY) > this.offsetTop) bus.emit('resizeOuterTop')
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
      manager.mark(targetItem.pos)  // 如果失败，标记回去
      return false
    }
    manager.mark(targetPos)
    targetItem.pos.w = targetPos.w
    targetItem.pos.h = targetPos.h
    targetItem.updateItemLayout()
    return true
  }
}