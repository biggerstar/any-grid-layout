import {isNumber} from "is-what";
import {clamp, Container, ItemLayoutEvent, tempStore} from "@biggerstar/layout";

export class Resizeable {
  public container: Container

  public readonly w: number // 当前的占用网格的宽
  public readonly h: number // 当前的占用网格的宽
  public readonly startGridX: number // 克隆元素左上角位于当前网格容器左上角的限制在容器内的相对栅格X位置,和drag解释一样
  public readonly startGridY: number // 克隆元素左上角位于当前网格容器左上角的限制在容器内的相对栅格Y位置,和drag解释一样

  public readonly itemInfo: DOMRect & {  // 源item的信息
    minWidth: number           // 和fromItem的minWidth函数的值是一样的，下方同理
    maxWidth: number
    minHeight: number
    maxHeight: number
    offsetLeft: number         // fromItem距离当前容器左边界的距离
    offsetTop: number          // fromItem距离当前容器上边界的距离
    offsetRight: number        // fromItem距离当前容器右边界的距离
    offsetBottom: number       // fromItem距离当前容器下边界的距离
    offsetX: number            // 当前鼠标位置相对clone元素左上角的left距离
    offsetY: number            // 当前鼠标位置相对clone元素左上角的top距离
    offsetClickWidth: number   // 鼠标首次点击位置距离clone元素左上角距离
    offsetClickHeight: number  // 鼠标首次点击位置距离clone元素左上角距离
  }

  constructor() {
    const {
      fromItem,
      fromContainer,
      mousemoveEvent,
      toContainer,
      mousedownItemOffsetTopProportion: PT,
      mousedownItemOffsetLeftProportion: PL
    } = tempStore
    this.container = toContainer || fromContainer
    const container = this.container
    tempStore.mousedownResizeStartX = <number>fromItem.pos.x
    tempStore.mousedownResizeStartY = <number>fromItem.pos.y
    /*--------------- ItemInfo Rect -------------------*/
    const itemRect = container.STRect.getCache("fromItem")

    const itemInfo: ItemLayoutEvent["itemInfo"] = this.itemInfo = itemRect as any
    itemInfo.minWidth = fromItem.minWidth()
    itemInfo.maxWidth = fromItem.maxWidth()
    itemInfo.minHeight = fromItem.minHeight()
    itemInfo.maxHeight = fromItem.maxHeight()
    itemInfo.offsetTop = fromItem.offsetTop()
    itemInfo.offsetRight = fromItem.offsetRight()
    itemInfo.offsetBottom = fromItem.offsetBottom()
    itemInfo.offsetLeft = fromItem.offsetLeft()
    itemInfo.offsetX = mousemoveEvent.clientX - itemRect.left
    itemInfo.offsetY = mousemoveEvent.clientY - itemRect.top
    itemInfo.offsetClickWidth = itemInfo.width * PT
    itemInfo.offsetClickHeight = itemInfo.height * PL

    const {
      isResizing,
      isLeftMousedown,
      cloneElement,
      mousedownResizeStartX,
      mousedownResizeStartY,
    } = tempStore
    if (!fromItem || !mousemoveEvent || !isResizing || !isLeftMousedown || !cloneElement) return
    this.w = clamp(this.container.pxToW(this.itemInfo.offsetX, {keepSymbol: true}), 1, Infinity)
    this.h = clamp(this.container.pxToH(this.itemInfo.offsetY, {keepSymbol: true}), 1, Infinity)
    this.startGridX = <number>mousedownResizeStartX
    this.startGridY = <number>mousedownResizeStartY
    // this.spaceInfo.spaceRight = this.fromItem.spaceRight()
    // this.spaceInfo.spaceBottom = this.fromItem.spaceBottom()
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


// //---------------resize开始和结束事件-------------------
// resizing?(ev: ItemResizeEvent): void,
//   resized?(ev: ItemResizeEvent): void,
//
//   //-------------resize到十字线方向的事件------------------
//   resizeToTop?(ev: ItemResizeEvent): void,
//   resizeToRight?(ev: ItemResizeEvent): void,
//   resizeToBottom?(ev: ItemResizeEvent): void,
//   resizeToLeft?(ev: ItemResizeEvent): void,

