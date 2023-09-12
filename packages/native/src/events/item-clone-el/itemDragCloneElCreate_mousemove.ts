import {throttle} from "@/utils";
import {tempStore} from "@/events";
import {grid_clone_el, grid_dragging_clone_el, grid_dragging_source_el} from "@/constant";

/**
 * 鼠标开始移动后创建一个克隆可实时拖动的元素
 * 鼠标移动过程中实时更新当前克隆元素的位置
 * */
export const itemDragCloneElCreate_mousemove: Function = throttle(() => {
  const {
    mousedownEvent,
    fromItem,
    isDragging,
    cloneElement,
    isLeftMousedown,
  } = tempStore
  if (!mousedownEvent || !fromItem || !isDragging || !isLeftMousedown) return
  if (cloneElement) return
  const finallyRemoveEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
  if (finallyRemoveEls.length) return;
  const sourceEl = fromItem.element
  const newNode = <HTMLElement>sourceEl.cloneNode(true)
  newNode.classList.add(grid_clone_el, grid_dragging_clone_el)
  fromItem.domImpl.addClass(grid_dragging_source_el)
  const {left, top} = sourceEl.getBoundingClientRect()
  fromItem.domImpl.updateStyle({
    pointerEvents: 'none',   // 指定克隆元素永远不会成为ev.target值
    transitionProperty: 'none',
    transitionDuration: 'none',
    left: `${left}px`,
    top: `${top}px`
  }, newNode)
  tempStore.cloneElement = newNode
  document.body.appendChild(newNode)    // 直接添加到body中后面定位省心省力
}, 12)
