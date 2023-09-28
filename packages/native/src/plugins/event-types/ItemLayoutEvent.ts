import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {Item} from "@/main";
import {CustomItemPos, LayoutItemInfo, MarginOrSizeDesc} from "@/types";
import {analysisCurPositionInfo, createModifyPosInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/global";
import {getClientRect, SingleThrottle} from "@/utils";

const singleThrottle = new SingleThrottle(50)

export class ItemLayoutEvent extends BaseEvent {
  public readonly fromItem: Item
  public readonly col: number // 当前容器的col
  public readonly row: number // 当前容器的row
  public readonly size: MarginOrSizeDesc // 当前容器的row
  public readonly margin: MarginOrSizeDesc // 当前容器的row
  public readonly gridX: number // 当前鼠标位置限制在容器内的x栅格值
  public readonly gridY: number // 当前鼠标位置限制在容器内的y栅格值
  public readonly relativeX: number // 当前鼠标距离源容器的真实x栅格值
  public readonly relativeY: number   // 当前鼠标距离源容器的真实y栅格值
  public containerInfo: DOMRect = <any>{}
  public readonly itemInfo: DOMRect & {  // 源item的信息
    minWidth: number      // 和fromItem的minWidth函数的值是一样的，下方同理
    maxWidth: number
    minHeight: number
    maxHeight: number
    offsetLeft: number    // fromItem距离当前容器左边界的距离
    offsetTop: number     // fromItem距离当前容器上边界的距离
    offsetRight: number   // fromItem距离当前容器右边界的距离
    offsetBottom: number  // fromItem距离当前容器下边界的距离
    offsetX: number       // 当前鼠标位置相对clone元素左上角的left距离
    offsetY: number       // 当前鼠标位置相对clone元素左上角的top距离
  } = <any>{}
  public readonly shadowItemInfo: DOMRect & { // 当前clone元素(影子元素)的rect信息
    offsetLeft: number      // 克隆元素距离当前容器左边界的距离
    offsetTop: number       // 克隆元素距离当前容器上边界的距离
    offsetRight: number     // 克隆元素距离当前容器右边界的距离
    offsetBottom: number    // 克隆元素距离当前容器下边界的距离
    scaleMultipleX: number  // 克隆元素当前相对源item的缩放倍数，正常是使用了transform转换，默认为1倍表示无缩放
    scaleMultipleY: number  // 克隆元素当前相对源item的缩放倍数，正常是使用了transform转换，默认为1倍表示无缩放
  } = <any>{}
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
      cloneElement,
      rectCache,
      cloneElScaleMultipleX = 1,
      cloneElScaleMultipleY = 1,
    } = tempStore
    if (!fromItem || !mousemoveEvent || !cloneElement) return
    /*------------------ Base Info --------------------*/
    Object.assign(<object>this, analysisCurPositionInfo(fromItem.container))  // 合并 relativeX，relativeY， gridX， gridY
    const itemRect = rectCache?.itemRect || getClientRect(fromItem.element)
    const containerRect = rectCache?.containerRect || getClientRect(this.container.contentElement)
    const shadowItemRect = getClientRect(cloneElement)
    singleThrottle.do(() => {
      tempStore.rectCache = {
        itemRect,
        containerRect
      }
    })
    this.col = fromItem.container.getConfig("col")
    this.row = fromItem.container.getConfig("row")
    this.size = this.container.getConfig("size")
    this.margin = this.container.getConfig("margin")
    this.fromItem = fromItem

    /*-------------- Container Rect -------------------*/
    this.containerInfo = containerRect
    /*--------------- ItemInfo Rect -------------------*/
    this.itemInfo = <any>itemRect
    this.itemInfo.minWidth = fromItem.minWidth()
    this.itemInfo.maxWidth = fromItem.maxWidth()
    this.itemInfo.minHeight = fromItem.minHeight()
    this.itemInfo.maxHeight = fromItem.maxHeight()
    this.itemInfo.offsetLeft = fromItem.offsetLeft()
    this.itemInfo.offsetTop = fromItem.offsetTop()
    this.itemInfo.offsetRight = containerRect.right - this.itemInfo.right
    this.itemInfo.offsetBottom = containerRect.bottom - this.itemInfo.bottom
    this.itemInfo.offsetX = mousemoveEvent.clientX - itemRect.left
    this.itemInfo.offsetY = mousemoveEvent.clientY - itemRect.top

    /*------------- ShadowItemInfo Rect ----------------*/
    this.shadowItemInfo = <any>getClientRect((cloneElement || fromItem.element))
    this.shadowItemInfo.offsetTop = shadowItemRect.top - containerRect.top
    this.shadowItemInfo.offsetRight = containerRect.right - shadowItemRect.right
    this.shadowItemInfo.offsetLeft = shadowItemRect.left - containerRect.left
    this.shadowItemInfo.offsetBottom = containerRect.bottom - shadowItemRect.bottom
    this.shadowItemInfo.scaleMultipleX = cloneElScaleMultipleX
    this.shadowItemInfo.scaleMultipleY = cloneElScaleMultipleY
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
    return Math.min(this.itemInfo.offsetX, this.itemInfo.maxWidth)
  }

  /**
   * [当前实时高度] resize中的鼠标相对左上角的item元素距离
   * resize范围：
   *        一个栅格单位的高  <--- height  --->  距离下方container边界
   * 受item.pos中minH,maxH 限制,不会越界container边界的高度，正常用于响应式布局限制 cloneElement 的高
   * */
  public get height() {
    return Math.min(this.itemInfo.offsetY, this.itemInfo.maxHeight)
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
    const manager = this.container.layoutManager
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
    return isFinite(spaceRight) ? spaceRight : this.itemInfo.offsetRight + this.itemInfo.width
  }

  /**
   * 距离bottom方向上最近的最大可调整距离(包含item的height)
   * */
  get spaceBottom(): number {
    const manager = this.container.layoutManager
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
    return isFinite(spaceBottom) ? spaceBottom : this.itemInfo.offsetBottom + this.itemInfo.height
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
