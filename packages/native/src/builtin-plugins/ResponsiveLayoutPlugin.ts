// noinspection JSUnusedGlobalSymbols

import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {BaseEvent, ItemExchangeEvent} from "@/plugins";
import {definePlugin, tempStore} from "@/global";
import {
  directUpdateLayout,
  updateLayout,
  updateResponsiveDragLayout,
  updateResponsiveResizeLayout
} from "@/builtin-plugins/common";
import {getContainerConfigs} from "@/utils";

/**
 * 响应式布局插件
 * */
export const ResponsiveLayoutPlugin = definePlugin({
  name: 'ResponsiveLayoutPlugin',
  containerMountBefore(ev: BaseEvent) {
    const {autoGrow, direction} = getContainerConfigs(ev.container, ["autoGrow", 'direction'])
    if (autoGrow.vertical && autoGrow.horizontal) {
      if (direction.includes('row')) autoGrow.horizontal = false
      if (direction.includes('column')) autoGrow.vertical = false
      ev.container.bus.emit("warn", {
        message: `[${this.name}] autoGrow 的 horizontal 和 vertical 配置不建议都设置为true,已自动修改为只保留一边自动增长`
      })
    }
  },
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
    // console.log('dragToTop')
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    if (fromItem.pos.y <= 1) return
    updateResponsiveDragLayout(ev, (item) => ({y: item.pos.y + fromItem.pos.h}))
  },

  dragToRight(ev: ItemDragEvent) {
    // console.log('dragToRight')
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    if (fromItem.pos.x + fromItem.pos.w - 1 >= ev.col) return
    updateResponsiveDragLayout(ev, (item) => ({x: item.pos.x - fromItem.pos.w}))
  },

  dragToBottom(ev: ItemDragEvent) {
    // console.log('dragToBottom')
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    if (fromItem.pos.y + fromItem.pos.h - 1 >= ev.row) return
    updateResponsiveDragLayout(ev, (item) => ({y: item.pos.y - fromItem.pos.h}))
  },

  dragToLeft(ev: ItemDragEvent) {
    // console.log('dragToLeft')
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    if (fromItem.pos.x <= 1) return
    updateResponsiveDragLayout(ev, (item) => ({x: item.pos.x + fromItem.pos.w}))
  },

  /*------------------------------------------------------------------*/
  resized(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
    setTimeout(() => directUpdateLayout(ev), 0)
  },

  resizeToTop(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToBottom(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToLeft(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeToRight(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  closed(ev: ItemLayoutEvent) {
    directUpdateLayout(ev)
  },

  updateLayout(ev: ItemLayoutEvent) {
    directUpdateLayout(<any>ev['event'] || ev)
  },
})
