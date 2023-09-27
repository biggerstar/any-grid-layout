import {tempStore} from "@/global";

export function itemDrag_mouseup(_) {
  const {fromItem, isDragging, cloneElement, preventDragging} = tempStore
  if (fromItem && isDragging && cloneElement) {
    if (!preventDragging) fromItem.container.bus.emit('dragend')
  }
}
