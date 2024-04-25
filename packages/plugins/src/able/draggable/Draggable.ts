import {isFunction} from "is-what";
import {BaseAble, Item, OnMousedown, OnMousemove, OnMouseup, spiralTraversal, tempStore} from "@biggerstar/layout";
import {DraggableEventBusType, DraggableEventMap} from "@/able/draggable/event-types";

export type DraggableState = {
  userSelect: boolean
}

export class Draggable extends BaseAble<DraggableEventBusType, DraggableState> {
  constructor(opt: any) {
    super(opt, DraggableEventMap)
    const _this = this
    this.state = {
      userSelect: true
    }
    this.use({
      mousedown(ev: OnMousedown) {

      },
      mousemove(ev: OnMousemove) {
        console.log(ev.offsetGridX, ev.offsetGridY)
        _this.patchDragDirection(ev)
      },
      mouseup(ev: OnMouseup) {
      },

    })
  }

  public setState(state: Partial<DraggableState>) {
    Object.assign(this.state, state)
    const containerElement: HTMLElement = this.container.element
    if (state.userSelect === false) {
      containerElement.style.userSelect = 'none'
    } else {
      containerElement.style.userSelect = 'auto'
    }


  }

  /**
   * 创建被fromItem所覆盖的item在下次变动时新的的pos信息
   * @param oneItemFunc fromItem覆盖目标只需要操作一个的时候执行的函数，如果存在多个取第一个，默认为null
   * @param multipleItemFunc fromItem覆盖目标没有指定onlyOneItemFunc时或者覆盖多个的时候执行的函数，默认为null
   *
   * */
  public findDiffCoverItem(oneItemFunc: Function | null, multipleItemFunc: Function = null): Item[] {
    const {fromItem} = tempStore
    if (!fromItem) return []
    const findPos = {
      w: Math.abs(this.fromItem.pos.x - this.startGridX) + fromItem.pos.w,
      h: Math.abs(this.fromItem.pos.y - this.startGridY) + fromItem.pos.h,
      x: Math.min(this.startGridX, <number>fromItem.pos.x),
      y: Math.min(this.startGridY, <number>fromItem.pos.y)
    }
    let toItemList = this.container.layoutManager.findCoverItemsFromPosition(this.items, findPos, [fromItem])
    // console.log(toItemList)
    if (!toItemList.length) return []
    toItemList = toItemList.filter(item => item !== fromItem)
    if (toItemList.length === 1 && isFunction(oneItemFunc)) {
      (oneItemFunc as Function)(toItemList[0])
    } else {
      if (isFunction(multipleItemFunc)) {
        toItemList.forEach((item) => multipleItemFunc(item))
      }
    }
    return toItemList
  }

  /**
   * 尝试移动到附近有空白位置的地方
   * @param options
   * @param options.radius  拓展的半径倍数,最大的length为8
   *                        最终range.w的计算方式: 扩展的直径(radius * 2 ) + 1(当前x,y原点),合并后为fromItem.pos.w * (radius * 2) + 1
   *
   * @return {boolean} 是否移动成功
   * */
  public autoMoveToNearBlank({radius = 1, maxLen = 8} = {}): boolean {
    const {fromItem} = tempStore
    if (!fromItem) return false
    const manager = this.container.layoutManager
    const isSuccess = this.setItemPos(fromItem, {
      x: this.startRelativeX,
      y: this.startRelativeY,
    })
    if (isSuccess) {
      return false
      // 如果当前位置有空位则直接移动过去，不进行周边空位检测
    }
    //---------------------------开始判定移动到周边空位了逻辑----------------------------------//
    const rangeMinX = this.gridX - fromItem.pos.w * radius
    const rangeMinY = this.gridY - fromItem.pos.h * radius
    const baseRange = {  // 当前item位置扩大两倍宽高的矩形范围
      x: rangeMinX < 1 ? 1 : rangeMinX,
      y: rangeMinY < 1 ? 1 : rangeMinY,
      w: Math.min(fromItem.pos.w * radius * 2 + 1, maxLen),
      h: Math.min(fromItem.pos.h * radius * 2 + 1, maxLen),
    }
    // console.log(baseRange)
    const allBlankRange = []
    const matrix = new Array(baseRange.h).fill(new Array(baseRange.w).fill(0))
    manager.unmark(fromItem.pos)   // 先释放fromItem.pos位置
    spiralTraversal(matrix, (row, col) => {
      const targetPos = {
        x: baseRange.x + col,
        y: baseRange.y + row,
        w: fromItem.pos.w,
        h: fromItem.pos.h,
      }
      const isBlank = manager.isBlank(targetPos)
      if (isBlank) {
        allBlankRange.push(targetPos)
      }
    })
    allBlankRange.push(fromItem.pos)
    // console.log(allBlankRange)
    let minimumArea = Infinity
    let finallyPos = fromItem.pos  // 如果没找到则不变
    allBlankRange.forEach(range => {
      const W = Math.abs(this.relativeX - range.x) + 1
      const H = Math.abs(this.relativeY - range.y) + 1
      const area = W * H   // 求最小面积
      if (area <= minimumArea) {  // 最后一个是fromItem，保证前面所有计算后的最小面积等于当前fromItem面积，此时不会进行改变位置
        minimumArea = area
        // console.log(range)
        finallyPos = range
      }
    })
    if (!isFinite(minimumArea)) {
      manager.mark(fromItem.pos, fromItem) // 如果失败，fromItem.pos位置标记回去
      return false
    }
    if (allBlankRange.length) {
      // console.log(minimumArea, finallyPos)
      this.setItemPos(fromItem, finallyPos)
      manager.mark(finallyPos, fromItem)  // 如果成功，标记新的pos位置
    }
    return true
  }

  /**
   * 分析当前鼠标drag操作移动在源item的某个方向，并执行对应方向的钩子
   * */
  private patchDragDirection(ev: OnMousemove) {
    if (!tempStore.isLeftMousedown) {
      return
    }
    const bus = this.bus
    const offsetX = ev.offsetLeft - tempStore.lastOffsetLeft
    const offsetY = ev.offsetTop - tempStore.lastOffsetTop
    tempStore.lastOffsetLeft = ev.offsetLeft
    tempStore.lastOffsetTop = ev.offsetTop
    // console.log(offsetX, offsetY)
    const eventParam = {
      offsetLeft: ev.offsetLeft,
      offsetTop: ev.offsetTop,
      offsetGridX: ev.offsetGridX,
      offsetGridY: ev.offsetGridY,
    }
    /*-------------------------------------------------*/
    this.bus.emit('dragging', eventParam)
    if (offsetX !== 0) {
      if (offsetX < 0) {
        bus.emit("dragToLeft", eventParam)
      } else {
        if (offsetX > 0) {
          bus.emit("dragToRight", eventParam)
        }
      }
    }
    if (offsetY !== 0) {
      if (offsetY < 0) {
        bus.emit("dragToTop", eventParam)
      } else {
        if (offsetY > 0) {
          bus.emit("dragToBottom", eventParam)
        }
      }
    }
  }
}
