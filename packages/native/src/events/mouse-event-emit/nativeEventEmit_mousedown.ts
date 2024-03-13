import {parseContainer} from "@/utils";

export function nativeEventEmit_mousedown(ev: MouseEvent) {
  const mousedownContainer = parseContainer(ev)
  if (mousedownContainer) {
    mousedownContainer.bus.emit('mousedown')
  }
}
