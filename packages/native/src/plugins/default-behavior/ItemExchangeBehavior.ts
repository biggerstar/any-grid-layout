// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {grid_dragging_source_el, grid_item_content} from "@/constant";
import {ItemExchangeEvent} from "@/plugins/event-types/ItemExchangeEvent";

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
    ev.provideItem(ev.createNewItem(newOptions))
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
    ev.container.STRect.update("fromItem", true)
    ev.container.STRect.update("shadow", true)
    ev.container.STRect.update("containerContent", true)
  },
})








