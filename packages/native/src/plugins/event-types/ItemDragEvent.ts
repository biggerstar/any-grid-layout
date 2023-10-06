import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {isFunction} from "is-what";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {clamp, spiralTraversal} from "@/utils";
import {tempStore} from "@/global";
import {updateContainerSize} from "@/plugins/common";


export class ItemDragEvent extends ItemLayoutEvent {
  public readonly toItem: Item | null
  public readonly toPos: CustomItemPos
  public readonly startGridX: number // 克隆元素左上角位于当前网格容器左上角相对限制在容器内的栅格X位置,和resize解释一样
  public readonly startGridY: number // 克隆元素左上角位于当前网格容器左上角相对限制在容器内的栅格Y位置,和resize解释一样
  public readonly offsetGridX: number // 当前拖动位置相对源item偏移，限制在容器内
  public readonly offsetGridY: number // 当前拖动位置相对源item偏移，限制在容器内

  constructor(opt) {
    super(opt);
    const {
      toItem,
      fromItem,
    } = tempStore
    const container = this.container
    const {offsetLeft, offsetTop, scaleMultipleX, scaleMultipleY} = this.shadowItemInfo
    const {width, height} = this.itemInfo
    const cloneElStartWidth = clamp(offsetLeft + width * (scaleMultipleX - 1), 0, this.containerInfo.width)
    const cloneElStartHeight = clamp(offsetTop + height * (scaleMultipleY - 1), 0, this.containerInfo.height)
    const hasHalfItemSizeWidth = cloneElStartWidth + (this.size[0] + this.margin[0]) / 2  // Q:为何加上toHalfItemSizeWidth? A:只有克隆元素的边界进入下一个item前往的item空位超过一半的时候才会更变startX
    const hasHalfItemSizeHeight = cloneElStartHeight + (this.size[1] + this.margin[1]) / 2  // 同上
    this.startGridX = clamp(container.pxToW(hasHalfItemSizeWidth), 1, this.col - fromItem!.pos.w + 1)
    this.startGridY = clamp(container.pxToH(hasHalfItemSizeHeight), 1, this.row - fromItem!.pos.h + 1)
    this.toPos = {
      w: this.fromItem.pos.w,
      h: this.fromItem.pos.h,
      x: this.startGridX,
      y: this.startGridY,
    }
    this.toItem = toItem
    this.offsetGridX = this.startGridX - fromItem!.pos.x
    this.offsetGridY = this.startGridY - fromItem!.pos.y
  }

  /**
   * 在某个item的基础上创建其要修改的pos信息
   * @param oneItemFunc fromItem覆盖目标只需要操作一个的时候执行的函数，如果存在多个取第一个，默认为null
   * @param multipleItemFunc fromItem覆盖目标没有指定onlyOneItemFunc时或者覆盖多个的时候执行的函数，默认为null
   *
   * */
  public findDiffCoverItem(oneItemFunc: Function | null, multipleItemFunc: Function = null): Item[] {
    const {fromItem} = tempStore
    if (!fromItem) return []
    // console.log(x,y);
    let toItemList = this.container.layoutManager.findCoverItemsFromPosition(this.items, {
      ...fromItem.pos,
      x: this.startGridX,
      y: this.startGridY
    })
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
   * 其他Item静止，快速更新拖动Item到当前鼠标合适空白位置上
   * 只会更新一个Item
   * 如果不传入任何参数，则使用fromItem 或 relativeX，relativeY生成的pos
   * @param item？ 当前要移动的item
   * @param pos  当前移动到新位置的pos
   *
   * @return {boolean} 是否移动成功
   * */
  public tryMoveToBlank(item?: Item, pos?: Partial<Pick<CustomItemPos, 'x' | 'y'>>): boolean {
    let {fromItem, mousedownItemOffsetLeftProportion: PrL, mousedownItemOffsetTopProportion: PrT} = tempStore
    const targetItem = item || fromItem
    if (!targetItem) return false
    const {container, itemInfo, shadowItemInfo, relativeX, relativeY} = this
    const manager = container.layoutManager
    const mouseDownPosW = container.pxToW(itemInfo.width * PrL * shadowItemInfo.scaleMultipleX) - 1
    const mouseDownPosH = container.pxToH(itemInfo.height * PrT * shadowItemInfo.scaleMultipleY) - 1
    const targetPos = pos
      ? {
        ...targetItem.pos,
        ...pos
      }
      : {
        ...targetItem.pos,
        x: Math.max(1, relativeX - mouseDownPosW),
        y: Math.max(1, relativeY - mouseDownPosH)
      }
    // console.log(relativeX,mouseDownPosW)
    // console.log(targetPos.x, targetItem.pos.x)
    if (targetPos.x === targetItem.pos.x && targetPos.y === targetItem.pos.y) return true
    //-------------------------------------
    manager.expandLineForPos(targetPos)
    if (fromItem && targetPos.x === fromItem.pos.x && targetPos.y === fromItem.pos.y) return true // 如果位置不变则忽略
    const isBlank = manager.unmark(targetItem.pos).isBlank(targetPos)
    if (!isBlank) {
      manager.mark(targetItem.pos, targetItem)  // 如果失败，标记回去
      return false
    }
    manager.mark(targetPos, targetItem)
    targetItem.pos.x = targetPos.x
    targetItem.pos.y = targetPos.y
    targetItem.updateItemLayout()
    updateContainerSize()
    return true
  }

  /**
   * 尝试移动到附近有空白位置的地方
   * @param options
   * @param options.radius  拓展的半径倍数,最大的length为8
   *                        最终range.w的计算方式: 扩展的直径(radius * 2 ) + 1(当前x,y原点),合并后为fromItem.pos.w * (radius * 2) + 1
   *
   * @return {boolean} 是否移动成功
   * */
  public tryMoveToNearBlank({radius = 1, maxLen = 8} = {}): boolean {
    const {fromItem} = tempStore
    if (!fromItem) return false
    const manager = this.container.layoutManager
    const isSuccess = this.tryMoveToBlank()
    if (isSuccess) return  // 如果当前位置有空位则直接移动过去，不进行周边空位检测
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
      // console.log(minimumArea,finallyPos)
      this.tryMoveToBlank(fromItem, finallyPos)
      manager.mark(finallyPos, fromItem)  // 如果成功，标记新的pos位置
    }
    return true
  }

  /**
   * 分析当前鼠标drag操作移动在源item的某个方向，并执行对应方向的钩子
   * */
  public patchDragDirection() {
    let {
      fromItem,
    } = tempStore
    if (!fromItem) return
    const bus = this.container.bus
    const X = this.shadowItemInfo.offsetRelativeX - fromItem.container.pxToW(this.itemInfo.offsetClickWidth)
    const Y = this.shadowItemInfo.offsetRelativeY - fromItem.container.pxToH(this.itemInfo.offsetClickHeight)
    // console.log(X, Y)
    if (X === 0 && Y === 0) return
    // console.log(111111111111111111)
    // console.log(X, Y, this.inOuter)
    const foundItem = this.container.layoutManager.findItemFromXY(this.items, this.gridX, this.gridY)  // 必须要startX,startY
    if (!this.inOuter && (!foundItem || foundItem === fromItem)) {
      bus.emit('dragToBlank')
    }
    if (X !== 0) {
      if (X < 0) bus.emit("dragToLeft")
      else if (X > 0) bus.emit("dragToRight")
    }
    if (Y !== 0) {
      if (Y < 0) bus.emit("dragToTop")
      else if (Y > 0) bus.emit("dragToBottom")
    }
  }
}
