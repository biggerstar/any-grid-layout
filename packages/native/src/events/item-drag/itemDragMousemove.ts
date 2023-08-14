import {
  parseContainer,
  parseContainerAreaElement,
  parseContainerFromPrototypeChain,
  parseItem,
  throttle
} from "@/utils";
import {Container} from "@/main";
import {tempStore} from "@/store";
import {
  crossContainerLeaveEnter,
  crossContainerMouseenter,
  crossContainerMouseleave,
  cursor,
  doItemResize,
} from "@/events";


export const itemDragMousemove: Function = throttle((ev) => {
  const {
    isLeftMousedown,
    currentContainerArea,
    currentContainer,
    isDragging,
    isResizing,
  } = tempStore
  const containerArea: HTMLElement = parseContainerAreaElement(ev)
  const container: Container | null = parseContainerFromPrototypeChain(containerArea)
  const overItem = parseItem(ev)
  if (isLeftMousedown) {
    tempStore.beforeContainerArea = currentContainerArea
    tempStore.currentContainerArea = containerArea
    tempStore.beforeContainer = currentContainer
    tempStore.currentContainer = container
    if (containerArea && currentContainerArea) {   // 表示进去了某个Container内
      if (containerArea !== currentContainerArea) {
        // 从相邻容器移动过去，旧容器 ==>  新容器
        crossContainerLeaveEnter(<any>currentContainer, <any>container)
      }
    } else {
      if (containerArea || currentContainerArea) {
        // 非相邻容器中的网页其他空白元素移进来某个容器中
        if (!currentContainerArea) crossContainerMouseenter(null, container)
        if (!containerArea) crossContainerMouseleave(null, currentContainer)
      }
    }

    // console.log(tempStore.dragOrResize);
    const mousedownDragCursor = () => {
      // 鼠标按下状态的样式
      // console.log(container);
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
    if (isDragging) {
      mousedownDragCursor()
    } else if (isResizing) {
      doItemResize(ev)
    }
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
}, 12)
