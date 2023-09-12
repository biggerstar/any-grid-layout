// noinspection JSUnusedGlobalSymbols

import {tempStore} from "@/events";
import {ItemDragEvent} from "@/plugins/event-type/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-type/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-type/ItemLayoutEvent";
import {
  directUpdateLayout,
  dragMoveToCrossHair,
  dragMoveToDiagonal,
  updateLayout,
  updateResponsiveResizeLayout
} from "@/plugins/common";
import {CrossContainerExchangeEvent} from "@/plugins";
import {definePlugin} from "@/global";

/*------------------------------------------------------------------------------------------*/
/**
 * 响应式布局插件
 * */
export const ResponsiveLayoutPlugin = definePlugin({
  cross(ev: CrossContainerExchangeEvent) {
    const {toContainer, fromItem} = tempStore
    if (!toContainer || !fromItem) return
    ev.rule = null
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
    dragMoveToCrossHair(ev, (item) => toItem ? ({x: item.pos.x + fromItem.pos.w}) : null)
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterRight(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({x: item.pos.x - fromItem.pos.w}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterTop(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({y: item.pos.y + fromItem.pos.h}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterBottom(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({y: item.pos.y - fromItem.pos.h}) : null)
  },

  dragToLeftTop(ev: ItemDragEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToLetBottom(ev: ItemDragEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToRightTop(ev: ItemDragEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToRightBottom(ev: ItemDragEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToTop(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    let call = !(fromItem.pos.y - toItem.pos.y > toItem.pos.h)
      ? (item) => ({y: item.pos.y + fromItem.pos.h})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToBottom(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    let call = !(toItem.pos.y - fromItem.pos.y > fromItem.pos.h)
      ? (item) => ({y: item.pos.y - fromItem.pos.h})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToLeft(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    let call = !(fromItem.pos.x - toItem.pos.x > toItem.pos.w)
      ? (item) => ({x: item.pos.x + fromItem.pos.w})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToRight(ev: ItemDragEvent) {
    const {fromItem, toItem} = tempStore
    if (!fromItem || !toItem) return
    let call = !(toItem.pos.x - fromItem.pos.x > fromItem.pos.w)
      ? (item) => ({x: item.pos.x - fromItem.pos.w})
      : null
    dragMoveToCrossHair(ev, call)
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
  }
})
