import {tempStore} from "@/global";

export function itemResize_mouseup(_: Event) {
  const {isResizing, fromItem, preventedResizing, cloneElement} = tempStore
  if (!isResizing || !fromItem || !cloneElement) return
  //----------------------------------------//
  fromItem.updateItemLayout()
  if (!preventedResizing) fromItem.container.bus.emit('resized')
}
