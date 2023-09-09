import {ItemLayoutEvent} from "@/plugin/event-type/ItemLayoutEvent";
import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";
import {throttle} from "@/utils";
import {isFunction, isObject} from "is-what";

/**
 * 立即更新布局
 * @return {boolean} 布局是否更新成功过
 * */
export const directUpdateLayout = (ev: ItemLayoutEvent):boolean => {
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
  if (!res.isSuccess) return false
  res.patch()
  ev.patchStyle()
  engine.items = manager.sortCurrentMatrixItems(ev.items)
  container.updateContainerStyleSize()
  return true
}

/**
 * 节流更新布局的函数
 * */
export const updateLayout: Function = throttle(directUpdateLayout, 66)

/**
 * 节流更新drag到十字线方向的布局
 * */
export const dragMoveToCrossHair: Function = throttle((ev: ItemLayoutEvent, callback: Function) => {
  const {dragItem, gridX: x, gridY: y} = tempStore
  if (!dragItem) return
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
export const dragMoveToDiagonal: Function = throttle((ev: ItemLayoutEvent) => {
  const {toItem, dragItem} = tempStore
  const {layoutManager, items} = ev
  if (!toItem || !dragItem) return
  layoutManager.move(items, dragItem, toItem)
  updateLayout(ev)
}, 200)
