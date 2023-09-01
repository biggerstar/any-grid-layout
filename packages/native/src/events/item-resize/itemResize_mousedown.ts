import {tempStore} from "@/events";

export function itemResize_mousedown(ev) {
  const {fromItem, handleMethod} = tempStore
  if (handleMethod) return   // 如果已经是其他操作则退出
  const downTagClassName = ev.target.className
  if (downTagClassName.includes('grid-item-resizable-handle')) {   //   用于resize
    tempStore.handleMethod = 'resize'
    if (fromItem) fromItem.__temp__.resizeLock = true
  }
}
