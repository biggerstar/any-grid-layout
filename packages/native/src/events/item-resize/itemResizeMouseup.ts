import {tempStore} from "@/store";

export function itemResizeMouseup(_: Event) {
  const {isResizing, fromItem} = tempStore
  if (!isResizing) return
  if (!fromItem) return
  //----------------------------------------//
  fromItem.__temp__.clientWidth = fromItem.nowWidth()
  fromItem.__temp__.clientHeight = fromItem.nowHeight()
  tempStore.isLeftMousedown = false
  fromItem.domImpl.updateStyle(fromItem.genItemStyle())
}
