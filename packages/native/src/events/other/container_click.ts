import {tempStore} from "@/global";

export function container_click(_) {
  const {fromContainer} = tempStore
  if (fromContainer) {
    fromContainer.bus.emit("click")
  }
}
