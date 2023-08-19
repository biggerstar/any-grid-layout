import {cursor} from "@/events";
import {Container, Item} from "@/main";
import {parseContainer, parseItem} from "@/utils";

export function cursor_mousedown(ev) {
  const container: Container | null = parseContainer(ev)
  const fromItem: Item = <Item>parseItem(ev)
  if (!container && !fromItem) return // 只有点击Container或里面元素才生效

  if (fromItem && fromItem.container === container && !fromItem.static) cursor.mousedown()
  else if ((!fromItem || fromItem.container !== container) && !ev.touches) cursor.mousedown()
}
