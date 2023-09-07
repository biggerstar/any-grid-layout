import {BaseEvent} from "@/plugin/event-type/BaseEvent";
import {tempStore} from "@/events";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {createModifyPosInfo} from "@/algorithm/common/tool";

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
    const baseLine = this.container.getConfig("baseLine")
    if (['top', 'bottom'].includes(baseLine) && this.container.autoGrowRow) return true
    else if (['left', 'right'].includes(baseLine) && this.container.autoGrowCol) return true
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
   * 移动到当前鼠标位置的空白处，移动的前提是当前位置没有其他Item
   * */
  public moveToBlank(layoutItems: Item[]) {
    let {
      dragItem,
      relativeX: x,
      relativeY: y,
    } = tempStore
    if (!dragItem || !x || !y) return
    const container = this.container
    const manager = container.layoutManager
    container.engine.reset()
    layoutItems.forEach((item) => {
      if (item === dragItem) return  // 当前的dragItem另外判断
      if (!manager.isBlank(item.pos)) return;
      manager.mark(item.pos)
    })
    const maxItemX = Math.min(x, container.getConfig("col") - dragItem.pos.w + 1)
    const maxItemY = Math.min(y, container.getConfig("row") - dragItem.pos.h + 1)
    x = maxItemX > 0 ? maxItemX : 1  // left和top边界
    y = maxItemY > 0 ? maxItemY : 1
    const toPos = {
      w: dragItem.pos.w,
      h: dragItem.pos.h,
      x,
      y
    }
    // console.log(x, y)
    const hasDragPosBlank = manager.isBlank(toPos)
    if (!hasDragPosBlank) return
    manager.mark(toPos)
    dragItem.pos.x = x
    dragItem.pos.y = y
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
      gridX: x,
      gridY: y,
      toContainer
    } = tempStore
    if (!dragItem) return
    const bus = this.container.bus
    const X = x - dragItem.pos.x
    const Y = y - dragItem.pos.y
    // console.log(X,Y);
    if (!toContainer && dragItem) {
      if (X !== 0) {
        if (X > 0) bus.emit('dragOutsizeRight')
        if (X < 0) bus.emit('dragOutsizeLeft')
      } else if (Y !== 0) {
        if (Y > 0) bus.emit('dragOutsizeBottom')
        if (Y < 0) bus.emit('dragOutsizeTop')
      }
    } else if (this.static) {
      if (!toItem || dragItem === toItem) bus.emit('dragToBlank')
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
