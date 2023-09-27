// noinspection JSUnusedGlobalSymbols

import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {
  directUpdateLayout,
  dragToCrossHair,
  dragToDiagonal,
  updateLayout,
  updateResponsiveResizeLayout
} from "@/plugins/common";
import {ConfigurationEvent, ItemExchangeEvent} from "@/plugins";
import {definePlugin, tempStore} from "@/global";

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
    // console.log(111111111111111111)
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
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({y: item.pos.y + fromItem.pos.h}))
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterRight(ev: ItemDragEvent) {
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({x: item.pos.x - fromItem.pos.w}))
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterBottom(ev: ItemDragEvent) {
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({y: item.pos.y - fromItem.pos.h}))
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterLeft(ev: ItemDragEvent) {
    const {fromItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => ({x: item.pos.x + fromItem.pos.w}))
  },
  dragToLeftTop(ev: ItemDragEvent) {
    dragToDiagonal(ev)
  },

  dragToLeftBottom(ev: ItemDragEvent) {
    dragToDiagonal(ev)
  },

  dragToRightTop(ev: ItemDragEvent) {
    dragToDiagonal(ev)
  },

  dragToRightBottom(ev: ItemDragEvent) {
    dragToDiagonal(ev)
  },

  dragToTop(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    let call = toItem && !(fromItem.pos.y - toItem.pos.y > toItem.pos.h)  // 到toItem最顶上边界的时候触发
      ? (item) => ({y: item.pos.y + fromItem.pos.h})  // toItem移动到fromItem下面，距离为fromItem.pos.h
      : null   // 到了空白位置或者不在toItem边界而在内部(w大于3才会出现)
    dragToCrossHair(ev, call)
  },

  dragToRight(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    let call = toItem && !(toItem.pos.x - fromItem.pos.x > fromItem.pos.w)
      ? (item) => ({x: item.pos.x - fromItem.pos.w})
      : null
    dragToCrossHair(ev, call)
  },

  dragToBottom(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    let call = toItem && !(toItem.pos.y - fromItem.pos.y > fromItem.pos.h)
      ? (item) => ({y: item.pos.y - fromItem.pos.h})
      : null
    dragToCrossHair(ev, call)
  },

  dragToLeft(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    let call = toItem && !(fromItem.pos.x - toItem.pos.x > toItem.pos.w)
      ? (item) => ({x: item.pos.x + fromItem.pos.w})
      : null
    dragToCrossHair(ev, call)
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
