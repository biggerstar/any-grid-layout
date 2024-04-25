import {parseContainer, parseItem, throttle} from "@/utils";
import {tempStore} from "@/global";

export const start_move: Function = throttle((ev:MouseEvent) => {
  const {
    fromItem,
    isLeftMousedown,
  } = tempStore
  if (!isLeftMousedown || !fromItem) {
    return
  }
  tempStore.toItem = parseItem(ev)
  tempStore.toContainer = parseContainer(ev)
}, 10)











