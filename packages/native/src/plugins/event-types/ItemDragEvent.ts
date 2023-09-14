import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {isFunction} from "is-what";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {getMovableRange, spiralTraversal} from "@/utils";
import {tempStore} from "@/global";

export class ItemDragEvent extends ItemLayoutEvent {
  public toItem: Item | null

  constructor(opt) {
    super(opt);
    this.toItem = tempStore.toItem
  }

  /**
   * 在某个item的基础上创建其要修改的pos信息
   * @param oneItemFunc fromItem覆盖目标只需要操作一个的时候执行的函数，如果存在多个取第一个，默认为null
   * @param multipleItemFunc fromItem覆盖目标没有指定onlyOneItemFunc时或者覆盖多个的时候执行的函数，默认为null
   *
   * */
  public findDiffCoverItem(oneItemFunc: Function | null, multipleItemFunc: Function = null): void {
    const {fromItem} = tempStore
    if (!fromItem) return
    // console.log(x,y);
    let toItemList = this.container.layoutManager.findCoverItemsFromPosition(this.items, {
      ...fromItem.pos,
      x: this.gridX,
      y: this.gridY
    })
    if (!toItemList.length) return
    toItemList = toItemList.filter(item => item !== fromItem)
    if (toItemList.length === 1 && isFunction(oneItemFunc)) {
      (oneItemFunc as Function)(toItemList[0])
    } else {
      if (isFunction(multipleItemFunc)) {
        toItemList.forEach((item) => multipleItemFunc(item))
      }
    }
  }

  /**
   * 其他Item静止，快速更新拖动Item到当前鼠标合适空白位置上
   * 只会更新一个Item
   * 如果不传入任何参数，则使用fromItem 或 relativeX，relativeY生成的pos
   * @param item？ 当前要移动的item
   * @param pos  当前移动到新位置的pos
   * */
  public tryMoveToBlank(item?: Item, pos?: Partial<Pick<CustomItemPos, 'x' | 'y'>>): boolean {
    let {fromItem} = tempStore
    const targetItem = item || fromItem
    if (!targetItem) return false
    const targetPos = pos
      ? {
        ...targetItem.pos,
        ...pos
      }
      : {
        ...targetItem.pos,
        x: this.relativeX,
        y: this.relativeY,
      }
    const securityPos = getMovableRange(targetItem,targetPos)
    //-------------------------------------
    const container = this.container
    const manager = container.layoutManager
    const isBlank = manager.unmark(targetItem.pos).isBlank(securityPos)
    if (!isBlank) {
      manager.mark(targetItem.pos)  // 如果失败，标记回去
      return false
    }
    manager.mark(securityPos)
    targetItem.pos.x = securityPos.x
    targetItem.pos.y = securityPos.y
    targetItem.updateItemLayout()
    return true
  }

  /**
   * 尝试移动到附近有空白位置的地方
   * @param options
   * @param options.radius  拓展的半径倍数
   *                        最终range.w的计算方式: 扩展的直径(radius * 2 ) + 1(当前x,y原点),合并后为fromItem.pos.w * (radius * 2) + 1
   * */
  public tryMoveToNearestBlank({radius = 1} = {}): boolean {
    const {fromItem} = tempStore
    if (!fromItem) return false
    const manager = this.layoutManager
    const rangeMinX = this.gridX - fromItem.pos.w * radius
    const rangeMinY = this.gridY - fromItem.pos.h * radius
    const range = {  // 当前item位置扩大两倍宽高的矩形范围
      x: rangeMinX < 1 ? 1 : rangeMinX,
      y: rangeMinY < 1 ? 1 : rangeMinY,
      w: fromItem.pos.w * radius * 2 + 1,
      h: fromItem.pos.h * radius * 2 + 1,
    }
    const allBlankRange = []
    const matrix = new Array(range.h).fill(new Array(range.w).fill(0))
    manager.unmark(fromItem.pos)   // 先释放fromItem.pos位置
    spiralTraversal(matrix, (row, col) => {
      const targetPos = {
        x: range.x + col,
        y: range.y + row,
        w: fromItem.pos.w,
        h: fromItem.pos.h,
      }
      const isBlank = manager.isBlank(targetPos)
      if (isBlank) {
        allBlankRange.push(targetPos)
      }
    })
    allBlankRange.push(fromItem.pos)
    let minimumArea = Infinity
    let finallyPos = fromItem.pos  // 如果没找到则不变
    allBlankRange.forEach(range => {
      const W = Math.abs(this.gridX - range.x) + 1
      const H = Math.abs(this.gridY - range.y) + 1
      const area = W * H  // 求最小面积
      if (area <= minimumArea) { // 最后一个是fromItem，保证前面所有计算后的最小面积等于当前fromItem面积，此时不会进行改变位置
        minimumArea = area
        finallyPos = range
      }
    })
    if (!isFinite(minimumArea)) {
      manager.mark(fromItem.pos) // 如果失败，fromItem.pos位置标记回去
      return false
    }
    if (allBlankRange.length) {
      this.tryMoveToBlank(fromItem, finallyPos)
      manager.mark(finallyPos)  // 如果成功，标记新的pos位置
    }
    return true
  }

  /**
   * 检测是否允许本次布局，检测方位drag，resize window
   * 目的：防止move事件太快造成item移动太过灵敏发生抖动
   * 检测规则:
   *      如果当前fromItem覆盖区域只有当前fromItem的源item，则忽略移动
   *      如果fromItem移动区域下为空位置，忽略移动
   * 这是一个骚操作，建议不要使用
   * */
  public allowLayout() {
    const container = this.container
    const {toItem, fromItem, isDragging} = tempStore
    if (!fromItem) return true   // 不是drag时就是resize浏览器或者元素盒子窗口
    if (isDragging) {
      if (!toItem || toItem === fromItem) {
        const foundItems = container.layoutManager.findCoverItemsFromPosition(container.items, {
          ...fromItem?.pos,
          x: this.gridX,
          y: this.gridY
        })
        if (foundItems.length <= 1) return
      }
    }
    return true
  }

  /**
   * 分析当前鼠标drag操作移动在源item的某个方向，并执行对应方向的钩子
   * */
  public patchDragDirection() {
    let {
      fromItem,
      toItem,
      toContainer
    } = tempStore
    if (!fromItem) return
    const bus = this.container.bus
    const X = this.relativeX - fromItem.pos.x
    const Y = this.relativeY - fromItem.pos.y
    // console.log(X,Y);
    // console.log(x, y);
    if (!toContainer && fromItem) {
      if (X !== 0) {
        if (X > 0) bus.emit('dragOuterRight')
        if (X < 0) bus.emit('dragOuterLeft')
      } else if (Y !== 0) {
        if (Y > 0) bus.emit('dragOuterBottom')
        if (Y < 0) bus.emit('dragOuterTop')
      }
    } else if (toContainer && !toItem) {
      bus.emit('dragToBlank')
    } else if (X !== 0 && Y !== 0) {
      if (X > 0 && Y > 0) bus.emit('dragToRightBottom')
      else if (X < 0 && Y > 0) bus.emit('dragToLetBottom')
      else if (X < 0 && Y < 0) bus.emit('dragToLeftTop')
      else if (X > 0 && Y < 0) bus.emit('dragToRightTop')
    } else if (X !== 0) {
      if (X > 0) bus.emit("dragToRight")
      if (X < 0) bus.emit("dragToLeft")
    } else if (Y !== 0) {
      if (Y > 0) bus.emit("dragToBottom")
      if (Y < 0) bus.emit("dragToTop")
    }
  }
}
