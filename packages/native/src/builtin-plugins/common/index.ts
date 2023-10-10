import {ItemDragEvent, ItemLayoutEvent, ItemResizeEvent} from "@/plugins";
import {tempStore} from "@/global";
import {clamp, throttle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {isAnimation} from "@/algorithm/common/tool";
import {autoSetSizeAndMargin} from "@/algorithm/common";
import {updateContainerSize} from "@/plugins/common";

/**
 * 更新最新resize后的尺寸
 * */
export const updateResponsiveResizeLayout = (ev: ItemResizeEvent) => {
  const fromItem = tempStore.fromItem || ev.fromItem
  const toPos = {
    x: ev.startGridX,
    y: ev.startGridY,
    w: Math.min(clamp(Math.abs(ev.shadowItemInfo.offsetRelativeW) + 1, fromItem.pos.minW, fromItem.pos.maxW), ev.col - fromItem.pos.x + 1),
    h: Math.min(clamp(Math.abs(ev.shadowItemInfo.offsetRelativeH) + 1, fromItem.pos.minH, fromItem.pos.maxH), ev.row - fromItem.pos.y + 1),
  }
  // console.log(toPos)
  if (fromItem.pos.w !== toPos.w || fromItem.pos.h !== toPos.h) {
    ev.addModifyItem(fromItem, toPos)
    directUpdateLayout(ev)
  }
}

/**
 * @param ev 事件对象
 * @param callback 处理当前影子item覆盖的item
 * */
export const updateResponsiveDragLayout: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  const {fromItem} = tempStore
  if (!fromItem || !isFunction(callback)) return
  // console.log(ev.name)
  //--------------------------------------------------------------------
  const manager = ev.container.layoutManager
  const {autoGrowCol, autoGrowRow} = ev.container
  const toPos = {
    ...fromItem.pos,
    x: autoGrowCol ? ev.startRelativeX : ev.startGridX,
    y: autoGrowRow ? ev.startRelativeY : ev.startGridY,
  }
  // console.log(toPos)
  ev.addModifyItem(fromItem, toPos) // 指定修改当前鼠标拖动item的位置
  ev.findDiffCoverItem(null, (item) => {
    const changePos = callback(item)
    if (changePos && isObject(changePos)) ev.addModifyItem(item, changePos)  // 添加被当前cloneEl覆盖item的移动方式
  })
  // console.log(items)
  const {offsetRelativeW, offsetRelativeH} = ev.shadowItemInfo

  manager.expandLineForPos(toPos, {
    row: {force: true},
    col: {force: true}
  })

  const isSuccess = directUpdateLayout(ev)
  // console.log(isSuccess)
  if (!isSuccess) {
    if (ev.toItem && !ev.inOuter) {  // 如果是斜角，符合某条件直接移动到该位置
      // console.log(offsetRelativeW, offsetRelativeH)
      if (Math.abs(offsetRelativeW) > 2 && Math.abs(offsetRelativeH) > 2) {
        ev.addModifyItem(fromItem, toPos)
      }
      directUpdateLayout(ev)
    } else if (autoGrowRow || autoGrowCol) {
      ev.setItemPos(fromItem, toPos)
    }
  }

}, 66)


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

/**
 * 立即更新布局
 * */
export const directUpdateLayout = (ev: ItemDragEvent | ItemResizeEvent | ItemLayoutEvent): boolean => {
  const {container} = ev
  if (!container._mounted) return false
  const {layoutManager: manager} = container
  autoSetSizeAndMargin(container, true)
  //-------------------------------------------------------------//
  container.reset()
  let res = manager.analysis(ev.getModifyItems())
  // console.log(res.isSuccess)
  if (!res.isSuccess) return false
  res.patch()
  ev.patchStyle()
  updateContainerSize(container)
  return true
}

/**
 * 节流更新布局的函数
 * */
export const updateLayout: Function = throttle(directUpdateLayout, 46)
