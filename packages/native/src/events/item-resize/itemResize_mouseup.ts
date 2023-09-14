import {tempStore} from "@/global";

export function itemResize_mouseup(_: Event) {
  const {isResizing, fromItem, preventResizing} = tempStore
  if (!isResizing || !fromItem) return
  //----------------------------------------//
  fromItem.updateItemLayout()
  if (!preventResizing) fromItem.container.bus.emit('resized')
}
