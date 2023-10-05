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
    x: ev.startGridX,
    y: ev.startGridY,
    w: ev.spaceInfo.clampW,
    h: ev.spaceInfo.clampH,
  })
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
  ev.findDiffCoverItem(null, (item) => {
    const changePos = callback(item)
    // console.log(changePos)
    if (changePos && isObject(changePos)) ev.addModifyItem(item, changePos)  // 添加被当前cloneEl覆盖item的移动方式
  })
  ev.addModifyItem(fromItem,   // 指定修改当前鼠标拖动item的位置
    {
      x: ev.startGridX,
      y: ev.startGridY
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

