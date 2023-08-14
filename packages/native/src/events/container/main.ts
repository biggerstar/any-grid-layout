import {Container, Item} from "@/main";
import {
  parseContainer,
  parseContainerAreaElement,
  parseContainerFromPrototypeChain,
  parseItem,
  singleTouchToCommonEvent,
  throttle
} from "@/utils";
import {ItemTransitionObject} from "@/types";
import {tempStore} from "@/store";
import {check, cursor, prevent} from "@/events/common";
import {itemDragEvent, itemResizeEvent, moveOuterContainerEvent, otherEvent} from "@/events";

export const containerEvent = {
  mousedown: (ev) => {
    if (tempStore.isDragging || tempStore.isResizing) return  // 修复可能鼠标左键按住ItemAA，鼠标右键再次点击触发ItemB造成dragItem不一致问题
    const container: Container = parseContainer(ev)
    if (!container) return   // 只有点击Container或里面元素才生效
    tempStore.fromItem = parseItem(ev)
    if (!container && !tempStore.fromItem) return

    if ((tempStore.fromItem && tempStore?.fromItem.container === container)
      && !tempStore.fromItem.static) cursor.mousedown()
    else if (container && (!tempStore.fromItem
      || tempStore?.fromItem.container !== container) && !ev.touches) {
      cursor.mousedown()
      tempStore.slidePageOffsetInfo = {
        offsetTop: container.element.scrollTop,
        offsetLeft: container.element.scrollLeft,
        newestPageX: 0,
        newestPageY: 0,
      }
      tempStore.dragOrResize = 'slidePage'
    }
// 执行到这行container一定存在,可能点击container或者Item，Item用于操作Item，container用于拖动整个container元素
    const downTagClassName = ev.target.className
    tempStore.mouseDownElClassName = downTagClassName
    if (downTagClassName.includes('grid-clone-el')) return
    if (downTagClassName.includes('grid-item-close-btn')) return
    if (downTagClassName.includes('grid-item-resizable-handle')) {   //   用于resize
      tempStore.dragOrResize = 'resize'
      if (tempStore.fromItem) tempStore.fromItem.__temp__.resizeLock = true
    } else if ((tempStore.fromItem && tempStore.dragOrResize !== 'slidePage')
      || (tempStore.fromItem && tempStore.fromItem.draggable)) {    //  用于drag
      if (tempStore.fromItem.static) return  // 如果pos中是要求static则取消该Item的drag
      const fromItem = tempStore.fromItem
      if ((fromItem.dragIgnoreEls || []).length > 0) {    // 拖拽触发元素的黑名单
        let isAllowDrag = true
        for (let i = 0; i < fromItem.dragIgnoreEls.length; i++) {
          const cssOrEl = fromItem.dragIgnoreEls[i]
          if (cssOrEl instanceof Element) {
            if (ev.target === cssOrEl) isAllowDrag = false
          } else if (typeof cssOrEl === 'string') {
            const queryList = fromItem.element.querySelectorAll(cssOrEl)
            Array.from(queryList).forEach(node => {
              if (ev.path.includes(node)) isAllowDrag = false
            })
          }
          if (!isAllowDrag) return
        }
      }
      if ((fromItem.dragAllowEls || []).length > 0) {    // 拖拽触发元素的白名单
        let isAllowDrag = false
        for (let i = 0; i < fromItem.dragAllowEls.length; i++) {
          const cssOrEl = fromItem.dragAllowEls[i]
          if (cssOrEl instanceof Element) {
            if (ev.target === cssOrEl) {
              isAllowDrag = true
              break
            }
          } else if (typeof cssOrEl === 'string') {
            const queryList = fromItem.element.querySelectorAll(cssOrEl)
            Array.from(queryList).forEach(node => {
              if (ev.path.includes(node)) isAllowDrag = true
            })
          }
        }
        if (!isAllowDrag) return
      }
      tempStore.dragOrResize = 'drag'
      if (tempStore.fromItem.__temp__.dragging) return
      const fromEl = tempStore.fromItem.element.getBoundingClientRect()
      tempStore.mousedownItemOffsetLeft = ev.pageX - (fromEl.left + window.scrollX)
      tempStore.mousedownItemOffsetTop = ev.pageY - (fromEl.top + window.scrollY)
    }
//----------------------------------------------------------------//
    tempStore.isLeftMousedown = true
    tempStore.mousedownEvent = ev
    tempStore.fromContainer = tempStore?.fromItem?.container || container  // 必要，表明Item来源
    check.resizeOrDrag(ev)

    if (tempStore.fromItem) {
      tempStore.fromItem.__temp__.clientWidth = tempStore.fromItem.nowWidth()
      tempStore.fromItem.__temp__.clientHeight = tempStore.fromItem.nowHeight()
      tempStore.offsetPageX = tempStore.fromItem.offsetLeft()
      tempStore.offsetPageY = tempStore.fromItem.offsetTop()
    }
//----------------------------------------------------------------//
  },
  mousemove: throttle((ev) => {
    const containerArea: HTMLElement = parseContainerAreaElement(ev)
    const container: Container | null = parseContainerFromPrototypeChain(containerArea)
    const overItem = parseItem(ev)
    if (tempStore.isLeftMousedown) {
      tempStore.beforeContainerArea = tempStore.currentContainerArea
      tempStore.currentContainerArea = containerArea || null
      tempStore.beforeContainer = tempStore.currentContainer
      tempStore.currentContainer = container || null
      if (tempStore.currentContainerArea !== null && tempStore.beforeContainerArea !== null) {   // 表示进去了某个Container内
        if (tempStore.currentContainerArea !== tempStore.beforeContainerArea) {
          // 从相邻容器移动过去，旧容器 ==>  新容器
          // console.log(tempStore.beforeContainer, tempStore.currentContainer);
          moveOuterContainerEvent.leaveToEnter(tempStore.beforeContainer, tempStore.currentContainer)
        }
      } else {
        if (tempStore.currentContainerArea !== null || tempStore.beforeContainerArea !== null) {
          if (tempStore.beforeContainerArea === null) {
            // 非相邻容器中的网页其他空白元素移进来某个容器中
            moveOuterContainerEvent.mouseenter(null, tempStore.currentContainer)
          }
          if (tempStore.currentContainerArea === null) {
            moveOuterContainerEvent.mouseleave(null, tempStore.beforeContainer)
          }
        }
      }
      if (tempStore.dragOrResize === 'slidePage') {
        otherEvent.slidePage(ev)
        return
      }
      // console.log(tempStore.dragOrResize);
      const mousedownDragCursor = () => {
        // 鼠标按下状态的样式
        // console.log(container);
        // const dragItem = tempStore.moveItem || tempStore.fromItem
        if (!container) {
          if (cursor.cursor !== 'no-drop') cursor.notDrop()  // 容器外
        } else if (container) {
          if (overItem) {
            if (overItem.static) {
              if (cursor.cursor !== 'drag-to-item-no-drop') cursor.dragToItemNoDrop()
            }
          } else if (!overItem && container.getConfig('responsive')) {
            // 拖动中的样式，这里只写的响应式，静态模式拖动中的逻辑在交换算法那里
            if (cursor.cursor !== 'mousedown') cursor.mousedown()
          }
        }
      }
      if (tempStore.isDragging) {
        itemDragEvent.mousemoveFromClone(ev)   // 控制drag克隆移动
        mousedownDragCursor()
      } else if (tempStore.isResizing) {
        itemResizeEvent.doResize(ev)
      }
    } else {
      // 鼠标抬起状态的样式
      if (overItem) {
        const evClassList = ev.target.classList
        if (evClassList.contains('grid-item-close-btn')) {
          if (cursor.cursor !== 'item-close') cursor.itemClose()
        } else if (evClassList.contains('grid-item-resizable-handle')) {
          if (cursor.cursor !== 'item-resize') cursor.itemResize()
        } else if (overItem.static && container) {
          if (cursor.cursor !== 'static-no-drop') cursor.staticItemNoDrop()   // 静态模式才notDrop
        } else {
          if (cursor.cursor !== 'in-container') cursor.inContainer()
        }
      } else if (parseContainer(ev)) {
        if (cursor.cursor !== 'in-container') cursor.inContainer()
      } else if (cursor.cursor !== 'default') cursor.default()
    }
  }, 12),
  mouseup: (ev) => {
    const container: Container = parseContainer(ev)
    if (tempStore.isResizing) itemResizeEvent.mouseup(ev)
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
  },
  touchstartOrMousedown: (ev) => {
    // touch 和 drag效果是一样的
    ev = ev || window['event']
    if (ev.touches) {
      if (ev.stopPropagation) ev.stopPropagation()
      tempStore.deviceEventMode = 'touch'
      ev = singleTouchToCommonEvent(ev)
    } else tempStore.deviceEventMode = 'mouse'
    if (tempStore.deviceEventMode === 'touch') {
      tempStore.allowTouchMoveItem = false
      const container: Container = parseContainer(ev)
      document.addEventListener('contextmenu', prevent.defaultAndFalse)  // 禁止长按弹出菜单
      const pressTime = container ? container.getConfig('pressTime') : 300  // 长按多久响应拖动事件，默认360ms
      tempStore.timeOutEvent = setTimeout(() => {
        if (ev.preventDefault) ev.preventDefault()
        tempStore.allowTouchMoveItem = true
        containerEvent.mousemove(ev)   // move 触屏模式下只为了触发生成克隆元素
        let timer: any = setTimeout(() => {
          document.removeEventListener('contextmenu', prevent.defaultAndFalse)
          clearTimeout(timer)
          timer = null
        }, 600)
        clearTimeout(tempStore.timeOutEvent)
      }, pressTime)
    }
    containerEvent.mousedown(ev)
  },
  touchmoveOrMousemove: (ev) => {
    ev = ev || window['event']
    if (ev.stopPropagation) ev.stopPropagation()
    if (ev.touches) {
      tempStore.deviceEventMode = 'touch'
      if (tempStore.allowTouchMoveItem) {
        if (ev.preventDefault) ev.preventDefault()
      } else {
        clearTimeout(tempStore.timeOutEvent)
        return
      }
      ev = singleTouchToCommonEvent(ev)
    } else tempStore.deviceEventMode = 'mouse'
    // console.log(ev);
    itemDragEvent.mousemoveFromItemChange(ev)
    containerEvent.mousemove(ev)
  },
  touchendOrMouseup: (ev) => {
    ev = ev || window['event']
    if (ev.touches) {
      clearTimeout(tempStore.timeOutEvent)
      tempStore.allowTouchMoveItem = false
      tempStore.deviceEventMode = 'touch'
      ev = singleTouchToCommonEvent(ev)
      document.removeEventListener('contextmenu', prevent.contextmenu)
    } else tempStore.deviceEventMode = 'mouse'
    containerEvent.mouseup(ev)    // 根据浏览器事件特性，触屏模式下快读点击情况下mouseup和touchend都会执行该函数，所以这里会执行两次但是不影响基本功能
  }
}
