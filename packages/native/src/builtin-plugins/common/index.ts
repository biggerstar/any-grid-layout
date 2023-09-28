import {ItemDragEvent, ItemResizeEvent} from "@/plugins";
import {tempStore} from "@/global";
import {directUpdateLayout} from "@/plugins/common";
import {throttle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {isAnimation} from "@/algorithm/common/tool";

/**
 * 更新最新resize后的尺寸
 * */
export const updateResponsiveResizeLayout = (ev: ItemResizeEvent) => {
  const fromItem = tempStore.fromItem || ev.fromItem
  ev.addModifyItem(fromItem, {
    x: ev.startX,
    y: ev.startY,
    w: ev.restrictedItemW,
    h: ev.restrictedItemH,
  })
  directUpdateLayout(ev)
}

export const throttleUpdateResponsiveResizeLayout: Function = throttle(updateResponsiveResizeLayout, 30)

/**
 * 节流更新drag到 +十字线+ 方向的布局
 * */
export const dragToCrossHair: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  const {fromItem} = tempStore
  if (!fromItem || !isFunction(callback)) return
  //--------------------------------------------------------------------
  ev.findDiffCoverItem(null, (item) => {
    const changePos = callback(item)
    // console.log(changePos)
    if (changePos && isObject(changePos)) ev.addModifyItem(item, changePos)  // 添加被当前cloneEl覆盖item的移动方式
  })
  ev.addModifyItem(fromItem,   // 指定修改当前鼠标拖动item的位置
    {
      x: ev.startX,
      y: ev.startY
    })
  directUpdateLayout(ev)
}, 45)

/**
 * 节流更新drag到 「对角」 方向的布局
 * */
export const dragToDiagonal: Function = throttle((ev: ItemDragEvent) => {
  const {toItem, fromItem} = tempStore
  const {layoutManager, items} = ev
  if (!fromItem) return
  if (!toItem) return ev.tryMoveToNearBlank()
  if (ev.equalSize(fromItem, toItem)) {  // 对角移动的时候如果两个item相等则直接交换
    layoutManager.exchange(items, fromItem, toItem)
  } else {
    ev.addModifyItem(fromItem,   // 指定修改当前鼠标拖动item的位置
      {
        x: ev.startX,
        y: ev.startY
      })
  }
  const isSuccess = directUpdateLayout(ev)
  if (!isSuccess) {
    layoutManager.move(items, toItem, fromItem)
    directUpdateLayout(ev)
  }
}, 180)

// function updateResponsiveDragLayout(ev: ItemDragEvent) {
//   if (ev.offsetGridX !== 0 && ev.offsetGridY) {
//     dragToDiagonal(ev)
//   } else {
//     dragToCrossHair(ev)
//   }
// }

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

