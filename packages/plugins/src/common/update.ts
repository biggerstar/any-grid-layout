import {Container, tempStore, updateStyle} from "@biggerstar/layout";


/**
 * 更新适合当前容器的容器大小
 * */
export function updateContainerSize(container?: Container) {
  (container || tempStore.fromContainer)?.updateContainerSizeStyle?.()
}

/**
 * 更新水平方向的item克隆元素尺寸和尝试更新源item的大小
 * */
export function updateHorizontalResize(ev: any) {
  const {fromItem, cloneElement} = tempStore
  if (!fromItem || !cloneElement) {
    return
  }
  const width = Math.min(ev.spaceInfo.clampWidth, ev.spaceInfo.spaceRight)
  updateStyle({
    width: `${width}px`,
  }, cloneElement)
  ev.setItemPos(fromItem, {w: ev.container.pxToW(width)})
}

/**
 * 更新垂直方向的item克隆元素尺寸和尝试更新源item的大小
 * */
export function updateVerticalResize(ev: any) {
  const {fromItem, cloneElement} = tempStore
  if (!fromItem || !cloneElement) {
    return
  }
  const height = Math.min(ev.spaceInfo.clampHeight, ev.spaceInfo.spaceBottom)
  updateStyle({
    height: `${height}px`,
  }, cloneElement)
  ev.setItemPos(fromItem, {h: ev.container.pxToH(height)})
}

