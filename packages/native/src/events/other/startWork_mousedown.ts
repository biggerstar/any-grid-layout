import {Item} from "@/main";
import {parseContainer, parseItem} from "@/utils";
import {tempStore} from "@/global";


export function startWork_mousedown(ev) {
  const fromItem: Item = tempStore.fromItem = tempStore.toItem = <Item>parseItem(ev)
  tempStore.fromContainer = fromItem?.container || parseContainer(ev)  // 必要，表明Item来源
}
