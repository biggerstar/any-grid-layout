import {BaseEvent} from "@/plugin/event-type/BaseEvent";
import {tempStore} from "@/events";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {createModifyPosInfo} from "@/algorithm/common/tool";
import {getMovableRange} from "@/utils";

export class ItemLayoutEvent extends BaseEvent {
  constructor(...args) {
    super(...args);
    this.items = this.container.engine.items
  }

  /**
   * 是否是静态布局  TODO 后续可能更改
   * */
  public static: boolean = false
  /**
   * 当前要布局使用的items,开发者可以自定义替换Item列表，后面更新将以列表为准
   * 注意：列表中的成员必须是已经挂载在的引用
   * */
  public items: Item[]

  /**
   * 两个item的尺寸是否相等
   * */
  public equalSize(item1: Item, item2: Item) {
    return (item1.pos.w === item2.pos.w) && (item1.pos.h === item2.pos.h)
  }

  /**
   * 派发Items的样式更新
   * */
  public patchStyle(items?: Item[]) {
    requestAnimationFrame(() => (items || this.items).forEach((item) => item.updateItemLayout()))
  }

  /**
   * 下次要修改的Item
   * */
  private _modifyItems: Array<{ item: Item, pos: CustomItemPos }> = []

  /**
   * 获取要修改的Items并清空当前列表,所有要修改的Item都添加到这里来，不要修改item本身的pos，后面检测能添加的时候会自动修改
   * */
  public addModifyItems(item: Item, pos: Partial<CustomItemPos> = {}) {
    const info: { item: Item, pos: CustomItemPos } = createModifyPosInfo(item, pos)
    this._modifyItems.push(info)
  }

  /**
   * 获取要修改的Items并清空当前列表
   * */
  public getModifyItems() {
    const _items = this._modifyItems
    this._modifyItems = []
    return _items
  }

  /**
   * 判断当前container的baseline方向盒子是否能自动增长
   * */
  public hasAutoDirection() {
    const container = this.container
    const baseLine = container.getConfig("baseLine")
    if (['top', 'bottom'].includes(baseLine) && container.autoGrowRow) return true
    else if (['left', 'right'].includes(baseLine) && container.autoGrowCol) return true
    return false
  }

  /**
   * 在某个item的基础上创建其要修改的pos信息
   * @param oneItemFunc dragItem覆盖目标只需要操作一个的时候执行的函数，如果存在多个取第一个，默认为null
   * @param multipleItemFunc dragItem覆盖目标没有指定onlyOneItemFunc时或者覆盖多个的时候执行的函数，默认为null
   *
   * */
  public findDiffCoverItem(oneItemFunc: Function | null, multipleItemFunc: Function = null): void {
    const {dragItem, gridX: x, gridY: y} = tempStore
    if (!dragItem) return
    // console.log(x,y);
    let toItemList = this.container.layoutManager.findCoverItemsFromPosition(this.items, {
      ...dragItem.pos,
      x,
      y
    })
    if (!toItemList.length) return
    toItemList = toItemList.filter(item => item !== dragItem)
    if (toItemList.length === 1 && typeof oneItemFunc === 'function') {
      oneItemFunc(toItemList[0])
    } else {
      if (typeof multipleItemFunc === 'function') {
        toItemList.forEach((item) => multipleItemFunc(item))
      }
    }
  }

  /**
   * 其他Item静止，快速更新拖动Item到当前鼠标合适空白位置上
   * 只会更新一个Item
   * 如果不传入任何参数，则使用dragItem 或 relativeX，relativeY生成的pos
   * @param item？ 当前要移动的item
   * @param pos  当前移动到新位置的pos
   * */
  public tryMoveToBlank(item?: Item, pos?: Pick<CustomItemPos, 'x' | 'y' | 'w' | 'h'>): boolean {
    let {
      dragItem,
      relativeX,
      relativeY,
    } = tempStore
    const targetItem = item || dragItem
    if (!targetItem) return false
    const targetPos = pos || {
      ...targetItem.pos,
      x: relativeX,
      y: relativeY,
    }
    const securityPos = getMovableRange(targetPos)
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
   * 检测是否允许本次布局，检测方位drag，resize window
   * 目的：防止move事件太快造成item移动太过灵敏发生抖动
   * 检测规则:
   *      如果当前dragItem覆盖区域只有当前dragItem的源item，则忽略移动
   *      如果dragItem移动区域下为空位置，忽略移动
   * */
  public allowLayout() {
    const container = this.container
    const {toItem, dragItem, isDragging, gridX, gridY} = tempStore
    if (!dragItem) return true   // 不是drag时就是resize浏览器或者元素盒子窗口
    if (isDragging) {
      if (!toItem || toItem === dragItem) {
        const foundItems = container.layoutManager.findCoverItemsFromPosition(container.engine.items, {
          ...dragItem?.pos,
          x: gridX,
          y: gridY
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
      dragItem,
      toItem,
      relativeX: x,
      relativeY: y,
      toContainer
    } = tempStore
    if (!dragItem) return
    const bus = this.container.bus
    const X = x - dragItem.pos.x
    const Y = y - dragItem.pos.y
    // console.log(X,Y);
    // console.log(x, y);
    if (!toContainer && dragItem) {
      if (X !== 0) {
        if (X > 0) bus.emit('dragOutsizeRight')
        if (X < 0) bus.emit('dragOutsizeLeft')
      } else if (Y !== 0) {
        if (Y > 0) bus.emit('dragOutsizeBottom')
        if (Y < 0) bus.emit('dragOutsizeTop')
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
