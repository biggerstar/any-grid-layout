import {tempStore} from "@/global";

let bl = false

export const itemResize_mousemove: Function = (_: MouseEvent) => {
  const {isResizing, isLeftMousedown, fromItem, cloneElement} = tempStore
  if (!isResizing || !isLeftMousedown || !fromItem || !cloneElement) return
  if (bl) return
  requestAnimationFrame(() => {
    bl = false
    const {fromItem, cloneElement} = tempStore
    if (fromItem && cloneElement) fromItem.container.bus.emit('resizing')
  })
  bl = true
}
