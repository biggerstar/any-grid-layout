import {tempStore} from "@/global";

export function itemDrag_mouseup(_) {
  const {fromItem, isDragging, cloneElement, preventedDragging} = tempStore
  if (fromItem && isDragging && cloneElement && !preventedDragging) {
    fromItem.container.bus.emit('dragend')
  }
}
