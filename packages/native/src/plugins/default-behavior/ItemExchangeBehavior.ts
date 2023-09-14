// noinspection JSUnusedGlobalSymbols

import {definePlugin, tempStore} from "@/global";
import {grid_item_content} from "@/constant";
import {ItemExchangeEvent} from "@/plugins/event-types/ItemExchangeEvent";
import {isFunction} from "is-what";

export const itemExchangeBehavior = definePlugin({
  exchange(ev: ItemExchangeEvent) {
    if (isFunction(ev.verification) && ev.verification?.() === false) return
    const {toContainer, fromContainer} = tempStore
    ev.container.bus.emit('exchangeProcess')
    if (ev.newItem && toContainer && fromContainer) {
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
    if (!ev.fromItem) return
    if (ev.newItem) return
    const gridItemContent = ev.fromItem.element.querySelector(`.${grid_item_content}`)
    const newOptions = {
      ...ev.fromItem.customOptions,
      el: gridItemContent,
    }
    ev.provideItem(ev.createNewItem(newOptions))
  },

  exchangeReceive(ev: ItemExchangeEvent) {
    ev.receiveNewItem()
  },
})
