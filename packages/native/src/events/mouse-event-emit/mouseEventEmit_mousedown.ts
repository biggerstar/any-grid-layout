import {tempStore} from "@/global";

export function mouseEventEmit_mousedown(_: MouseEvent) {
  if (tempStore.fromContainer) {
    tempStore.fromContainer.bus.emit('mousedown')
  }
}
