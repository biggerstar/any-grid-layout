// noinspection JSUnusedGlobalSymbols

import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {directUpdateLayout, updateLayout} from "@/plugins/common";
import {ItemExchangeEvent} from "@/plugins";
import {definePlugin, tempStore} from "@/global";
import {
  throttleUpdateResponsiveResizeLayout,
  updateResponsiveDragLayout,
  updateResponsiveResizeLayout
} from "@/builtin-plugins/common";

/**
 * 响应式布局插件
 * */
export const ResponsiveLayoutPlugin = definePlugin({
  name: 'ResponsiveLayoutPlugin',
  exchangeVerification(ev: ItemExchangeEvent) {
    ev.prevent()
    if (!ev.fromItem) return
    const toPos = {
      w: ev.fromItem.pos.w,
      h: ev.fromItem.pos.h,
      x: ev.toStartX,
      y: ev.toStartY,
    }
    if (ev.fromItem && ev.toContainer.layoutManager.isBlank(toPos)) {
      ev.doExchange()
    } else if (ev.toItem) {
      // console.log(ev.toItem)
      console.log(tempStore.fromContainer, tempStore.toContainer);
      ev.doExchange()
    }
  },

  containerResizing(ev: ItemLayoutEvent) {
    updateLayout(ev)
  },

  dragend(ev: ItemDragEvent) {
    directUpdateLayout(ev)
  },

  dragToTop(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    updateResponsiveDragLayout(ev, (item) => ({y: item.pos.y + fromItem.pos.h}))
  },

  dragToRight(ev: ItemDragEvent) {
    // console.log('dragToRight')
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    updateResponsiveDragLayout(ev, (item) => ({x: item.pos.x - fromItem.pos.w}))
  },

  dragToBottom(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    updateResponsiveDragLayout(ev, (item) => ({y: item.pos.y - fromItem.pos.h}))
  },

  dragToLeft(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    updateResponsiveDragLayout(ev, (item) => ({x: item.pos.x + fromItem.pos.w}))
  },

  /*------------------------------------------------------------------*/
  resized(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
    setTimeout(() => directUpdateLayout(ev), 0)
  },

  resizeToTop(ev: ItemResizeEvent) {
    throttleUpdateResponsiveResizeLayout(ev)
  },

  resizeToBottom(ev: ItemResizeEvent) {
    throttleUpdateResponsiveResizeLayout(ev)
  },

  resizeToLeft(ev: ItemResizeEvent) {
    throttleUpdateResponsiveResizeLayout(ev)
  },

  resizeToRight(ev: ItemResizeEvent) {
    throttleUpdateResponsiveResizeLayout(ev)
  },

  closed(ev: ItemLayoutEvent) {
    directUpdateLayout(ev)
  },

  updateLayout(ev: ItemLayoutEvent) {
    directUpdateLayout(<any>ev['event'] || ev)
  },
})
