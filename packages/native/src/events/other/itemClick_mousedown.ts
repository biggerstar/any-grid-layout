import {tempStore} from "@/global";

export function itemClick_mousedown(_) {
  const {fromContainer} = tempStore
  if (fromContainer) {
    fromContainer.bus.emit("click")
  }
}
