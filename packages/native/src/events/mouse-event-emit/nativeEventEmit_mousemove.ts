import {parseContainer} from "@/utils";
import {tempStore} from "@/global";

export const nativeEventEmit_mousemove = (ev: MouseEvent) => {
  // console.log(ev.clientX, ev.clientY)
  const mousemoveContainer = tempStore.fromContainer || parseContainer(ev)
  if (mousemoveContainer) {
    mousemoveContainer.bus.emit('mousemove',{
      inputEvent: ev
    })
  }
}
