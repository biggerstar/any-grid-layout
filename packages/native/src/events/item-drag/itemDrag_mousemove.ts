import {tempStore} from "@/global";

let bl = false

/**
 * 移动当前鼠标拖动的克隆Item的元素，不负责后续改变位置
 * */
export const itemDrag_mousemove: Function = (_) => {
  const {
    fromItem,
    isDragging,
  } = tempStore
  if (!fromItem || !isDragging) return
  if (bl) return
  requestAnimationFrame(() => {
    fromItem.container.bus.emit('dragging')
    bl = false
  })
  bl = true
}
