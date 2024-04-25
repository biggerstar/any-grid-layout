import {parseContainer} from "@/utils";
import {tempStore} from "@/global";

export function nativeEventEmit_mousedown(ev: MouseEvent) {
  const mousedownContainer = tempStore.fromContainer || parseContainer(ev)
  if (mousedownContainer) {
    mousedownContainer.bus.emit('mousedown',{
      inputEvent: ev
    })
  }
}
