import {throttle, updateStyle} from "@/utils";
import {grid_clone_el, grid_resizing_clone_el, grid_resizing_source_el} from "@/constant";
import {tempStore} from "@/global";

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
    fromContainer,
  } = tempStore
  if (cloneElement || !mousedownEvent || !fromContainer || !fromItem || !isResizing) return
  const newNode = <HTMLElement>fromItem.element.cloneNode(true)
  newNode.classList.add(grid_clone_el,  grid_resizing_clone_el)
  newNode.classList.remove(grid_resizing_source_el)
  fromItem.element.classList.add(grid_resizing_source_el)
  updateStyle({
    transition: 'none',
    pointerEvents:'none'
  }, newNode)
  tempStore.cloneElement = newNode
  fromContainer.contentElement.appendChild(newNode)
}, 36)
