import {parseContainer} from "@/utils";
import {tempStore} from "@/global";

export function nativeEventEmit_mouseup(ev: any) {
  const mouseupContainer = tempStore.fromContainer || parseContainer(ev)
  if (mouseupContainer) {
    mouseupContainer.bus.emit('mouseup')
  }
}
