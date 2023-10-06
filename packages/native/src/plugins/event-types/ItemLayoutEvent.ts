import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {Item} from "@/main";
import {CustomItemPos, LayoutItemInfo, MarginOrSizeDesc} from "@/types";
import {analysisCurPositionInfo, createModifyPosInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/global";
import {clamp, getClientRect, getContainerConfigs, SingleThrottle} from "@/utils";

const singleRectThrottle = new SingleThrottle<{ itemRect: DOMRect, containerRect: DOMRect }>()
const singleShadowRectThrottle = new SingleThrottle<{ shadowItemRect: DOMRect }>()

export class ItemLayoutEvent extends BaseEvent {
  public readonly fromItem: Item
  public readonly col: number // 当前容器的col
  public readonly row: number // 当前容器的row
  public readonly size: MarginOrSizeDesc // 当前容器的row
  public readonly margin: MarginOrSizeDesc // 当前容器的row
  public readonly gridX: number // 当前鼠标位置以容器左上角为准限制在容器内的x栅格值
  public readonly gridY: number // 当前鼠标位置以容器左上角为准限制在容器内的y栅格值
  public readonly relativeX: number   // 当前鼠标以容器左上角为准距离源容器的真实x栅格值
  public readonly relativeY: number   // 当前鼠标以容器左上角为准距离源容器的真实y栅格值
  public readonly containerInfo: DOMRect
  public readonly inOuter: boolean   // 鼠标指针位置是否在容器外部
  public readonly itemInfo: DOMRect & {  // 源item的信息
    minWidth: number      // 和fromItem的minWidth函数的值是一样的，下方同理
    maxWidth: number
    minHeight: number
    maxHeight: number
    offsetLeft: number         // fromItem距离当前容器左边界的距离
    offsetTop: number          // fromItem距离当前容器上边界的距离
    offsetRight: number        // fromItem距离当前容器右边界的距离
    offsetBottom: number       // fromItem距离当前容器下边界的距离
    offsetX: number            // 当前鼠标位置相对clone元素左上角的left距离
    offsetY: number            // 当前鼠标位置相对clone元素左上角的top距离
    offsetClickWidth: number   // 鼠标首次点击位置距离clone元素左上角距离
    offsetClickHeight: number  // 鼠标首次点击位置距离clone元素左上角距离
  }
  public readonly shadowItemInfo: DOMRect & { // 当前clone元素(影子元素)的rect信息
    offsetLeft: number        // 克隆元素距离当前容器左边界的距离
    offsetTop: number         // 克隆元素距离当前容器上边界的距离
    offsetRight: number       // 克隆元素距离当前容器右边界的距离
    offsetBottom: number      // 克隆元素距离当前容器下边界的距离
    offsetRelativeX: number   // 当前拖动位置相对源item偏移
    offsetRelativeY: number   // 当前拖动位置相对源item偏移
    scaleMultipleX: number    // 克隆元素当前相对源item的缩放倍数，正常是使用了transform转换，默认为1倍表示无缩放
    scaleMultipleY: number    // 克隆元素当前相对源item的缩放倍数，正常是使用了transform转换，默认为1倍表示无缩放
  }

  public readonly spaceInfo: {
    clampWidth: number        // 受限制的当前克隆元素的实时宽度，受 itemInfo.maxWidth 限制
    clampHeight: number       // 受限制的当前克隆元素的实时高度，受 itemInfo.maxHeight 限制
    clampW: number            // 受限制的当前克隆元素的实时网格单位宽度，受 itemInfo.clampWidth 限制
    clampH: number            // 受限制的当前克隆元素的实时网格单位高度，受 itemInfo.clampHeight 限制
    spaceRight: number        // 距离right方向上最近的可调整距离(包含item的width)
    spaceBottom: number       // 距离bottom方向上最近的最大可调整距离(包含item的height)
  }

  /**
   * 当前要布局使用的items,开发者可以自定义替换Item列表，后面更新将以列表为准
   * 注意：列表中的成员必须是已经挂载在的引用
   * */
  public readonly items: Item[]

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
      toContainer,
      cloneElScaleMultipleX,
      cloneElScaleMultipleY,
      mousedownItemOffsetTopProportion: PT,
      mousedownItemOffsetLeftProportion: PL
    } = tempStore
    if (!fromItem || !mousemoveEvent || !cloneElement) return
    const container = this.container
    /*------------------ Base Info --------------------*/
    Object.assign(<object>this, analysisCurPositionInfo(fromItem.container))  // 合并 relativeX，relativeY， gridX， gridY
    singleRectThrottle.do(() => {  // 节流获取rect减少回流的可能，itemRect，containerRect是比较固定的元素，变化不大
      singleRectThrottle.setCache("itemRect", getClientRect(fromItem.element, true))
      singleRectThrottle.setCache("containerRect", getClientRect(container.contentElement, true))
    }, 1024)
    singleShadowRectThrottle.do(() => {
      singleShadowRectThrottle.setCache("shadowItemRect", getClientRect(cloneElement, true))
    }, 67)
    const itemRect = singleRectThrottle.getCache("itemRect")
    const containerRect = singleRectThrottle.getCache("containerRect")
    const shadowItemRect = singleShadowRectThrottle.getCache('shadowItemRect')
    const {size, margin} = getContainerConfigs(fromItem.container, ["size", "margin"])
    this.col = container.getConfig("col")
    this.row = container.getConfig("row")
    this.size = size
    this.margin = margin
    this.fromItem = fromItem
    this.inOuter = !!(!toContainer && fromItem)

    /*-------------- Container Rect -------------------*/
    this.containerInfo = containerRect

    /*--------------- ItemInfo Rect -------------------*/
    const itemInfo: ItemLayoutEvent["itemInfo"] = this.itemInfo = <ItemLayoutEvent["itemInfo"]>itemRect
    itemInfo.minWidth = fromItem.minWidth()
    itemInfo.maxWidth = fromItem.maxWidth()
    itemInfo.minHeight = fromItem.minHeight()
    itemInfo.maxHeight = fromItem.maxHeight()
    itemInfo.offsetTop = fromItem.offsetTop()
    itemInfo.offsetRight = fromItem.offsetRight()
    itemInfo.offsetBottom = fromItem.offsetBottom()
    itemInfo.offsetLeft = fromItem.offsetLeft()
    itemInfo.offsetX = mousemoveEvent.clientX - itemRect.left
    itemInfo.offsetY = mousemoveEvent.clientY - itemRect.top
    itemInfo.offsetClickWidth = itemInfo.width * PT
    itemInfo.offsetClickHeight = itemInfo.height * PL

    /*------------- ShadowItemInfo Rect ----------------*/
    const shadowItemInfo: ItemLayoutEvent["shadowItemInfo"] = this.shadowItemInfo = <any>shadowItemRect || getClientRect(fromItem.element)
    shadowItemInfo.offsetTop = shadowItemRect.top - containerRect.top
    shadowItemInfo.offsetRight = containerRect.right - shadowItemRect.right
    shadowItemInfo.offsetLeft = shadowItemRect.left - containerRect.left
    shadowItemInfo.offsetBottom = containerRect.bottom - shadowItemRect.bottom
    shadowItemInfo.scaleMultipleX = (cloneElScaleMultipleX || 1)
    shadowItemInfo.scaleMultipleY = (cloneElScaleMultipleY || 1)
    shadowItemInfo.offsetRelativeX = this.relativeX - fromItem!.pos.x + 1
    shadowItemInfo.offsetRelativeY = this.relativeY - fromItem!.pos.y + 1

    /*------------- spaceInfo ----------------*/
    const spaceInfo: ItemLayoutEvent["spaceInfo"] = this.spaceInfo = {}
    spaceInfo.clampWidth = clamp(itemInfo.offsetX, itemInfo.minWidth, itemInfo.maxWidth)
    spaceInfo.clampHeight = clamp(itemInfo.offsetY, itemInfo.minHeight, itemInfo.maxHeight)
    spaceInfo.clampW = container.pxToW(spaceInfo.clampWidth)
    spaceInfo.clampH = container.pxToW(spaceInfo.clampHeight)
    // spaceInfo.spaceRight = fromItem.spaceRight()
    // spaceInfo.spaceBottom = fromItem.spaceBottom()
    // spaceInfo.spaceWidth = Math.min(spaceInfo.spaceRight, spaceInfo.clampWidth)
    // spaceInfo.spaceHeight = Math.min(spaceInfo.spaceBottom, spaceInfo.clampHeight)
    // console.log(this.spaceInfo.restrictedWidth, this.spaceInfo.restrictedHeight)
  }

  //--------------------------------------------字段定义结束分割线------------------------------------------------

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
