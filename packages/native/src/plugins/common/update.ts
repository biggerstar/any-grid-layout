import {autoSetSizeAndMargin} from "@/algorithm/common";
import {throttle} from "@/utils";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins";
import {tempStore} from "@/global";


/**
 * 检测当前拖动的元素大小和上一次相比是否变化
 * */
export const checkItemSizeHasChanged: Function = (_: ItemResizeEvent) => {
  const {fromItem, lastResizeW, lastResizeH} = tempStore
  if (!fromItem) return
  if (fromItem.pos.w !== tempStore.lastResizeW || fromItem.pos.h !== tempStore.lastResizeH) {
    if (lastResizeW && lastResizeH) fromItem.container.bus.emit('itemSizeChanged', {item: fromItem})
    tempStore.lastResizeW = fromItem.pos.w
    tempStore.lastResizeH = fromItem.pos.h
  }
}

/**
 * 检测当前拖动的元素位置和上一次相比是否变化
 * */
export const checkItemPositionHasChanged: Function = (_: ItemResizeEvent) => {
  const {fromItem, lastDragX, lastDragY} = tempStore
  if (!fromItem) return
  if (fromItem.pos.x !== lastDragX || fromItem.pos.y !== lastDragY) {
    if (lastDragX && lastDragY) fromItem.container.bus.emit('itemPositionChanged', {item: fromItem})
    tempStore.lastDragX = <number>fromItem.pos.x
    tempStore.lastDragY = <number>fromItem.pos.y
  }
}

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
  if (!res.isSuccess) return false
  res.patch()
  ev.patchStyle()
  container.updateContainerSizeStyle()
  return true
}

/**
 * 节流更新布局的函数
 * */
export const updateLayout: Function = throttle(directUpdateLayout, 46)

/**
 * 更新适合当前容器的容器大小
 * */
export function updateContainerSize() {
  tempStore.fromContainer?.updateContainerSizeStyle?.()
}

