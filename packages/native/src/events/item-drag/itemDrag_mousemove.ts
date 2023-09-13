import {tempStore} from "@/global";


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
    toContainer
  } = tempStore
  if (!fromItem || !isDragging) return

  function updateDragConeElementLocation() {
    let left = ev.pageX - mousedownItemOffsetLeft
    let top = ev.pageY - mousedownItemOffsetTop
    fromItem!.domImpl.updateStyle({
      left: `${left}px`,
      top: `${top}px`
    }, cloneElement)
  }
  if (!ticking) {
    requestAnimationFrame(() => {
      updateDragConeElementLocation()
      ticking = false
    })
    ticking = true
  }
  if (fromItem) fromItem.container.bus.emit('dragging')
}
