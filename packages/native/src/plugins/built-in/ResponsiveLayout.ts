// noinspection JSUnusedGlobalSymbols

import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";
import {definePlugin} from "@/plugins/global";
import {throttle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {ItemDragEvent} from "@/plugins/event-type/ItemDragEvent";

/**
 * 立即更新布局
 * */
const directUpdateLayout = (ev: ItemDragEvent) => {
  const {container, items, toContainer} = ev
  if (toContainer && !ev.allowLayout()) return
  const {layoutManager: manager, engine} = container
  autoSetSizeAndMargin(container, true)
  //-------------------------------------------------------------//
  engine.reset()
  let res = manager.analysis(items, ev.getModifyItems(), {
    baseline: container.getConfig("baseLine"),
    auto: ev.hasAutoDirection()
  })
  // const {newResizeW,newResizeH} = tempStore
  // console.log( {newResizeW,newResizeH},res.isSuccess)
  // console.log(res.isSuccess)
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
 * 节流更新drag到十字线方向的布局
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
 * 节流更新drag到对角方向的布局
 * */
const dragMoveToDiagonal: Function = throttle((ev: ItemDragEvent) => {
  const {toItem, dragItem} = tempStore
  const {layoutManager, items} = ev
  if (!toItem || !dragItem) return
  ev.prevent()
  layoutManager.move(items, dragItem, toItem)
  updateLayout(ev)
}, 200)

// const containerOuterMoving: Function = throttle((ev: ItemDragEvent, callback: (item: Item) => void) => {
//   const {dragItem} = tempStore
//   if (!dragItem) return
//   ev.findDiffCoverItem((item) => {
//     if (isFunction(callback)) callback(item)
//     ev.addModifyItems(dragItem)
//     ev.addModifyItems(item)
//     updateLayout(ev)
//   })
// }, 100)


/**
 * 内置默认布局，外面没有阻止默认行为的时候执行的函数
 * */
export const ResponsiveLayout = definePlugin({
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

  dragging(_: ItemDragEvent) {
  },

  dragend(ev: ItemDragEvent) {
    directUpdateLayout(ev)
  },
  dragToBlank(ev: ItemDragEvent) {
    const {dragItem, gridX, gridY} = tempStore
    if (!dragItem) return
    ev.prevent()
    if (gridX === dragItem.pos.x && gridY === dragItem.pos.y) return;
    ev.tryMoveToBlank()
    updateLayout(ev)
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

  resizing(ev: ItemDragEvent) {
    ev.prevent()
    const {fromItem, newResizeW, newResizeH} = tempStore
    if (!fromItem) return
    ev.addModifyItems(fromItem, {
      w: newResizeW,
      h: newResizeH,
    })
    directUpdateLayout(ev)
  },

  resized(ev: ItemDragEvent) {
    directUpdateLayout(ev)
  },

  closed(ev: ItemDragEvent) {
    directUpdateLayout(ev)
  },

  containerResizing(ev: ItemDragEvent) {
    updateLayout(ev)
  },

  /**
   * @param ev 如果没有传入customEv的时候默认使用的事件对象
   * @param customEv 开发者如果传入customEv则会替代默认ev事件对象，customEv应当包含修改过后的items或者使用addModifyItems添加过要修改的成员
   * */
  updateLayout(ev: ItemDragEvent, customEv: ItemDragEvent) {
    directUpdateLayout(ev || customEv)
  }
})
