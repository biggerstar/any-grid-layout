import {parseContainer, parseItem, throttle} from "@/utils";
import {
  cursor_type_default,
  cursor_type_drag_to_item_no_drop,
  cursor_type_in_container,
  cursor_type_item_resize,
  cursor_type_mousedown,
  cursor_type_no_drop,
  cursor_type_static_no_drop,
  grid_item_resizable_handle
} from "@/constant";
import {tempStore} from "@/global";
import {cursor} from "@/events";

export const cursor_mousemove: Function = throttle((ev) => {
  const {
    isLeftMousedown,
    isDragging,
    toContainer: container
  } = tempStore
  const overItem = parseItem(ev)
  if (isLeftMousedown) {
    const mousedownDragCursor = () => {
      // 鼠标按下状态的样式
      if (!container) {
        if (cursor.cursor !== cursor_type_no_drop) cursor.notDrop()  // 容器外
      } else if (container) {
        if (overItem) {
          if (overItem.static) {
            if (cursor.cursor !== cursor_type_drag_to_item_no_drop) cursor.dragToItemNoDrop()
          }
        } else if (!overItem) {
          // 拖动中的样式，这里只写的响应式，静态模式拖动中的逻辑在交换算法那里
          if (cursor.cursor !== cursor_type_mousedown) cursor.mousedown()
        }
      }
    }
    if (isDragging) mousedownDragCursor()
  } else {
    // 鼠标抬起状态的样式
    if (overItem) {
      const evClassList = ev.target.classList
      if (evClassList.contains(grid_item_resizable_handle)) {
        if (cursor.cursor !== cursor_type_item_resize) cursor.itemResize()
      } else if (overItem.static && container) {
        if (cursor.cursor !== cursor_type_static_no_drop) cursor.staticItemNoDrop()   // 静态模式才notDrop
      } else {
        if (cursor.cursor !== cursor_type_in_container) cursor.inContainer()
      }
    } else if (parseContainer(ev)) {
      if (cursor.cursor !== cursor_type_in_container) cursor.inContainer()
    } else if (cursor.cursor !== cursor_type_default) cursor.default()
  }
}, 45)
