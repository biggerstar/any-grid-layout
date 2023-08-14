import {ItemTransitionObject} from "@/types";
import {tempStore} from "@/store";

export function cloneRemove_mouseup(_) {
  const {cloneElement, dragItem, isDragging, fromItem, isResizing} = tempStore
  //----------移除Drag或者Resize创建的克隆备份-------------//
  if (cloneElement) {   //  清除对Item拖动或者调整大小产生的克隆对象
    let timer = null
    const gridCloneEls = document.querySelectorAll<HTMLElement>('.grid-clone-el')
    //------------------进行拖动归位延时动画执行和执行完毕后移除克隆元素--------------------//
    //   动画的执行方案来自拖拽指定的Item中transition信息(和Item间交换共用规则)，包括time和field设置都能改变这边回流动画的方式和规则
    for (let i = 0; i < gridCloneEls.length; i++) {
      const gridCloneEl = gridCloneEls[i]
      if (dragItem && dragItem.transition) {
        const transition = <ItemTransitionObject>dragItem.transition
        const containerElOffset = dragItem.container.contentElement.getBoundingClientRect()
        if (isDragging) {
          let left = window.scrollX + containerElOffset.left + dragItem.offsetLeft()
          let top = window.scrollY + containerElOffset.top + dragItem.offsetTop()
          dragItem.domImpl.updateStyle({
            transitionProperty: `${transition.field}`,
            transitionDuration: `${transition.time}ms`,
            width: `${dragItem.nowWidth()}px`,
            height: `${dragItem.nowHeight()}px`,
            left: `${left}px`,
            top: `${top}px`
          }, gridCloneEl)
        } else if (isResizing) {
          dragItem.domImpl.updateStyle({
            transitionProperty: `${transition.field}`,
            transitionDuration: `${transition.time}ms`,
            width: `${dragItem.nowWidth()}px`,
            height: `${dragItem.nowHeight()}px`,
            left: `${dragItem.offsetLeft()}px`,
            top: `${dragItem.offsetTop()}px`
          }, gridCloneEl)
        }
      }

      function removeCloneEl() {
        if (!dragItem || !fromItem) return
        dragItem.domImpl.removeClass('grid-dragging-source-el', 'grid-resizing-source-el')
        try {    // 拖拽
          gridCloneEl.parentNode.removeChild(gridCloneEl)
        } catch (e) {
        }
        dragItem.__temp__.dragging = false
        fromItem.__temp__.dragging = false
        clearTimeout(timer)
        timer = null
      }

      if (dragItem && dragItem.transition) {
        timer = setTimeout(removeCloneEl, (dragItem.transition as ItemTransitionObject).time)
      } else removeCloneEl()
    }
  }
}

