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
import {ItemExchangeEvent} from "@/plugins";
import {definePlugin, tempStore} from "@/global";

/*------------------------------------------------------------------------------------------*/
/**
 * 响应式布局插件
 * */
export const ResponsiveLayoutPlugin = definePlugin({
  exchangeProcess(ev: ItemExchangeEvent) {
    const {toContainer, fromItem} = tempStore
    if (!toContainer || !fromItem) return
    ev.verification = null
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
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterLeft(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => toItem ? ({x: item.pos.x + fromItem.pos.w}) : null)
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterRight(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => toItem ? ({x: item.pos.x - fromItem.pos.w}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterTop(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => toItem ? ({y: item.pos.y + fromItem.pos.h}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterBottom(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    dragToCrossHair(ev, (item) => toItem ? ({y: item.pos.y - fromItem.pos.h}) : null)
  },

  dragToLeftTop(ev: ItemDragEvent) {
    dragToDiagonal(ev)
  },

  dragToLetBottom(ev: ItemDragEvent) {
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
    if (!fromItem || !toItem) return
    let call = !(fromItem.pos.y - toItem.pos.y > toItem.pos.h)  // 到toItem最顶上边界的时候触发
      ? (item) => ({y: item.pos.y + fromItem.pos.h})  // toItem移动到fromItem下面，距离为fromItem.pos.h
      : null
    dragToCrossHair(ev, call)
  },

  dragToBottom(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    let call = !(toItem.pos.y - fromItem.pos.y > fromItem.pos.h)
      ? (item) => ({y: item.pos.y - fromItem.pos.h})
      : null
    dragToCrossHair(ev, call)
  },

  dragToLeft(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    let call = !(fromItem.pos.x - toItem.pos.x > toItem.pos.w)
      ? (item) => ({x: item.pos.x + fromItem.pos.w})
      : null
    dragToCrossHair(ev, call)
  },

  dragToRight(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    let call = !(toItem.pos.x - fromItem.pos.x > fromItem.pos.w)
      ? (item) => ({x: item.pos.x - fromItem.pos.w})
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
