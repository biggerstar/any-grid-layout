import {tempStore} from "@/events";

export function itemResize_mouseup(_: Event) {
  const {isResizing, fromItem} = tempStore
  if (!isResizing || !fromItem) return
  //----------------------------------------//
  const {__temp__, domImpl, container} = fromItem
  __temp__.clientWidth = fromItem.nowWidth()
  __temp__.clientHeight = fromItem.nowHeight()
  domImpl.updateStyle(fromItem.genItemStyle())
  container.bus.emit('resized')
}
