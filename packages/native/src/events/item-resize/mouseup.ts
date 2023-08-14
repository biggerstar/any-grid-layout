import {Item} from "@/main";
import {tempStore} from "@/store";

export function mouseup(_: Event) {
  const fromItem: Item = tempStore.fromItem
  if (!fromItem) return
  //----------------------------------------//
  fromItem.__temp__.clientWidth = fromItem.nowWidth()
  fromItem.__temp__.clientHeight = fromItem.nowHeight()
  tempStore.isLeftMousedown = false
  fromItem.domImpl.updateStyle(fromItem.genItemStyle())
}
