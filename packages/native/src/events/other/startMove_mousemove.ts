import {parseContainer, parseItem, throttle} from "@/utils";
import {tempStore} from "@/global";

export const startMove_mousemove: Function = throttle((ev) => {
  const {
    fromItem,
    isLeftMousedown,
  } = tempStore
  if (!isLeftMousedown || !fromItem) {
    return
  }
  tempStore.toItem = parseItem(ev)
  tempStore.toContainer = parseContainer(ev)
  tempStore.mousemoveEvent = ev
}, 10)











