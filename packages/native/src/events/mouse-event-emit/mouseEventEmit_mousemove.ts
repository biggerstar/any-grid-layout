import {tempStore} from "@/global";

export const mouseEventEmit_mousemove = (_:MouseEvent) => {
  if (tempStore.fromContainer) {
    tempStore.fromContainer.bus.emit('mousemove')
  }
}
