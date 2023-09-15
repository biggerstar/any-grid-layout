// noinspection JSUnusedGlobalSymbols

import {ItemDragEvent} from "@/plugins";
import {Container, Item} from "@/main";
import {CustomItem, CustomItemPos} from "@/types";
import {analysisCurPositionInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/global";
import {updateCloneElementSize4Item} from "@/plugins/common";

export class ItemExchangeEvent extends ItemDragEvent {
  public spacePos: CustomItemPos | null = null   // 当前跨容器移动目标容器有空位的pos
  public mousePos: CustomItemPos | null = null   // 当前鼠标所在位置的pos
  public toItem: Item | null
  public newItem: Item | null
  public fromContainer: Container
  public toContainer: Container
  public toContainerRect: DOMRect // toContainer的DomRect位置信息
  public toGridX: number   // 鼠标位于目标容器内的网格位置
  public toGridY: number   // 同上
  public toStartX: number // 克隆元素当前位于新容器目标网格左上角相对的栅格X位置
  public toStartY: number // 克隆元素当前位于新容器目标网格左上角相对的栅格Y位置
  constructor(options) {
    super(options);
    const {fromContainer, fromItem, newItem, toItem, toContainer} = tempStore
    this.fromContainer = <Container>fromContainer
    this.toContainer = <Container>toContainer
    if (!toContainer || !fromItem) return
    const res = analysisCurPositionInfo(toContainer)
    this.toItem = toItem
    this.newItem = newItem
    this.toGridX = res.gridX
    this.toGridY = res.gridY
    const manager = toContainer.layoutManager
    let toPos = {
      w: fromItem.pos.w,
      h: fromItem.pos.h,
      x: this.toGridX,
      y: this.toGridY,
    }
    this.mousePos = toPos
    if (!manager.isBlank(toPos)) {
      this.spacePos = <any>this.layoutManager.findBlank({
        w: fromItem.pos.w,
        h: fromItem.pos.h,
      }, {
        baseline: this.container.getConfig("baseLine"),
        auto: this.hasAutoDirection()
      })
    }
    const toContainerRect = toContainer.contentElement.getBoundingClientRect()
    const cloneElOffsetContainerLeftTopX = this.cloneElRect.left - toContainerRect.left
    const cloneElOffsetContainerLeftTopY = this.cloneElRect.top - toContainerRect.top
    const toStartRelativeX = toContainer.pxToW(cloneElOffsetContainerLeftTopX) * Math.sign(cloneElOffsetContainerLeftTopX)
    const toStartRelativeY = toContainer.pxToH(cloneElOffsetContainerLeftTopY) * Math.sign(cloneElOffsetContainerLeftTopY)
    this.toStartX = toStartRelativeX < 1 ? 1 : toStartRelativeX
    this.toStartY = toStartRelativeY < 1 ? 1 : toStartRelativeY
  }

  /**
   * 检测是否可以移动到新容器，外部可以自行定义规则函数
   * 返回值：
   *     false： 不允许移动
   *     除了false的任何值： 允许移动
   * */
  public verification?(): false | boolean | void {
    const toPos = {
      w: this.fromItem.pos.w,
      h: this.fromItem.pos.h,
      x: this.toStartX,
      y: this.toStartY,
    }
    return this.fromItem && this.toContainer.layoutManager.isBlank(toPos)
  }

  /**
   * 移除源Container中的item
   * */
  public removeSourceItem() {
    const {fromItem, toContainer, cloneElement} = tempStore
    if (!toContainer || !fromItem || !cloneElement) return
    fromItem.unmount()
    fromItem.container.bus.emit('updateLayout')
  }

  /**
   * 尝试创建一个当前合适位置的新Item，确定位置的标准是cloneEl左上角位置坐标，也就是toStartX，toStartY
   * 开发者也可以自行通过new Item({pos:{ x:number,y: number }}) 确定移入时新item的位置
   *
   * @return Item|null 返回null表示该位置没空位
   * */
  public tryCreateNewItem(newItemOptions: CustomItem): Item {
    const newItemIns = new Item(newItemOptions)
    newItemIns.pos.x = this.toStartX
    newItemIns.pos.y = this.toStartY
    // console.log(this.toStartX, this.toStartY)
    return newItemIns
  }

  /**
   * 将一个Item添加到新容器的item列表中
   * */
  public provideItem(newItemIns: Item) {
    if (this.newItem) return
    tempStore.newItem = newItemIns
  }

  /**
   * 新容器接收并挂载新item
   * */
  public receiveNewItem() {
    const {toContainer} = tempStore
    if (!this.newItem || !toContainer) return
    toContainer.addItem(this.newItem)
    toContainer.items = this.layoutManager.sortCurrentMatrixItems(toContainer.items)
    let toPos: CustomItemPos | null = this.newItem.pos
    // console.log('receive', toPos.x, toPos.y)
    this.layoutManager.mark(toPos)
    this.newItem.mount()
    if (this.toItem) toContainer.bus.emit('updateLayout')
    toContainer.updateContainerSizeStyle()
    updateCloneElementSize4Item(this.newItem)
  }
}

