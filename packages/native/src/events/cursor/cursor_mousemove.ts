import {
  parseContainer,
  parseContainerAreaElement,
  parseContainerFromPrototypeChain,
  parseItem,
  throttle
} from "@/utils";
import {Container} from "@/main";
import {tempStore} from "@/store";
import {cursor,} from "@/events";


export const cursor_mousemove: Function = throttle((ev) => {
  const {
    isLeftMousedown,
    isDragging,
  } = tempStore
  const containerArea: HTMLElement = parseContainerAreaElement(ev)
  const container: Container | null = parseContainerFromPrototypeChain(containerArea)
  const overItem = parseItem(ev)
  if (isLeftMousedown) {
    const mousedownDragCursor = () => {
      // 鼠标按下状态的样式
      if (!container) {
        if (cursor.cursor !== 'no-drop') cursor.notDrop()  // 容器外
      } else if (container) {
        if (overItem) {
          if (overItem.static) {
            if (cursor.cursor !== 'drag-to-item-no-drop') cursor.dragToItemNoDrop()
          }
        } else if (!overItem && container.getConfig('responsive')) {
          // 拖动中的样式，这里只写的响应式，静态模式拖动中的逻辑在交换算法那里
          if (cursor.cursor !== 'mousedown') cursor.mousedown()
        }
      }
    }
    if (isDragging) mousedownDragCursor()
  } else {
    // 鼠标抬起状态的样式
    if (overItem) {
      const evClassList = ev.target.classList
      if (evClassList.contains('grid-item-close-btn')) {
        if (cursor.cursor !== 'item-close') cursor.itemClose()
      } else if (evClassList.contains('grid-item-resizable-handle')) {
        if (cursor.cursor !== 'item-resize') cursor.itemResize()
      } else if (overItem.static && container) {
        if (cursor.cursor !== 'static-no-drop') cursor.staticItemNoDrop()   // 静态模式才notDrop
      } else {
        if (cursor.cursor !== 'in-container') cursor.inContainer()
      }
    } else if (parseContainer(ev)) {
      if (cursor.cursor !== 'in-container') cursor.inContainer()
    } else if (cursor.cursor !== 'default') cursor.default()
  }
}, 45)
