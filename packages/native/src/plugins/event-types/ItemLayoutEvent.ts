import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {Item} from "@/main";
import {CustomItemPos, LayoutItemInfo} from "@/types";
import {analysisCurPositionInfo, createModifyPosInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/global";
import {assign} from "lodash";

export class ItemLayoutEvent extends BaseEvent {
  public readonly fromItem: Item
  public readonly mousePointX: number // 当前鼠标距离item左上角的点的X方向距离，可以是负数
  public readonly mousePointY: number // 当前鼠标距离item左上角的点的Y方向距离，可以是负数
  public readonly lastMousePointX: number | null // 上一个mousePointX位置
  public readonly lastMousePointY: number | null // 上一个mousePointY位置
  public readonly col: number // 当前容器的col
  public readonly row: number // 当前容器的row
  public readonly gridX: number // 当前鼠标位置限制在容器内的x栅格值
  public readonly gridY: number // 当前鼠标位置限制在容器内的y栅格值
  public readonly relativeX: number // 当前鼠标距离源容器的真实x栅格值
  public readonly relativeY: number   // 当前鼠标距离源容器的真实y栅格值
  public readonly itemInfo: {  // 源item的信息
    width: number // 当前源item元素元素的高
    height: number // 当前源item元素元素的高
    minWidth: number  // 和item的minWidth函数的值是一样的，下方同理
    maxWidth: number
    minHeight: number
    maxHeight: number
  } = {}
  public readonly offsetTop: number // 当前item左上角的点和container top边界距离
  public readonly offsetLeft: number // 当前item左上角的点和container left边界距离
  public readonly offsetRight: number // 当前item左上角的点和container right边界距离
  public readonly offsetBottom: number // 当前item左上角的点和container bottom边界距离
  public readonly cloneElRect: DOMRect // 当前clone元素的rect信息
  public readonly cloneElOffsetMouseLeft: number // 当前鼠标点击位置相对clone元素左上角的left距离
  public readonly cloneElOffsetMouseTop: number // 当前鼠标点击位置相对clone元素左上角的top距离
  /**
   * 当前要布局使用的items,开发者可以自定义替换Item列表，后面更新将以列表为准
   * 注意：列表中的成员必须是已经挂载在的引用
   * */
  public items: Item[]

  /**
   * 下次要修改的Item
   * */
  private _modifyItems: Array<LayoutItemInfo> = []

  constructor(options) {
    super(options);
    this.items = this.container.items
    const {
      fromItem,
      mousemoveEvent,
      lastMousePointX,
      lastMousePointY,
      cloneElement,
      mousedownItemOffsetLeftProportion,
      mousedownItemOffsetTopProportion,
    } = tempStore
    if (!fromItem || !mousemoveEvent) return
    //--------------------------------------//
    Object.assign(<object>this, analysisCurPositionInfo(fromItem.container))  // 合并 relativeX，relativeY， gridX， gridY
    const {left, top} = fromItem.element.getBoundingClientRect()
    const {
      right: containerRight,
      bottom: containerBottom,
    } = this.container.contentElement.getBoundingClientRect()
    const cloneElRect = (cloneElement || fromItem.element).getBoundingClientRect()
    this.fromItem = fromItem
    this.mousePointX = mousemoveEvent.clientX - left
    this.mousePointY = mousemoveEvent.clientY - top
    this.lastMousePointX = lastMousePointX
    this.lastMousePointY = lastMousePointY
    tempStore.lastMousePointX = this.mousePointX
    tempStore.lastMousePointY = this.mousePointY
    this.col = fromItem.container.getConfig("col")
    this.row = fromItem.container.getConfig("row")
    this.itemInfo.width = fromItem.nowWidth()
    this.itemInfo.height = fromItem.nowHeight()
    this.itemInfo.minWidth = fromItem.minWidth()
    this.itemInfo.maxWidth = fromItem.maxWidth()
    this.itemInfo.minHeight = fromItem.minHeight()
    this.itemInfo.maxHeight = fromItem.maxHeight()
    this.offsetLeft = fromItem.offsetLeft()
    this.offsetTop = fromItem.offsetTop()
    this.offsetRight = containerRight - left
    this.offsetBottom = containerBottom - top
    this.cloneElRect = cloneElRect
    this.cloneElOffsetMouseLeft = this.itemInfo.width * mousedownItemOffsetLeftProportion
    this.cloneElOffsetMouseTop = this.itemInfo.height * mousedownItemOffsetTopProportion
  }

  /**
   * [当前实时宽度] 正在resize中的宽度
   * resize范围：
   *        一个栅格单位的宽 <--- spaceWidth  --->  距离右方第一个item元素的距离
   * 受item.pos中minW,maxW和 spaceRight 限制,不会越界其他item边界宽度，正常用于静态布局限制 cloneElement 的宽
   * */
  public get spaceWidth() {
    return Math.min(this.spaceRight, this.width)
  }

  /**
   * [当前实时高度] 正在resize中的高度
   * resize范围：
   *        一个栅格单位的高  <--- spaceHeight  --->  距离下方第一个item元素的距离
   * 受item.pos中minH,maxH和 spaceBottom 限制,不会越界其他item边界的高度，正常用于静态布局限制 cloneElement 的高
   * */
  public get spaceHeight() {
    return Math.min(this.spaceBottom, this.height)
  }

  /**
   * [当前实时宽度] resize中的鼠标相对左上角的item元素距离
   * resize范围：
   *        一个栅格单位的宽  <--- width  --->  距离右侧container边界
   * 受item.pos中minW,maxW 限制,不会越界container边界的宽度，正常用于响应式布局限制 cloneElement 的宽
   * */
  public get width() {
    return Math.min(this.mousePointX, this.itemInfo.maxWidth)
  }

  /**
   * [当前实时高度] resize中的鼠标相对左上角的item元素距离
   * resize范围：
   *        一个栅格单位的高  <--- height  --->  距离下方container边界
   * 受item.pos中minH,maxH 限制,不会越界container边界的高度，正常用于响应式布局限制 cloneElement 的高
   * */
  public get height() {
    return Math.min(this.mousePointY, this.itemInfo.maxHeight)
  }

  /**
   * 限制在网格内的fromItem，当前安全resize不会溢出容器的栅格单位宽
   * */
  public get restrictedItemW(): number {
    const restrictedItemWidth = this.width
    let curW = this.container.pxToW(restrictedItemWidth) * Math.sign(restrictedItemWidth)
    if (curW < 0) curW = 1
    const maxW = this.col - this.fromItem.pos.x + 1
    return curW > maxW ? maxW : curW
  }

  /**
   * 限制在网格内的fromItem，当前安全resize不会溢出容器的栅格单位的高
   * */
  public get restrictedItemH(): number {
    const restrictedItemHeight = this.height
    let curH = this.container.pxToH(restrictedItemHeight) * Math.sign(restrictedItemHeight)
    if (curH < 0) curH = 1
    const maxH = this.row - this.fromItem.pos.y + 1
    return curH > maxH ? maxH : curH
  }

  /**
   * 距离right方向上最近的可调整距离(包含item的width)
   * */
  get spaceRight(): number {
    const manager = this.layoutManager
    const coverRightItems = manager.findCoverItemsFromPosition(this.items, {
      ...this.fromItem.pos,
      w: this.col - this.fromItem.pos.x + 1
    }, [this.fromItem])
    let minOffsetRight = Infinity
    coverRightItems.forEach((item) => {
      const offsetRight = item.offsetLeft()
      if (minOffsetRight > offsetRight) minOffsetRight = offsetRight
    })
    let spaceRight = minOffsetRight - this.fromItem.offsetLeft()
    return isFinite(spaceRight) ? spaceRight : this.offsetRight
  }

  /**
   * 距离bottom方向上最近的最大可调整距离(包含item的height)
   * */
  get spaceBottom(): number {
    const manager = this.layoutManager
    const coverRightItems = manager.findCoverItemsFromPosition(this.items, {
      ...this.fromItem.pos,
      h: this.row - this.fromItem.pos.y + 1
    }, [this.fromItem])

    let minOffsetBottom = Infinity
    coverRightItems.forEach((item) => {
      const offsetBottom = item.offsetTop()
      if (minOffsetBottom > offsetBottom) minOffsetBottom = offsetBottom
    })
    let spaceBottom = minOffsetBottom - this.fromItem.offsetTop()
    return isFinite(spaceBottom) ? spaceBottom : this.offsetBottom
  }

  get spaceW(): number {
    return this.container.pxToW(this.spaceRight)
  }

  get spaceH(): number {
    return this.container.pxToH(this.spaceBottom)
  }

  //--------------------------------------------字段定义结束分割线------------------------------------------------
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
    (items || this.items).forEach((item) => item.updateItemLayout())
  }

  /**
   * 获取要修改的Items并清空当前列表,所有要修改的Item都添加到这里来，不要修改item本身的pos，后面检测能添加的时候会自动修改
   * */
  public addModifyItem(item: Item, pos: Partial<CustomItemPos> = {}) {
    const info: LayoutItemInfo = createModifyPosInfo(item, pos)
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
}
