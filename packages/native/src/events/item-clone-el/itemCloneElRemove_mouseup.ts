import {grid_clone_el, grid_dragging_source_el, grid_resizing_source_el} from "@/constant";
import {tempStore} from "@/global";
import {getClientRect, updateStyle} from "@/utils";

/**
 * 移除当前鼠标操作的clone元素 (drag,resize)
 * */
export function itemCloneElRemove_mouseup(_:any) {
  const gridCloneEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
  //------------------进行拖动归位延时动画执行 和 执行完毕后移除克隆元素--------------------//
  //   动画的执行方案来自拖拽指定的Item中transition信息(和Item间交换共用规则)，包括time和field设置都能改变这边回流动画的方式和规则
  if (gridCloneEls.length > 0) {
    const allCloneEls = Array.from(gridCloneEls)
    const lastCloneElement = allCloneEls.pop()
    allCloneEls.forEach((el: HTMLElement) => el.parentNode.removeChild(el))
    delayRemoveCloneEl(lastCloneElement)
  }
}

function delayRemoveCloneEl(gridCloneEl: HTMLElement) {
  const {fromItem, isDragging, isResizing} = tempStore
  //----------移除Drag或者Resize创建的克隆备份-------------//
  //  清除对Item拖动或者调整大小产生的克隆对象
  let timer = null
  const backTime = 180
  const delayUpdateAnimationTime = 60
  if (!fromItem){
    gridCloneEl.parentNode.removeChild(gridCloneEl)
    return
  }
  const containerElOffset = getClientRect(fromItem.container.contentElement)
  const baseStyle: Partial<CSSStyleDeclaration> = {
    transitionProperty: `top, left, width, height`,
    transitionDuration: `${backTime}ms`,
    width: `${fromItem.nowWidth()}px`,
    height: `${fromItem.nowHeight()}px`,
  }
  if (isDragging) {
    let left = window.scrollX + containerElOffset.left + fromItem.offsetLeft()
    let top = window.scrollY + containerElOffset.top + fromItem.offsetTop()
    setTimeout(() => {
      updateStyle({
        ...baseStyle,
        left: `${left}px`,
        top: `${top}px`
      }, gridCloneEl)
    }, delayUpdateAnimationTime)
  } else if (isResizing) {
    setTimeout(() => {
      updateStyle({
        ...baseStyle,
        left: `${fromItem.offsetLeft()}px`,
        top: `${fromItem.offsetTop()}px`
      }, gridCloneEl)
    })
  }

  function removeCloneEl() {
    if (!fromItem) return
    try {    // 拖拽
      gridCloneEl.parentNode.removeChild(gridCloneEl)
    } catch (e) {
    }
    fromItem.element.classList.remove(grid_dragging_source_el, grid_resizing_source_el)
    clearTimeout(timer)
    timer = null
  }

  timer = setTimeout(removeCloneEl, backTime + delayUpdateAnimationTime)
}
