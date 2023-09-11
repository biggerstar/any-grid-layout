import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";
import {throttle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {ItemDragEvent} from "@/plugins/event-type/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-type/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins";
import {isAnimation} from "@/algorithm/common/tool";
import {Item} from "@/main";

/**
 * 节流后的patchDragDirection
 * */
export const patchDragDirection: Function = throttle((ev: ItemDragEvent) => {
  ev.patchDragDirection()
}, 80)

/**
 * 节流后的patchResizeNewSize
 * */
export const patchResizeNewSize: Function = throttle((ev: ItemResizeEvent) => {
  const {fromItem} = tempStore
  if (!fromItem) return
  if (fromItem.pos.w !== ev.w || fromItem.pos.h !== ev.h) {
    const isSuccess = ev.tryChangeSize()
    if (isSuccess) {
      fromItem.container.bus.emit('itemSizeChange')
    }
  }
}, 200)

/**
 * 立即更新布局
 * */
export const directUpdateLayout = (ev: ItemDragEvent | ItemResizeEvent | ItemLayoutEvent, options: { sort?: boolean } = {}) => {
  const {container, items, toContainer} = ev
  if (toContainer && !ev['allowLayout']?.()) return
  options = Object.assign({
    sort: true
  }, options)
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
  if (options.sort) engine.items = manager.sortCurrentMatrixItems(ev.items)
  container.updateContainerStyleSize()
}

/**
 * 节流更新布局的函数
 * */
export const updateLayout: Function = throttle(directUpdateLayout, 66)

/**
 * 节流更新drag到 +十字线+ 方向的布局
 * */
export const dragMoveToCrossHair: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  const {dragItem} = tempStore
  if (!dragItem) return
  ev.prevent()
  ev.addModifyItems(dragItem, {x: ev.gridX, y: ev.gridY})
  if (isFunction(callback)) {
    ev.findDiffCoverItem(null, (item) => {
      const changePos = callback(item)
      if (changePos && isObject(changePos)) ev.addModifyItems(item, callback(item))
    })
  }
  directUpdateLayout(ev)
}, 66)

/**
 * 节流更新drag到 「对角」 方向的布局
 * */
export const dragMoveToDiagonal: Function = throttle((ev: ItemDragEvent) => {
  const {toItem, dragItem} = tempStore
  const {layoutManager, items} = ev
  if (!toItem || !dragItem) return
  ev.prevent()
  layoutManager.move(items, dragItem, toItem)
  directUpdateLayout(ev)
}, 200)

/**
 * 更新最新resize后的尺寸
 * */
export const updateResponsiveResizeLayout = (ev: ItemResizeEvent) => {
  const {fromItem} = tempStore
  if (!fromItem) return
  ev.addModifyItems(fromItem, {
    w: ev.gridW,
    h: ev.gridH,
  })
  directUpdateLayout(ev)
}

/**
 * 拖动Item到Items列表中的toItem的索引位置
 * */
export const moveToIndexForItems: Function = throttle((ev: ItemDragEvent) => {
  const {dragItem, toItem} = tempStore
  if (!dragItem || !toItem) return
  if (isAnimation(dragItem)) return;
  const manager = ev.layoutManager
  manager.move(ev.items, dragItem, toItem)
  directUpdateLayout(ev, {sort: false})
}, 80)

