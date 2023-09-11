import {tempStore} from "@/events";

export function itemResize_mousedown(ev) {
  if (tempStore.handleMethod) return   // 如果已经是其他操作则退出
  if (ev.target.className.includes('grid-item-resizable-handle')) {   //   用于resize
    tempStore.handleMethod = 'resize'
  }
}
