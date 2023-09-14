import {tempStore} from "@/global";
import {updateStyle} from "@/utils";


let ticking = false

/**
 * 移动当前鼠标拖动的克隆Item的元素，不负责后续改变位置
 * */
export const itemDrag_mousemove: Function = (ev) => {
  const {
    fromItem,
    isDragging,
    cloneElement,
    mousedownItemOffsetLeft,
    mousedownItemOffsetTop,
  } = tempStore
  if (!fromItem || !isDragging) return

  function updateDragConeElementLocation() {
    if (!cloneElement) return
    let left = ev.pageX - mousedownItemOffsetLeft
    let top = ev.pageY - mousedownItemOffsetTop
    updateStyle({
      left: `${left}px`,
      top: `${top}px`
    }, <HTMLElement>cloneElement)
  }

  if (!ticking) {
    requestAnimationFrame(() => {
      updateDragConeElementLocation()
      ticking = false
    })
    ticking = true
  }
  // console.log(fromItem.pos.x,fromItem.pos.y);
  if (fromItem) fromItem.container.bus.emit('dragging')
}
