import {tempStore} from "@/events";
import {Container} from "@/main";
import {parseContainer} from "@/utils";

/**
 * 移动当前鼠标拖动的克隆Item的元素，不负责后续改变位置
 * */
export const itemDrag_mousemove: Function = (ev) => {
  function updateDragLocation() {
    const {
      mousedownEvent,
      fromItem,
      moveItem,
      isDragging,
      mousedownItemOffsetLeft,
      mousedownItemOffsetTop,
      cloneElement
    } = tempStore
    // TODO 改造移动作为drag默认事件
    let left = ev.pageX - mousedownItemOffsetLeft
    let top = ev.pageY - mousedownItemOffsetTop
    if (!mousedownEvent || !fromItem || !isDragging || !cloneElement) return
    let dragItem = moveItem || fromItem
    const container: Container | null = parseContainer(ev)
    tempStore.mousemoveDragEvent = ev
    tempStore.moveContainer = container
    if (!dragItem.dragOut && container) {   // 限制是否允许拖动到容器之外
      const containerElOffset = container.contentElement.getBoundingClientRect()
      const limitLeft = window.scrollX + containerElOffset.left
      const limitTop = window.scrollY + containerElOffset.top
      const limitRight = window.scrollX + containerElOffset.left + container.contentElement.clientWidth - dragItem.nowWidth()
      const limitBottom = window.scrollY + containerElOffset.top + container.contentElement.clientHeight - dragItem.nowHeight()
      if (left < limitLeft) left = limitLeft
      if (left > limitRight) left = limitRight
      if (top < limitTop) top = limitTop
      if (top > limitBottom) top = limitBottom
    }
    console.log(container);
    dragItem.domImpl.updateStyle({
      left: `${left}px`,
      top: `${top}px`
    }, cloneElement)  // 必须重新从tempStore获取当前克隆节点
    if (dragItem) {
      dragItem.container.bus.emit('dragging')
    }
  }

  requestAnimationFrame(updateDragLocation)
}
