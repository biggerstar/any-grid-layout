import {tempStore} from "@/events";

export function itemResize_mouseup(_: Event) {
  const {isResizing, fromItem} = tempStore
  if (!isResizing || !fromItem) return
  //----------------------------------------//
  fromItem.updateItemLayout()
  fromItem.container.bus.emit('resized')
}
