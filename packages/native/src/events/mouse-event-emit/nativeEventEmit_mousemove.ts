import {parseContainer} from "@/utils";

export const nativeEventEmit_mousemove = (ev: MouseEvent) => {
  const mousemoveContainer = parseContainer(ev)
  if (mousemoveContainer) {
    mousemoveContainer.bus.emit('mousemove')
  }
}
