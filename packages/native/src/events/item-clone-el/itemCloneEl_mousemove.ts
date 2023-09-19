import {tempStore} from "@/global";

export function itemCloneEl_mousemove(_) {
  if (tempStore.fromItem) tempStore.fromItem.container.bus.emit('updateCloneElementSize')
}
