import {tempStore} from "@/global";

export function itemResize_mouseup(_: Event) {
  const {isResizing, fromItem, preventResizing, cloneElement} = tempStore
  if (!isResizing || !fromItem || !cloneElement) return
  //----------------------------------------//
  fromItem.updateItemLayout()
  if (!preventResizing) fromItem.container.bus.emit('resized')
}
