import {tempStore} from "@/global";

let bl = false

export const itemResize_mousemove: Function = (_: MouseEvent) => {
  const {isResizing, isLeftMousedown, fromItem} = tempStore
  if (!fromItem || !isResizing || !isLeftMousedown) return
  if (bl) return
  requestAnimationFrame(() => {
    fromItem.container.bus.emit('resizing')
    bl = false
  })
  bl = true
}
