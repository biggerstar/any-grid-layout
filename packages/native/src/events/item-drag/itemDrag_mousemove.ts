import {tempStore} from "@/global";

/**
 * 移动当前鼠标拖动的克隆Item的元素，不负责后续改变位置
 * */
export const itemDrag_mousemove: Function = (_) => {
  const {
    fromItem,
    isDragging,
  } = tempStore
  if (!fromItem || !isDragging) return
  fromItem.container.bus.emit('dragging')
}
