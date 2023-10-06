import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {tempStore} from "@/global";
import {isNumber} from "is-what";
import {clamp} from "@/utils";
import {updateContainerSize} from "@/plugins/common";

/**
 * Item resize事件对象
 * 请注意，如果想实现Limit限制，请尽量使用maxWidth,minHeight...等限制样式
 * */
export class ItemResizeEvent extends ItemLayoutEvent {
  public readonly w: number // 当前的占用网格的宽
  public readonly h: number // 当前的占用网格的宽
  public readonly startGridX: number // 克隆元素左上角位于当前网格容器左上角的限制在容器内的相对栅格X位置,和drag解释一样
  public readonly startGridY: number // 克隆元素左上角位于当前网格容器左上角的限制在容器内的相对栅格Y位置,和drag解释一样

  constructor(opt) {
    super(opt);
    const {
      isResizing,
      isLeftMousedown,
      fromItem,
      cloneElement,
      mousedownResizeStartX,
      mousedownResizeStartY,
      mousemoveEvent,
    } = tempStore
    if (!fromItem || !mousemoveEvent || !isResizing || !isLeftMousedown || !cloneElement) return
    this.w = clamp(this.container.pxToW(this.itemInfo.offsetX, {keepSymbol: true}), 1, Infinity)
    this.h = clamp(this.container.pxToH(this.itemInfo.offsetY, {keepSymbol: true}), 1, Infinity)
    this.startGridX = <number>mousedownResizeStartX
    this.startGridY = <number>mousedownResizeStartY
    this.spaceInfo.spaceRight = this.fromItem.spaceRight()
    this.spaceInfo.spaceBottom = this.fromItem.spaceBottom()
  }

  /**
   * 派发判定resize方向
   * */
  public patchResizeDirection() {
    let {
      fromItem,
      lastOffsetSelfItemX,
      lastOffsetSelfItemY,
      mousemoveEvent: resizeEv,
    } = tempStore
    const {offsetX, offsetY} = this.itemInfo
    tempStore.lastOffsetSelfItemX = offsetX
    tempStore.lastOffsetSelfItemY = offsetY
    if (!fromItem || !resizeEv || !isNumber(lastOffsetSelfItemX) || !isNumber(lastOffsetSelfItemY)) return
    const bus = this.container.bus
    if (offsetX > lastOffsetSelfItemX) {
      bus.emit('resizeToRight')
    }
    if (offsetX < lastOffsetSelfItemX) {
      bus.emit('resizeToLeft')
    }
    if (offsetY > lastOffsetSelfItemY) {
      bus.emit('resizeToBottom')
    }
    if (offsetY < lastOffsetSelfItemY) {
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
        w: this.shadowItemInfo.offsetRelativeX,
        h: this.shadowItemInfo.offsetRelativeY,
      }
    //-------------------------------------
    const container = this.container
    const manager = container.layoutManager
    targetPos.w = clamp(targetPos.w, targetItem.pos.minW, targetItem.pos.maxW)
    targetPos.h = clamp(targetPos.h, targetItem.pos.minH, targetItem.pos.maxH)
    updateContainerSize()   // 必须在判断两个pos是否相等之前
    if (targetItem.pos.w === targetPos.w && targetItem.pos.h === targetPos.h) return
    
    //-------------------------------------
    manager.unmark(targetItem.pos)
    manager.expandLineForPos(targetPos)

    const isBlank = manager.isBlank(targetPos)   // 先移除原本标记再看是否有空位
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
