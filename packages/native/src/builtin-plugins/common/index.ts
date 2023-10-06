import {ItemDragEvent, ItemResizeEvent} from "@/plugins";
import {tempStore} from "@/global";
import {directUpdateLayout} from "@/plugins/common";
import {clamp, throttle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {isAnimation} from "@/algorithm/common/tool";

/**
 * 更新最新resize后的尺寸
 * */
export const updateResponsiveResizeLayout = (ev: ItemResizeEvent) => {
  ev.prevent()
  const fromItem = tempStore.fromItem || ev.fromItem
  const container = ev.container
  const manager = container.layoutManager
  const toPos = {
    x: ev.startGridX,
    y: ev.startGridY,
    w: clamp(ev.shadowItemInfo.offsetRelativeX, fromItem.pos.minW, fromItem.pos.maxW),
    h: clamp(ev.shadowItemInfo.offsetRelativeY, fromItem.pos.minH, fromItem.pos.maxH),
  }
  if (fromItem.pos.w === toPos.w && fromItem.pos.h === toPos.h) return

  manager.expandLineForPos(toPos)
  // if (toPos.x + toPos.w - 1 > ev.col) manager.expandLineForPos(toPos, {col: {force: true}})
  // if (toPos.y + toPos.h - 1 > ev.row) manager.expandLineForPos(toPos, {row: {force: true}})

  ev.addModifyItem(fromItem, toPos)
  directUpdateLayout(ev)
}

export const throttleUpdateResponsiveResizeLayout: Function = throttle(updateResponsiveResizeLayout, 30)

/**
 * @param ev 事件对象
 * @param callback 当前影子item覆盖的item
 * */
export const updateResponsiveDragLayout: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  const {fromItem} = tempStore
  if (!fromItem || !isFunction(callback)) return
  //--------------------------------------------------------------------
  const toPos = {
    ...fromItem.pos,
    x: ev.startGridX,
    y: ev.startGridY
  }
  ev.addModifyItem(fromItem, toPos) // 指定修改当前鼠标拖动item的位置
  ev.findDiffCoverItem(null, (item) => {
    const changePos = callback(item)
    // console.log(changePos)
    if (changePos && isObject(changePos)) ev.addModifyItem(item, changePos)  // 添加被当前cloneEl覆盖item的移动方式
  })
  const manager = ev.container.layoutManager
  manager.expandLineForPos(toPos, {
    col: {force: true},
    row: {force: true}
  })
  directUpdateLayout(ev)
}, 45)


/**
 * 拖动Item到Items列表中的toItem的索引位置
 * */
export const moveToIndexForItems: Function = throttle((ev: ItemDragEvent) => {
  const {fromItem, toItem} = tempStore
  if (!fromItem || !toItem) return
  if (isAnimation(fromItem)) return;
  const manager = ev.container.layoutManager
  manager.move(ev.items, fromItem, toItem)
  directUpdateLayout(ev)
}, 80)

