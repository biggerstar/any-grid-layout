import {tempStore} from "@/events";

/**
 * 移动当前鼠标拖动的克隆Item的元素，不负责后续改变位置
 * */
export const itemDrag_mousemove: Function = (ev) => {
  function updateDragLocation() {
    const {
      dragItem,
      isDragging,
      mousedownItemOffsetLeft,
      mousedownItemOffsetTop,
      isLeftMousedown,
      cloneElement,
    } = tempStore
    if (!dragItem || !isDragging || !cloneElement || !isLeftMousedown) return
    let left = ev.pageX - mousedownItemOffsetLeft
    let top = ev.pageY - mousedownItemOffsetTop
    dragItem.domImpl.updateStyle({
      left: `${left}px`,
      top: `${top}px`
    }, cloneElement)  // 必须重新从tempStore获取当前克隆节点
    dragItem.container.bus.emit('dragging')
  }

  requestAnimationFrame(updateDragLocation)
}
