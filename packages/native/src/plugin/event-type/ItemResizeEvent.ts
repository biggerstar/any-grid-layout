import {ItemLayoutEvent} from "@/plugin/event-type/ItemLayoutEvent";
import {tempStore} from "@/events";

type UpdateLimitSize = {
  width?: number | string,
  height?: number | string,
  minWidth?: number | string,
  maxWidth?: number | string,
  minHeight?: number | string,
  maxHeight?: number | string,
}

function setGlobalVarResizeSize(size: { w?: number, h?: number } = {}) {
  if (size.w) tempStore.newResizeW = size.w
  if (size.h) tempStore.newResizeH = size.h
}

/**
 * Item resize事件对象
 * 请注意，如果想实现Limit限制，请尽量使用maxWidth,minHeight...等限制样式
 * */
export class ItemResizeEvent extends ItemLayoutEvent {
  public w: number // 当前的占用网格的宽
  public h: number // 当前的占用网格的宽
  public mousePointX: number // 当前鼠标距离item左上角的点的X方向距离，可以是负数
  public mousePointY: number // 当前鼠标距离item左上角的点的Y方向距离，可以是负数
  public itemWidth: number // 当前item元素元素的高
  public itemHeight: number // 当前item元素元素的高
  public cloneElWidth: number // 当前clone元素的高
  public cloneElHeight: number // 当前clone元素的高
  public offsetTop: number // 当前item左上角的点和container top边界距离
  public offsetLeft: number // 当前item左上角的点和container left边界距离
  public offsetRight: number // 当前item左上角的点和container right边界距离
  public offsetBottom: number // 当前item左上角的点和container bottom边界距离

  constructor(...args) {
    super(...args);
    const {
      isResizing,
      isLeftMousedown,
      fromItem,
      cloneElement,
      mousemoveResizeEvent: resizeEv,
    } = tempStore
    if (!isResizing || !isLeftMousedown || !cloneElement) return
    if (!fromItem || !resizeEv || !isLeftMousedown) return
    const {left, top} = fromItem.element.getBoundingClientRect()
    const mousePointX = resizeEv.clientX - left
    const mousePointY = resizeEv.clientY - top
    const curW = Math.ceil(mousePointX / (fromItem.size[0] + fromItem.margin[0])) // 这里非精确计算，差了多col时一个margin的距离，影响不大
    const curH = Math.ceil(mousePointY / (fromItem.size[1] + fromItem.margin[1]))
    const {left: itemRight, top: itemTop} = fromItem.element.getBoundingClientRect()
    const {right: containerRight, bottom: containerBottom} = this.container.contentElement.getBoundingClientRect()
    const {width: cloneElWidth, height: cloneElHeight} = cloneElement.getBoundingClientRect()
    //-------------------------------------------------------------------------------------//
    this.w = curW < 1 ? 1 : curW
    this.h = curH < 1 ? 1 : curH
    this.mousePointX = mousePointX
    this.mousePointY = mousePointY
    this.cloneElWidth = cloneElWidth
    this.cloneElHeight = cloneElHeight
    this.itemWidth = fromItem.nowWidth()
    this.itemHeight = fromItem.nowHeight()
    this.offsetLeft = fromItem.offsetLeft()
    this.offsetTop = fromItem.offsetTop()
    this.offsetRight = containerRight - itemRight
    this.offsetBottom = containerBottom - itemTop
  }

  /**
   * 距离right方向上最近的可调整距离(包含item的width)
   * */
  get spaceRight() {
    const {fromItem} = tempStore
    if (!fromItem) return
    const manager = this.layoutManager
    const coverRightItems = manager.findCoverItemsFromPosition(this.items, {
      ...fromItem.pos,
      w: fromItem.container.getConfig('col') - fromItem.pos.x + 1
    }, [fromItem])
    let minOffsetRight = Infinity
    coverRightItems.forEach((item) => {
      const offsetRight = item.offsetLeft()
      if (minOffsetRight > offsetRight) minOffsetRight = offsetRight
    })
    let spaceRight = minOffsetRight - fromItem.offsetLeft()
    return isFinite(spaceRight) ? spaceRight : this.offsetRight
  }

  /**
   * 距离bottom方向上最近的最大可调整距离(包含item的height)
   * */
  get spaceBottom() {
    const {fromItem} = tempStore
    if (!fromItem) return
    const manager = this.layoutManager
    const coverRightItems = manager.findCoverItemsFromPosition(this.items, {
      ...fromItem.pos,
      h: fromItem.container.getConfig('row') - fromItem.pos.y + 1
    }, [fromItem])

    let minOffsetBottom = Infinity
    coverRightItems.forEach((item) => {
      const offsetBottom = item.offsetTop()
      if (minOffsetBottom > offsetBottom) minOffsetBottom = offsetBottom
    })
    let spaceBottom = minOffsetBottom - fromItem.offsetTop()
    return isFinite(spaceBottom) ? spaceBottom : this.offsetBottom
  }

  public patchResizeDirection() {
    let {
      fromItem,
      mousemoveResizeEvent: resizeEv,
    } = tempStore
    if (!fromItem || !resizeEv) return
    const bus = this.container.bus

    if (this.mousePointX > this.itemWidth) {
      bus.emit('resizeToRight')   // resizeOutsizeRight 的同时 resizeToRight也会触发
      if (this.mousePointX > this.offsetRight) bus.emit('resizeOutsizeRight')
    }
    if (this.mousePointX < this.itemWidth) {
      bus.emit('resizeToLeft')
      if (this.mousePointX < 0 && Math.abs(this.mousePointX) > this.offsetLeft) bus.emit('resizeOutsizeLeft')
    }
    if (this.mousePointY > this.itemHeight) {
      bus.emit('resizeToBottom')
      if (this.mousePointY > this.offsetBottom) bus.emit('resizeOutsizeBottom')
    }
    if (this.mousePointY < this.itemHeight) {
      bus.emit('resizeToTop')
      if (this.mousePointY < 0 && Math.abs(this.mousePointY) > this.offsetTop) bus.emit('resizeOutsizeTop')
    }
  }
}









