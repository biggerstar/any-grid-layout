import {throttle} from "@/utils";
import {tempStore} from "@/events";

/**
 * 鼠标开始resize后创建一个克隆可实时拖动的元素，不负责后续改变大小
 * 该克隆元素起始位置和源item的节点位置是一样的，克隆元素能跟随鼠标位置实时更改最新大小
 * */
export const itemResizeCloneElCreate_mousemove: Function = throttle((ev) => {
  const {
    mousedownEvent,
    fromItem,
    isResizing,
    cloneElement,
    fromContainer,
  } = tempStore
  if (cloneElement || !mousedownEvent || !fromItem || !isResizing) return

  const newNode = <HTMLElement>fromItem.element.cloneNode(true)
  tempStore.cloneElement = newNode
  newNode.classList.add('grid-clone-el', 'grid-resizing-clone-el')
  if (fromContainer) fromContainer.contentElement.appendChild(newNode)
  fromItem.domImpl.updateStyle({transition: 'none'}, newNode)
  fromItem.domImpl.addClass('grid-resizing-source-el')
}, 12)
