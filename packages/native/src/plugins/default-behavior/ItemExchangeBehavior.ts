// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {grid_dragging_source_el, grid_item_content} from "@/constant";
import {ItemExchangeEvent} from "@/plugins/event-types/ItemExchangeEvent";
import {isFunction} from "is-what";

export const itemExchangeBehavior = definePlugin({
  // 节流防止超高频移动
  exchange: (ev: ItemExchangeEvent) => {
    const {toContainer, fromContainer} = tempStore
    ev.container.bus.emit('exchangeProcess')
    if (ev.newItem && toContainer && fromContainer) {
      // 顺序不能变 exchangeProvide， 然后exchangeReceive，否则高频来回移动会出错
      fromContainer.bus.emit('exchangeProvide')
      toContainer.bus.emit('exchangeReceive')
      tempStore.fromContainer = toContainer
      tempStore.fromItem = ev.newItem
      tempStore.newItem = null
    }
  },

  exchangeProvide(ev: ItemExchangeEvent) {
    ev.removeSourceItem()
  },

  exchangeProcess(ev: ItemExchangeEvent) {
    const isV_S = isFunction(ev.verification) ? !(ev.verification?.() === false) : true
    if (!isV_S) return
    if (!ev.fromItem) return
    if (ev.newItem) return
    const gridItemContent = ev.fromItem.element.querySelector(`.${grid_item_content}`)
    const newOptions = {
      ...ev.fromItem.customOptions,
      el: gridItemContent,
    }
    ev.provideItem(ev.tryCreateNewItem(newOptions))
  },

  exchangeReceive(ev: ItemExchangeEvent) {
    ev.receiveNewItem()
    if (ev.newItem) ev.newItem.element.classList.add(grid_dragging_source_el)
  },
})
