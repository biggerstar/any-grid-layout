import {throttle} from "@/utils";
import {tempStore} from "@/events";

export const itemResize_mousemove: Function = throttle((ev: MouseEvent) => {
  const {isResizing, isLeftMousedown, fromItem} = tempStore
  tempStore.mousemoveResizeEvent = ev
  if (!fromItem || !isResizing || !isLeftMousedown) return
  const {bus} = fromItem.container
  bus.emit('itemResizing')
}, 15)
