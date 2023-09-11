import {throttle} from "@/utils";
import {tempStore} from "@/events";

export const itemResize_mousemove: Function = throttle((ev: MouseEvent) => {
  const {isResizing, isLeftMousedown, fromItem} = tempStore
  if (!fromItem || !isResizing || !isLeftMousedown) return
  const {bus} = fromItem.container
  bus.emit('resizing')
}, 15)
