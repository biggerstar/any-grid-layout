import {tempStore} from "@/global";


export function mouseEventEmit_mouseup(_:any) {
  if (tempStore.fromContainer) {
    tempStore.fromContainer.bus.emit('mouseup')
  }
}
