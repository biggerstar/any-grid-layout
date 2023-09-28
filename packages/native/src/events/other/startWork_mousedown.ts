import {Item} from "@/main";
import {parseContainer, parseItem} from "@/utils";
import {tempStore} from "@/global";


export function startWork_mousedown(ev) {
  const fromItem: Item | null = tempStore.fromItem = tempStore.toItem = parseItem(ev)
  if (!fromItem) return
  const fromEl = fromItem.element.getBoundingClientRect()
  tempStore.fromContainer = fromItem.container || parseContainer(ev)  // 必要，表明Item来源
  tempStore.mousedownItemWidth = fromItem.nowWidth()
  tempStore.mousedownItemHeight = fromItem.nowHeight()
  tempStore.mousedownItemOffsetLeftProportion = (ev.pageX - (fromEl.left + window.scrollX)) / tempStore.mousedownItemWidth
  tempStore.mousedownItemOffsetTopProportion = (ev.pageY - (fromEl.top + window.scrollY)) / tempStore.mousedownItemHeight
}
