// noinspection JSUnusedGlobalSymbols

import {tempStore} from "@/events";
import {definePlugin} from "@/plugins/global";
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

/*------------------------------------------------------------------------------------------*/
/**
 * 响应式布局插件
 * */
export const ResponsiveLayoutPlugin = definePlugin({
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
    const {dragItem, toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({x: item.pos.x + dragItem.pos.w}) : null)
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterRight(ev: ItemDragEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({x: item.pos.x - dragItem.pos.w}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterTop(ev: ItemDragEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({y: item.pos.y + dragItem.pos.h}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterBottom(ev: ItemDragEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({y: item.pos.y - dragItem.pos.h}) : null)
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
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(dragItem.pos.y - toItem.pos.y > toItem.pos.h)
      ? (item) => ({y: item.pos.y + dragItem.pos.h})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToBottom(ev: ItemDragEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(toItem.pos.y - dragItem.pos.y > dragItem.pos.h)
      ? (item) => ({y: item.pos.y - dragItem.pos.h})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToLeft(ev: ItemDragEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(dragItem.pos.x - toItem.pos.x > toItem.pos.w)
      ? (item) => ({x: item.pos.x + dragItem.pos.w})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToRight(ev: ItemDragEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(toItem.pos.x - dragItem.pos.x > dragItem.pos.w)
      ? (item) => ({x: item.pos.x - dragItem.pos.w})
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
})
