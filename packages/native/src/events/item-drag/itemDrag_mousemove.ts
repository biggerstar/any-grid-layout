import {tempStore} from "@/events";

/**
 * 移动当前鼠标拖动的克隆Item的元素，不负责后续改变位置
 * */
export const itemDrag_mousemove: Function = (ev) => {
  function updateDragLocation() {
    const {
      fromItem,
      isDragging,
      mousedownItemOffsetLeft,
      mousedownItemOffsetTop,
      isLeftMousedown,
      cloneElement,
    } = tempStore
    if (!fromItem || !isDragging || !cloneElement || !isLeftMousedown) return
    let left = ev.pageX - mousedownItemOffsetLeft
    let top = ev.pageY - mousedownItemOffsetTop
    fromItem.domImpl.updateStyle({
      left: `${left}px`,
      top: `${top}px`
    }, cloneElement)  // 必须重新从tempStore获取当前克隆节点
    fromItem.container.bus.emit('dragging')
  }

  requestAnimationFrame(updateDragLocation)
}
