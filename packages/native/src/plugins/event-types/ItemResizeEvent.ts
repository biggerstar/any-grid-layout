import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {tempStore} from "@/global";
import {isNumber} from "is-what";
import {clamp} from "@/utils";

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
}
