import {BaseEvent} from "@/plugins/event-type/BaseEvent";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {createModifyPosInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/events";

let old = 0

export class ItemLayoutEvent extends BaseEvent {
  public mousePointX: number // 当前鼠标距离item左上角的点的X方向距离，可以是负数
  public mousePointY: number // 当前鼠标距离item左上角的点的Y方向距离，可以是负数
  public gridX: number   // 被限制在网格内的当前鼠标位置
  public gridY: number   // 同上
  public relativeX: number  // 相对当前container左上角的位置，不会被容器最大col或row限制，可能是负数
  public relativeY: number

  /**
   * 是否是静态布局  TODO 后续可能更改
   * */
  public static: boolean = false
  /**
   * 当前要布局使用的items,开发者可以自定义替换Item列表，后面更新将以列表为准
   * 注意：列表中的成员必须是已经挂载在的引用
   * */
  public items: Item[]

  constructor(...args) {
    super(...args);
    const {
      dragItem,
      mousemoveResizeEvent,
      mousemoveDragEvent,
      gridX,
      gridY,
      relativeX,
      relativeY,
    } = tempStore
    this.items = this.container.engine.items
    if(dragItem){
      const curEv = mousemoveResizeEvent || mousemoveDragEvent as MouseEvent
      const {left, top} = dragItem.element.getBoundingClientRect()
      this.mousePointX = curEv.clientX - left
      this.mousePointY = curEv.clientY - top
      this.gridX = gridX
      this.gridY = gridY
      this.relativeX = relativeX
      this.relativeY = relativeY
    }
  }

  /**
   * 该事件的默认执行执行函数，在实例化的时候会被管理器赋予执行逻辑函数，开发者也可以通过外部替换该函数更改默认行为，或者通过prevent函数阻止默认行为
   * */
  public default() {
  }

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
}
