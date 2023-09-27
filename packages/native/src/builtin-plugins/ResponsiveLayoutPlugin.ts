// noinspection JSUnusedGlobalSymbols

import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {directUpdateLayout, updateLayout} from "@/plugins/common";
import {ConfigurationEvent, ItemExchangeEvent} from "@/plugins";
import {definePlugin, tempStore} from "@/global";
import {dragToCrossHair, dragToDiagonal, updateResponsiveResizeLayout} from "@/builtin-plugins/common";

/**
 * 响应式布局插件
 * */
export const ResponsiveLayoutPlugin = definePlugin({
  name: 'ResponsiveLayoutPlugin',
  getConfig(_: ConfigurationEvent) {
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

  /**
   * 拖动结束
   * */
  dragend(ev: ItemDragEvent) {
    directUpdateLayout(ev)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterTop(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({y: item.pos.y + fromItem.pos.h}))
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterRight(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({x: item.pos.x - fromItem.pos.w}))
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterBottom(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({y: item.pos.y - fromItem.pos.h}))
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterLeft(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({x: item.pos.x + fromItem.pos.w}))
  },

  dragToLeftTop(ev: ItemDragEvent) {
    ev.prevent()
    dragToDiagonal(ev)
  },

  dragToLeftBottom(ev: ItemDragEvent) {
    ev.prevent()
    dragToDiagonal(ev)
  },

  dragToRightTop(ev: ItemDragEvent) {
    ev.prevent()
    dragToDiagonal(ev)
  },

  dragToRightBottom(ev: ItemDragEvent) {
    ev.prevent()
    dragToDiagonal(ev)
  },

  dragToTop(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    if (toItem && ev.gridY > toItem.pos.y) return
    dragToCrossHair(ev, (item) => ({y: item.pos.y + fromItem.pos.h}))
  },

  dragToRight(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    if (toItem && ev.gridX < toItem.pos.x + toItem.pos.w - 1) return
    dragToCrossHair(ev, (item) => ({x: item.pos.x - fromItem.pos.w}))
  },

  dragToBottom(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    if (toItem && ev.gridY < toItem.pos.y + toItem.pos.h - 1) return
    dragToCrossHair(ev, (item) => ({y: item.pos.y - fromItem.pos.h}))
  },

  dragToLeft(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    if (toItem && ev.gridX > toItem.pos.x) return
    dragToCrossHair(ev, (item) => ({x: item.pos.x + fromItem.pos.w}))
  },

  dragToBlank(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  /*------------------------------------------------------------------*/
  resized(ev: ItemResizeEvent) {
    directUpdateLayout(ev)
  },

  resizeOuterTop(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeOuterRight(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeOuterBottom(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
  },

  resizeOuterLeft(ev: ItemResizeEvent) {
    updateResponsiveResizeLayout(ev)
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
