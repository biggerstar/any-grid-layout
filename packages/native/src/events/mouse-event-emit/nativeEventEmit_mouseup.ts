import {parseContainer} from "@/utils";

export function nativeEventEmit_mouseup(ev: any) {
  const mouseupContainer = parseContainer(ev)
  if (mouseupContainer) {
    mouseupContainer.bus.emit('mouseup')
  }
}
