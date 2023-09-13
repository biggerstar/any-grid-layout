import {ItemTransitionObject} from "@/types";
import {grid_clone_el, grid_dragging_source_el, grid_resizing_source_el} from "@/constant";
import {tempStore} from "@/global";


/**
 * 移除当前鼠标操作的clone元素 (drag,resize)
 * */
export function itemCloneElRemove_mouseup(_) {
  const {cloneElement, fromItem, isDragging, isResizing} = tempStore
  if (!cloneElement) return
  //----------移除Drag或者Resize创建的克隆备份-------------//
  //  清除对Item拖动或者调整大小产生的克隆对象
  let timer = null
  const gridCloneEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
  //------------------进行拖动归位延时动画执行 和 执行完毕后移除克隆元素--------------------//
  //   动画的执行方案来自拖拽指定的Item中transition信息(和Item间交换共用规则)，包括time和field设置都能改变这边回流动画的方式和规则
  for (let i = 0; i < gridCloneEls.length; i++) {
    const gridCloneEl = gridCloneEls[i]
    if (fromItem && fromItem.transition) {
      const transition = <ItemTransitionObject>fromItem.transition
      const containerElOffset = fromItem.container.contentElement.getBoundingClientRect()
      if (isDragging) {
        let left = window.scrollX + containerElOffset.left + fromItem.offsetLeft()
        let top = window.scrollY + containerElOffset.top + fromItem.offsetTop()
        fromItem.domImpl.updateStyle({
          transitionProperty: `${transition.field}`,
          transitionDuration: `${transition.time}ms`,
          width: `${fromItem.nowWidth()}px`,
          height: `${fromItem.nowHeight()}px`,
          left: `${left}px`,
          top: `${top}px`
        }, gridCloneEl)
      } else if (isResizing) {
        fromItem.domImpl.updateStyle({
          transitionProperty: `${transition.field}`,
          transitionDuration: `${transition.time}ms`,
          width: `${fromItem.nowWidth()}px`,
          height: `${fromItem.nowHeight()}px`,
        }, gridCloneEl)
      }
    }

    function removeCloneEl() {
      if (!fromItem || !fromItem) return
      fromItem.domImpl.removeClass(grid_dragging_source_el, grid_resizing_source_el)
      try {    // 拖拽
        gridCloneEl.parentNode.removeChild(gridCloneEl)
      } catch (e) {
      }
      clearTimeout(timer)
      timer = null
    }

    if (fromItem && fromItem.transition) {
      timer = setTimeout(removeCloneEl, (fromItem.transition as ItemTransitionObject).time)
    } else removeCloneEl()
  }
}

