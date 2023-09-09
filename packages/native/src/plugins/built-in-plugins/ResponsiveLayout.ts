// noinspection JSUnusedGlobalSymbols

import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";
import {definePlugin} from "@/plugins/global";
import {throttle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {ItemDragEvent} from "@/plugins/event-type/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-type/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins/event-type/ItemLayoutEvent";

/**
 * 立即更新布局
 * */
const directUpdateLayout = (ev: ItemDragEvent | ItemResizeEvent | ItemLayoutEvent) => {
  const {container, items, toContainer} = ev
  if (toContainer && !ev['allowLayout']?.()) return
  const {layoutManager: manager, engine} = container
  autoSetSizeAndMargin(container, true)
  //-------------------------------------------------------------//
  engine.reset()
  let res = manager.analysis(items, ev.getModifyItems(), {
    baseline: container.getConfig("baseLine"),
    auto: ev.hasAutoDirection()
  })
  if (!res.isSuccess) return
  res.patch()
  ev.patchStyle()
  engine.items = manager.sortCurrentMatrixItems(ev.items)
  container.updateContainerStyleSize()
}

/**
 * 节流更新布局的函数
 * */
const updateLayout: Function = throttle(directUpdateLayout, 66)

/**
 * 节流更新drag到 +十字线+ 方向的布局
 * */
const dragMoveToCrossHair: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  const {dragItem, gridX: x, gridY: y} = tempStore
  if (!dragItem) return
  ev.prevent()
  ev.addModifyItems(dragItem, {x, y})
  if (isFunction(callback)) {
    ev.findDiffCoverItem(null, (item) => {
      const changePos = callback(item)
      if (changePos && isObject(changePos)) ev.addModifyItems(item, callback(item))
    })
  }
  updateLayout(ev)
}, 66)

/**
 * 节流更新drag到 「对角」 方向的布局
 * */
const dragMoveToDiagonal: Function = throttle((ev: ItemDragEvent) => {
  const {toItem, dragItem} = tempStore
  const {layoutManager, items} = ev
  if (!toItem || !dragItem) return
  ev.prevent()
  layoutManager.move(items, dragItem, toItem)
  updateLayout(ev)
}, 200)

const updateResponsiveResizeLayout = (ev: ItemResizeEvent) => {
  const {fromItem} = tempStore
  if (!fromItem) return
  ev.addModifyItems(fromItem, {
    w: ev.w,
    h: ev.h,
  })
  directUpdateLayout(ev)
}

/**
 * 内置默认布局，外面没有阻止默认行为的时候执行的函数
 * */
export const ResponsiveLayout = definePlugin({
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

  resizeOuterTop(_: ItemResizeEvent) {
  },

  resizeOuterRight(_: ItemResizeEvent) {
  },

  resizeOuterBottom(_: ItemResizeEvent) {
  },

  resizeOuterLeft(_: ItemResizeEvent) {
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

  containerResizing(ev: ItemLayoutEvent) {
    updateLayout(ev)
  },
})
