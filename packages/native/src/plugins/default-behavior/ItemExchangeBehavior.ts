// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {grid_dragging_source_el, grid_item_content} from "@/constant";
import {ItemExchangeEvent} from "@/plugins/event-types/ItemExchangeEvent";
import {CloneElementStyleEvent} from "@/plugins";


export const itemExchangeBehavior = definePlugin({
  updateCloneElementSize(ev: CloneElementStyleEvent) {
    ev.autoCreateCloneElement()
    ev.syncCloneSize()
    ev.updatePosition() // TODO 重构到drag事件中
  },

  updateCloneElementSize$$(_: CloneElementStyleEvent) {
  },

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
    if (ev.isExchange) ev.fromContainer.bus.emit('exchangeProvide')
  },

  /**
   * 一旦exchangeVerification验证通过，跨容器移动过程便不可阻止，只能在事件里面更改要新添加的item信息
   * */
  exchangeProvide$(ev: ItemExchangeEvent) {
    if (!ev.fromItem) return
    if (ev.newItem) return
    const gridItemContent = ev.fromItem.element.querySelector(`.${grid_item_content}`)
    const newOptions = {
      ...ev.fromItem.customOptions,
      el: gridItemContent,
    }
    ev.provideItem(ev.createNewItem(newOptions))
    ev.toContainer.bus.emit('exchangeReceive')
  },

  exchangeReceive$(ev: ItemExchangeEvent) {
    ev.receiveNewItem()
    ev.removeSourceItem()
    if (ev.newItem) ev.newItem.element.classList.add(grid_dragging_source_el)
    tempStore.fromContainer = ev.toContainer
    tempStore.fromItem = ev.newItem
    tempStore.newItem = null
  },
})
