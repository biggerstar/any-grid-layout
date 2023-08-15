import {tempStore} from "@/store";

export function itemResize_mousedown(ev) {
  const {fromItem} = tempStore
  const downTagClassName = ev.target.className
  if (downTagClassName.includes('grid-item-resizable-handle')) {   //   用于resize
    tempStore.handleMethod = 'resize'
    if (fromItem) fromItem.__temp__.resizeLock = true
  }
}
