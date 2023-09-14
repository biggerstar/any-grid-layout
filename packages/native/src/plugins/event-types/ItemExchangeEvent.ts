// noinspection JSUnusedGlobalSymbols

import {ItemLayoutEvent} from "@/plugins";
import {Container, Item} from "@/main";
import {CustomItem, CustomItemPos} from "@/types";
import {analysisCurPositionInfo} from "@/algorithm/common/tool";
import {tempStore} from "@/global";
import {updateCloneElementSize4Item} from "@/plugins/common";

export class ItemExchangeEvent extends ItemLayoutEvent {
  public fromContainer: Container
  public toContainer: Container
  public toGridX: number   // 鼠标位于目标容器内的网格位置
  public toGridY: number   // 同上
  public spacePos: CustomItemPos | null = null   // 当前跨容器移动目标容器有空位的pos
  public mousePos: CustomItemPos | null = null   // 当前鼠标所在位置的pos
  public toItem: Item | null
  public newItem: Item | null

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
      }, {auto: true})
    }
  }

  /**
   * 检测是否可以移动到新容器，外部可以自行定义规则函数
   * 返回值：
   *     false： 不允许移动
   *     除了false的任何值： 允许移动
   * */
  public verification?() {
    return this.mousePos && this.layoutManager.isBlank(this.mousePos)
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
   * 创建一个当前x,y为鼠标位置新的Item，开发者也可以自行通过new Item({pos:{ x:number,y: number }}) 确定移入时新item的位置
   * */
  public createNewItem(newItemOptions: CustomItem) {
    const newItemIns = new Item(newItemOptions)
    if (this.mousePos) {
      if (!newItemOptions.pos?.x) newItemIns.pos.x = this.mousePos.x
      if (!newItemOptions.pos?.y) newItemIns.pos.y = this.mousePos.y
    }
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
    this.newItem.mount()
    if (this.toItem) toContainer.bus.emit('updateLayout')
    updateCloneElementSize4Item(this.newItem)
  }
}

