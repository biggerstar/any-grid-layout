import {Container, Item} from "@/main";
import {parseContainer, parseItem} from "@/utils";
import {tempStore} from "@/store";
import {cursor, itemResizeMouseup} from "@/events";
import {ItemTransitionObject} from "@/types";

export function itemDragMouseup(ev) {
  const container: Container = parseContainer(ev)
  if (tempStore.isResizing) itemResizeMouseup(ev)
  // if (tempStore.isDragging) EEF.itemDrag.mouseup(ev)

  if (container && cursor.cursor !== 'in-container') cursor.inContainer()
  const fromItem: Item = tempStore.fromItem
  const dragItem: Item = tempStore.moveItem ? tempStore.moveItem : tempStore.fromItem

  //----------移除Drag或者Resize创建的克隆备份-------------//
  if (tempStore.cloneElement !== null) {   //  清除对Item拖动或者调整大小产生的克隆对象
    let timer = null
    const gridCloneEls = document.querySelectorAll<HTMLElement>('.grid-clone-el')
    //------------------进行拖动归位延时动画执行和执行完毕后移除克隆元素--------------------//
    //   动画的执行方案来自拖拽指定的Item中transition信息(和Item间交换共用规则)，包括time和field设置都能改变这边回流动画的方式和规则
    for (let i = 0; i < gridCloneEls.length; i++) {
      const gridCloneEl = gridCloneEls[i]
      if (dragItem.transition) {
        const transition = <ItemTransitionObject>dragItem.transition
        const containerElOffset = dragItem.container.contentElement.getBoundingClientRect()
        if (tempStore.isDragging) {
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
        } else if (tempStore.isResizing) {
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

      if (dragItem.transition) {
        timer = setTimeout(removeCloneEl, (dragItem.transition as ItemTransitionObject).time)
      } else removeCloneEl()
    }
  }
  //  清除Item限制操作的遮罩层
  const maskList = document.querySelectorAll('.grid-item-mask')
  for (let i = 0; i < maskList.length; i++) {
    const maskEl = maskList[i]
    maskEl.parentElement.removeChild(maskEl)
  }

  //-------------------------更新映射最新的位置到Items---------------------------//
  if (container || fromItem && fromItem.container.getConfig('responsive')) (container || fromItem.container).engine.sortResponsiveItem()


  //--------------------------点击关闭按钮-----------------------------//
  const downTagClassName = tempStore.mouseDownElClassName
  if (downTagClassName && downTagClassName.includes('grid-item-close-btn')) {
    const target = ev.touchTarget ? ev.touchTarget : ev.target
    if (target.classList.contains('grid-item-close-btn')) {
      const evItem = parseItem(ev)
      if (evItem === tempStore.fromItem) {
        const isClose = evItem.container.eventManager._callback_('itemClosing', evItem)
        if (!(isClose === null || isClose === false)) {
          evItem.remove(true)
          evItem.container.engine.updateLayout(true)
          evItem.container.eventManager._callback_('itemClosed', evItem)
        }
      }
    }
  }

  //--------------------------------------------------------------------------//
  const dragFromContainer = tempStore.moveContainer ? tempStore.moveContainer : tempStore.fromContainer
  if (dragFromContainer) {
    dragFromContainer.__ownTemp__.firstEnterUnLock = false  // 当前已经进入的Container鼠标在里面抬起
    dragFromContainer.__ownTemp__.exchangeLock = false
    dragFromContainer.__ownTemp__.beforeOverItems = []
    dragFromContainer.__ownTemp__.moveCount = 0
    if (tempStore.fromContainer && dragFromContainer !== tempStore.fromContainer) {
      tempStore.fromContainer.__ownTemp__.firstEnterUnLock = false
    }
  }

  //-------------------------更新所有相关操作的容器布局---------------------------//
  if (fromItem) {
    fromItem.container.engine.updateLayout(true)
    // resize下操作有包含内嵌容器的外部Item
    const resizeIncludeNestedContainer = fromItem.container
    const childContainers = resizeIncludeNestedContainer.childContainer
    childContainers.forEach((info) => {
      if (info['nestingItem'] === fromItem) {
        info['container'].engine.updateLayout(true)   // 更新内部内嵌的Item
      }
    })
  }
  if (fromItem && dragItem.container !== fromItem.container) {
    dragItem?.container.engine.updateLayout(true)
  }
  //-----------------------------------事件---------------------------------//

  if (dragItem) {
    if (tempStore.isDragging) {
      dragItem.container.eventManager._callback_('itemMoved', dragItem.pos.x, dragItem.pos.y, dragItem)
    }
    if (tempStore.isResizing) {
      dragItem.container.eventManager._callback_('itemResized', dragItem.pos.w, dragItem.pos.h, dragItem)
    }
  }

  if (tempStore.isLeftMousedown) {
    if (tempStore.dragOrResize === 'slidePage') {
      const sPFI = tempStore.slidePageOffsetInfo
      const offsetLeft = sPFI.newestPageX - ev.pageX
      const offsetTop = sPFI.newestPageY - ev.pageY
      // 实现container在鼠标释放之后惯性滑动
      let timeCont = 500
      const container: Container = tempStore.fromContainer
      if (container.getConfig('slidePage') && (offsetTop >= 20 || offsetLeft >= 20)) {
        let timer: any = setInterval(() => {
          timeCont -= 20
          container.element.scrollTop += parseInt((((offsetTop / 100 * timeCont) / 30) || 0).toString())
          container.element.scrollLeft += parseInt((((offsetLeft / 100 * timeCont) / 30) || 0).toString())
          if (timeCont <= 0 || tempStore.isLeftMousedown) {
            clearInterval(timer)
            timer = null
          }
        }, 20)
      }
    }
  }


  //-------------------------------重置相关缓存-------------------------------//
  if (tempStore.fromItem) tempStore.fromItem.__temp__.resizeLock = false
  tempStore.fromContainer = null
  tempStore.moveContainer = null
  tempStore.dragContainer = null
  tempStore.beforeContainerArea = null
  tempStore.currentContainerArea = null
  tempStore.cloneElement = null
  tempStore.fromItem = null
  tempStore.toItem = null
  tempStore.moveItem = null
  tempStore.offsetPageX = null
  tempStore.offsetPageY = null
  tempStore.isDragging = false
  tempStore.isResizing = false
  tempStore.isLeftMousedown = false
  tempStore.isCoverRow = false
  tempStore.dragOrResize = null
  tempStore.mousedownEvent = null
  tempStore.mousedownItemOffsetLeft = null
  tempStore.mousedownItemOffsetTop = null
  tempStore.mouseDownElClassName = null
  tempStore.exchangeItems = {
    new: null,
    old: null
  }
}
