import {tempStore} from "@/global";

let bl = false

/**
 * 移动当前鼠标拖动的克隆Item的元素，不负责后续改变位置
 * */
export const itemDrag_mousemove: Function = (_) => {
  if (!tempStore.isLeftMousedown) return
  if (bl) return
  requestAnimationFrame(() => {
    bl = false
    const {
      fromItem,
      isDragging,
      cloneElement,
    } = tempStore
    if (fromItem && isDragging && cloneElement) {  // 因为异步，必须保证fromItem存在和正在拖动,正在拖动必然有cloneEl
      fromItem.container.bus.emit('dragging')
    }
  })
  bl = true
}
