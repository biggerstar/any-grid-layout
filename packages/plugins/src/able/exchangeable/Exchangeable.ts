// noinspection JSUnusedGlobalSymbols


import {
  analysisCurLocationInfo,
  Container,
  ContainerInstantiationOptions, CustomItem,
  CustomItemPos, definePlugin, getClientRect, grid_item_content,
  Item,
   tempStore
} from "@biggerstar/layout";
/**
 * 判断当前操作行为是否允许跨容器移动
 * */
export function canExchange() {
  const {fromContainer, fromItem, toContainer} = tempStore;
  if (!fromContainer || !fromItem || !toContainer) {
    return false
  }
  return fromItem.exchange                      /* 要求item和容器都允许交换才能继续 */
    && toContainer.getConfig('exchange')
    && fromContainer.getConfig('exchange')
}

export class ItemExchangeEvent  {
  public readonly spacePos: CustomItemPos | null = null   // 当前跨容器移动目标容器有空位的pos
  public readonly mousePos: CustomItemPos | null = null   // 当前鼠标所在位置的pos
  public readonly newItem: Item | null
  public readonly fromContainer: Container
  public readonly toContainer: Container
  public readonly toContainerRect: DOMRect // toContainer的DomRect位置信息
  public readonly toGridX: number   // 鼠标位于目标容器内的网格位置
  public readonly toGridY: number   // 同上
  public readonly toStartX: number // 克隆元素当前位于新容器目标网格左上角相对的栅格X位置
  public readonly toStartY: number // 克隆元素当前位于新容器目标网格左上角相对的栅格Y位置
  public isExchange: boolean

  constructor(options: ContainerInstantiationOptions) {
    const {fromContainer, fromItem, newItem, toItem, toContainer} = tempStore
    this.fromContainer = <Container>fromContainer
    this.toContainer = <Container>toContainer
    if (!toContainer || !fromItem) {
      return
    }
    this.isExchange = false
    const res = analysisCurLocationInfo(toContainer)
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
      this.spacePos = <any>this.container.layoutManager.findBlank({
        w: fromItem.pos.w,
        h: fromItem.pos.h,
      })
    }
    const toContainerRect = getClientRect(toContainer.contentElement)
    const cloneElOffsetContainerLeftTopX = this.shadowItemInfo.left - toContainerRect.left
    const cloneElOffsetContainerLeftTopY = this.shadowItemInfo.top - toContainerRect.top
    const toStartRelativeX = toContainer.pxToW(cloneElOffsetContainerLeftTopX) * Math.sign(cloneElOffsetContainerLeftTopX)
    const toStartRelativeY = toContainer.pxToH(cloneElOffsetContainerLeftTopY) * Math.sign(cloneElOffsetContainerLeftTopY)
    this.toStartX = toStartRelativeX < 1 ? 1 : toStartRelativeX
    this.toStartY = toStartRelativeY < 1 ? 1 : toStartRelativeY
  }

  /**
   * 标记本次是否执行跨容器交换，如果标记允许的话后面将会发起交换流程
   * */
  public doExchange() {
    this.isExchange = true
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
  public createNewItem(newItemOptions: CustomItem): Item {
    const newItemIns = new Item(newItemOptions)
    // console.log(this.container);
    newItemIns.pos.x = this.toStartX
    newItemIns.pos.y = this.toStartY
    // console.log(this.toStartX, this.toStartY)
    return newItemIns
  }

  /**
   * 将一个Item添加到新容器的item列表中
   * */
  public provideItem(newItemIns: Item) {
    tempStore.newItem = newItemIns
  }

  /**
   * 新容器接收并挂载新item
   * */
  public receiveNewItem() {
    const {toContainer} = tempStore
    if (!this.newItem || !toContainer) {
      return
    }
    toContainer.addItem(this.newItem)
    let toPos: CustomItemPos = this.newItem.pos
    // console.log('receive', toPos.x, toPos.y)
    toContainer.layoutManager.mark(toPos, this.newItem)
    this.newItem.mount()
    if (this.toItem) {
      toContainer.bus.emit('updateLayout')
    }
    setTimeout(() => toContainer.updateContainerSizeStyle())
  }
}



export const itemExchangeBehavior = definePlugin({
  /**
   * 控制是否可以移动到新容器
   * */
  exchangeVerification(ev: ItemExchangeEvent) {
    const toPos = {
      w: ev.fromItem.pos.w,
      h: ev.fromItem.pos.h,
      x: ev.toStartX,
      y: ev.toStartY,
    }
    if (ev.fromItem && ev.toContainer.layoutManager.isBlank(toPos)) {
      ev.doExchange()
    }
  },

  exchangeVerification$$(ev: ItemExchangeEvent) {
    ev.isExchange && ev.fromContainer.bus.emit('exchangeProvide')
  },

  /**
   * 一旦exchangeVerification验证通过，跨容器移动过程便不可阻止，只能在 exchangeProvide 或 exchangeReceive 事件里面更改要新添加的item信息
   * */
  exchangeProvide$$(ev: ItemExchangeEvent) {
    if (!ev.fromItem || ev.newItem) return
    const gridItemContent = ev.fromItem.element.querySelector(`.${grid_item_content}`)
    const newOptions = {
      ...ev.fromItem.customOptions,
      el: gridItemContent,
    }
    ev.provideItem(ev.createNewItem(newOptions as any))
    ev.toContainer.bus.emit('exchangeReceive')
  },

  exchangeReceive$$(ev: ItemExchangeEvent) {
    ev.receiveNewItem()
    ev.removeSourceItem()
    if (ev.newItem) ev.newItem.element.classList.add(grid_dragging_source_el)
    ev.fromContainer.layoutManager.trim({
      row: {head: true},
      col: {head: true},
    })
    tempStore.fromContainer = ev.toContainer
    tempStore.fromItem = ev.newItem
    tempStore.newItem = null
    ev.container.STRect.updateCache("fromItem")
    ev.container.STRect.updateCache("shadow")
    ev.container.STRect.updateCache("containerContent")
  },
})


// //------------------exchange------------------
// /**
//  * 跨容器交换前的验证，只有验证通过才执行交换
//  * */
// exchangeVerification?(ev: ItemExchangeEvent): void;
//
// /**
//  * 跨容器移动时Item提供者，在提供的Container上触发
//  * */
// exchangeProvide?(ev: ItemExchangeEvent): void;
//
// /**
//  * 跨容器移动时Item过程，主要用于处理如何挂载Item到新容器中
//  * 通过provideItem添加要移动到目标容器的新item
//  * */
// exchangeProcess?(ev: ItemExchangeEvent): void;
//
// /**
//  * 跨容器移动时Item接受者，在接收的Container上触发
//  * */
// exchangeReceive?(ev: ItemExchangeEvent): void;
