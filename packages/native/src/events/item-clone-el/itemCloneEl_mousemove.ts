import {tempStore} from "@/global";

let bl = false
export const itemCloneEl_mousemove = (_) => {
  if (bl) return
  requestAnimationFrame(() => {
    if (tempStore.fromItem) {
      tempStore.fromItem.container.bus.emit('updateCloneElementStyle')
    }
    bl = false
  })
  bl = true
}
