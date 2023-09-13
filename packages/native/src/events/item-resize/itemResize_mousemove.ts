import {throttle} from "@/utils";
import {tempStore} from "@/global";

export const itemResize_mousemove: Function = throttle((_: MouseEvent) => {
  const {isResizing, isLeftMousedown, fromItem} = tempStore
  if (!fromItem || !isResizing || !isLeftMousedown) return
  const {bus} = fromItem.container
  bus.emit('resizing')
}, 15)
