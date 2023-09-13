import {tempStore} from "@/global";

export function itemDrag_mouseup(_) {
  const {fromItem, isDragging} = tempStore
  if (fromItem && isDragging) {
    fromItem.container.bus.emit('dragend')
  }
}
