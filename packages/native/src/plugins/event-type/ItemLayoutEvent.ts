import {BaseEvent} from "@/plugins/event-type/BaseEvent";
import {Item} from "@/main";
import {CustomItemPos} from "@/types";
import {createModifyPosInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/events";

export class ItemLayoutEvent extends BaseEvent {
  public mousePointX: number // 当前鼠标距离item左上角的点的X方向距离，可以是负数
  public mousePointY: number // 当前鼠标距离item左上角的点的Y方向距离，可以是负数
  public relativeX: number // 当前鼠标距离源容器的真实x栅格值
  public relativeY: number   // 当前鼠标距离源容器的真实y栅格值
  public gridX: number  // 当前鼠标距离源容器且被限制在容器内位置的X值
  public gridY: number  // 当前鼠标距离源容器且被限制在容器内位置的Y值

  /**
   * 是否是静态布局  TODO 后续可能更改
   * */
  public static: boolean = false
  /**
   * 当前要布局使用的items,开发者可以自定义替换Item列表，后面更新将以列表为准
   * 注意：列表中的成员必须是已经挂载在的引用
   * */
  public items: Item[]

  constructor(options) {
    super(options);
    this.items = this.container.engine.items
    //--------------------------------------//
    const {
      fromItem,
      mousedownEvent,
      mousemoveEvent,
      fromContainer,
    } = tempStore
    if (!fromItem || !mousedownEvent || !fromContainer || !mousemoveEvent) return
    const {left, top} = fromItem.element.getBoundingClientRect()
    this.mousePointX = mousemoveEvent.clientX - left
    this.mousePointY = mousemoveEvent.clientY - top
    const {left: containerLeft, top: containerTop} = fromItem.container.contentElement.getBoundingClientRect()
    const relativeLeftTopX4Container = mousemoveEvent.clientX - containerLeft
    const relativeLeftTopY4Container = mousemoveEvent.clientY - containerTop
    this.relativeX = fromItem.pxToW(relativeLeftTopX4Container) * Math.sign(relativeLeftTopX4Container)
    this.relativeY = fromItem.pxToH(relativeLeftTopY4Container) * Math.sign(relativeLeftTopY4Container)
    const contentBoxW = fromItem.container.contentBoxW
    const contentBoxH = fromItem.container.contentBoxH
    this.gridX = this.relativeX < 1 ? 1 : (this.relativeX > contentBoxW ? contentBoxW : this.relativeX)
    this.gridY = this.relativeY < 1 ? 1 : (this.relativeY > contentBoxH ? contentBoxH : this.relativeY)
    // console.log(this.mousePointX, this.mousePointY)
    // console.log(this.relativeX, this.relativeY, this.gridX, this.gridY)
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
