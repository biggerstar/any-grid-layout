import {throttle} from "@/utils";
import {tempStore} from "@/events";

/**
 * 鼠标开始resize后创建一个克隆可实时拖动的元素，不负责后续改变大小
 * 该克隆元素起始位置和源item的节点位置是一样的，克隆元素能跟随鼠标位置实时更改最新大小
 * */
export const itemResizeCloneElCreate_mousemove: Function = throttle(() => {
  const {
    mousedownEvent,
    fromItem,
    isResizing,
    cloneElement,
    isLeftMousedown,
    fromContainer,
  } = tempStore
  if (cloneElement || !mousedownEvent || !fromContainer || !fromItem || !isResizing || !isLeftMousedown) return
  const newNode = <HTMLElement>fromItem.element.cloneNode(true)
  newNode.classList.add('grid-clone-el', 'grid-resizing-clone-el')
  fromItem.domImpl.addClass('grid-resizing-source-el')
  fromItem.domImpl.updateStyle({
    transition: 'none',
    pointerEvents:'none'
  }, newNode)
  tempStore.cloneElement = newNode
  fromContainer.contentElement.appendChild(newNode)
}, 36)
