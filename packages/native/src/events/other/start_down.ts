import {Item} from "@/main";
import {getClientRect, parseContainer, parseItem} from "@/utils";
import {tempStore} from "@/global";

export function start_down(ev: MouseEvent) {
  const fromItem: Item | null = tempStore.fromItem = tempStore.toItem = parseItem(ev)
  tempStore.fromContainer = fromItem ? fromItem.container : parseContainer(ev)   // 必要，表明Item来源
  if (fromItem) {
    tempStore.mousedownItemWidth = fromItem.nowWidth()
    tempStore.mousedownItemHeight = fromItem.nowHeight()
    const fromEl = getClientRect(fromItem.element)
    tempStore.mousedownItemOffsetLeftProportion = (ev.pageX - (fromEl.left + window.scrollX)) / tempStore.mousedownItemWidth
    tempStore.mousedownItemOffsetTopProportion = (ev.pageY - (fromEl.top + window.scrollY)) / tempStore.mousedownItemHeight

    tempStore.lastPosW = fromItem.pos.w
    tempStore.lastPosH = fromItem.pos.h
    tempStore.lastPosX = <number>fromItem.pos.x
    tempStore.lastPosY = <number>fromItem.pos.y
  }
}
