import {tempStore} from "@/events";

export function itemDrag_mouseup(_) {
  const {dragItem, isDragging} = tempStore
  if (dragItem && isDragging) {
    dragItem.container.bus.emit('itemMoved')
  }
}
