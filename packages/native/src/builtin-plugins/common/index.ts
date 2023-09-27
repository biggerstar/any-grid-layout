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
  const {fromItem} = tempStore
  if (!fromItem) return
  ev.addModifyItem(fromItem, {
    w: ev.restrictedItemW,
    h: ev.restrictedItemH,
  })
  directUpdateLayout(ev)
}

/**
 * 节流更新drag到 +十字线+ 方向的布局
 * */
export const dragToCrossHair: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  ev.prevent()
  const {fromItem} = tempStore
  if (!fromItem) return
  ev.addModifyItem(fromItem,   // 指定修改当前鼠标拖动item的位置
    {
      x: ev.startX,
      y: ev.startY
    })
  if (isFunction(callback)) {
    ev.findDiffCoverItem(null, (item) => {
      const changePos = callback(item)
      // console.log(changePos)
      if (changePos && isObject(changePos)) ev.addModifyItem(item, changePos)  // 添加被当前cloneEl覆盖item的移动方式
    })
  }
  directUpdateLayout(ev)
}, 30)

/**
 * 节流更新drag到 「对角」 方向的布局
 * */
export const dragToDiagonal: Function = throttle((ev: ItemDragEvent) => {
  ev.prevent()
  const {toItem, fromItem} = tempStore
  const {layoutManager, items} = ev
  if (!toItem || !fromItem) return
  layoutManager.move(items, fromItem, toItem)
  const isSuccess = directUpdateLayout(ev)
  if (!isSuccess) {
    layoutManager.move(items, toItem, fromItem)
    directUpdateLayout(ev)
  }
}, 180)


/**
 * 拖动Item到Items列表中的toItem的索引位置
 * */
export const moveToIndexForItems: Function = throttle((ev: ItemDragEvent) => {
  const {fromItem, toItem} = tempStore
  if (!fromItem || !toItem) return
  if (isAnimation(fromItem)) return;
  const manager = ev.layoutManager
  manager.move(ev.items, fromItem, toItem)
  directUpdateLayout(ev)
}, 80)
