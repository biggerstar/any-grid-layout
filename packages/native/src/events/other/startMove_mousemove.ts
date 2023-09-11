import {parseContainer, parseContainerAreaElement, parseItem, throttle} from "@/utils";
import {tempStore} from "@/events";


export const startMove_mousemove: Function = throttle((ev) => {
  const {
    dragItem,
    isLeftMousedown,
  } = tempStore
  if (!isLeftMousedown || !dragItem) return
  tempStore.toItem = parseItem(ev)
  tempStore.toContainer = parseContainer(ev)
  tempStore.toContainerArea = parseContainerAreaElement(ev)
  tempStore.mousemoveEvent = ev
}, 10)











