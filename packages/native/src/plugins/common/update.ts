import {updateStyle} from "@/utils";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
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
 * 更新适合当前容器的容器大小
 * */
export function updateContainerSize() {
  tempStore.fromContainer?.updateContainerSizeStyle?.()
}

/**
 * 更新水平方向的item克隆元素尺寸和尝试更新源item的大小
 * */
export function updateHorizontalResize(ev: ItemResizeEvent) {
  const {fromItem, cloneElement} = tempStore
  if (!fromItem || !cloneElement) return
  const width = Math.min(ev.spaceInfo.clampWidth, ev.spaceInfo.spaceRight)
  updateStyle({
    width: `${width}px`,
  }, cloneElement)
  ev.tryChangeStyle(fromItem, {w: ev.container.pxToW(width)})
}

/**
 * 更新垂直方向的item克隆元素尺寸和尝试更新源item的大小
 * */
export function updateVerticalResize(ev: ItemResizeEvent) {
  const {fromItem, cloneElement} = tempStore
  if (!fromItem || !cloneElement) return
  const height = Math.min(ev.spaceInfo.clampHeight, ev.spaceInfo.spaceBottom)
  updateStyle({
    height: `${height}px`,
  }, cloneElement)
  ev.tryChangeStyle(fromItem, {h: ev.container.pxToH(height)})
}

