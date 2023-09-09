import {ItemLayoutEvent} from "@/plugins/event-type/ItemLayoutEvent";
import {tempStore} from "@/events";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";

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
    if (!isResizing || !isLeftMousedown) return
    if (!fromItem || !resizeEv || !isLeftMousedown) return

    const curW = fromItem.pxToW(this.mousePointX) // 这里非精确计算，差了多col时一个margin的距离，影响不大
    const curH = fromItem.pxToH(this.mousePointY)
    const {left: itemRight, top: itemTop} = fromItem.element.getBoundingClientRect()
    const {right: containerRight, bottom: containerBottom} = this.container.contentElement.getBoundingClientRect()
    const {width: cloneElWidth, height: cloneElHeight} = (cloneElement || fromItem.element).getBoundingClientRect()
    //-------------------------------------------------------------------------------------//
    this.w = curW < 1 ? 1 : curW
    this.h = curH < 1 ? 1 : curH
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

  get spaceW() {
    const {fromItem} = tempStore
    if (!fromItem) return
    return fromItem.pxToW(this.spaceRight)
  }

  get spaceH() {
    const {fromItem} = tempStore
    if (!fromItem) return
    return fromItem.pxToH(this.spaceBottom)
  }

  /**
   * 派发resize
   * */
  public patchResizeDirection() {
    let {
      fromItem,
      mousemoveResizeEvent: resizeEv,
    } = tempStore
    if (!fromItem || !resizeEv) return
    const bus = this.container.bus

    if (this.mousePointX > this.itemWidth) {
      bus.emit('resizeToRight')   // resizeOuterRight 的同时 resizeToRight也会触发
      if (this.mousePointX > this.offsetRight) bus.emit('resizeOuterRight')
    }
    if (this.mousePointX < this.itemWidth) {
      bus.emit('resizeToLeft')
      if (this.mousePointX < 0 && Math.abs(this.mousePointX) > this.offsetLeft) bus.emit('resizeOuterLeft')
    }
    if (this.mousePointY > this.itemHeight) {
      bus.emit('resizeToBottom')
      if (this.mousePointY > this.offsetBottom) bus.emit('resizeOuterBottom')
    }
    if (this.mousePointY < this.itemHeight) {
      bus.emit('resizeToTop')
      if (this.mousePointY < 0 && Math.abs(this.mousePointY) > this.offsetTop) bus.emit('resizeOuterTop')
    }
  }

  /**
   * 尝试更新当前Item的大小
   * 其他Item静止,只会更新一个Item
   * 如果不传入任何参数，则使用dragItem 或 relativeX，relativeY生成的pos
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
