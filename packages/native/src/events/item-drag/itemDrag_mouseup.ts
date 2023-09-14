import {tempStore} from "@/global";

export function itemDrag_mouseup(_) {
  const {fromItem, isDragging, preventDragging} = tempStore
  if (fromItem && isDragging) {
    if (!preventDragging) fromItem.container.bus.emit('dragend')  // TODO 无dragging开始的情况不发起end
  }
}
