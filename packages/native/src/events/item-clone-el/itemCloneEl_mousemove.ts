import {tempStore} from "@/global";

let bl = false
export const itemCloneEl_mousemove = (_:MouseEvent) => {
  if (bl) return
  requestAnimationFrame(() => {
    bl = false
    if (tempStore.fromItem) {
      tempStore.fromItem.container.bus.emit('updateCloneElementStyle')
    }
  })
  bl = true
}
