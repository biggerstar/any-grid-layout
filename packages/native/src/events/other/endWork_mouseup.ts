import {Item} from "@/main";
import {tempStore} from "@/events";

/**
 * 做拖动结束的后续清理工作
 * */
export function endWork_mouseup(_) {
  const {
    fromItem,
    dragItem,
    isDragging,
    isResizing,
    fromContainer,
    moveContainer,
  } = tempStore

  //  清除Item限制操作的遮罩层
  const maskList = document.querySelectorAll('.grid-item-mask')
  for (let i = 0; i < maskList.length; i++) {
    const maskEl = maskList[i]
    maskEl.parentElement.removeChild(maskEl)
  }

  //--------------------------------------------------------------------------//
  const dragFromContainer = moveContainer || fromContainer
  if (dragFromContainer) {
    const _drag_ownTemp = dragFromContainer.__ownTemp__
    _drag_ownTemp.firstEnterUnLock = false  // 当前已经进入的Container鼠标在里面抬起
    _drag_ownTemp.exchangeLock = false
    _drag_ownTemp.beforeOverItems = []
    _drag_ownTemp.moveCount = 0
    if (fromContainer && dragFromContainer !== fromContainer) {
      fromContainer.__ownTemp__.firstEnterUnLock = false
    }
  }

  //-------------------------更新所有相关操作的容器布局---------------------------//
  if (fromItem) {
    fromItem.container.engine.updateLayout()
    // resize下操作有包含内嵌容器的外部Item
    // const resizeIncludeNestedContainer = fromItem.container
    // const childContainers = resizeIncludeNestedContainer.childContainer
    // childContainers.forEach((info) => {
    //   if (info['nestingItem'] === fromItem) {
    //     info['container'].engine.updateLayout()   // 更新内部内嵌的Item
    //   }
    // })
  }
  // if (fromItem && dragItem && dragItem.container !== fromItem.container) {
  //   dragItem?.container.engine.updateLayout()
  // }

  //-----------------------------------事件---------------------------------//
  if (dragItem) {
    if (isDragging) {
      dragItem.container.eventManager._callback_('itemMoved', dragItem.pos.x, dragItem.pos.y, dragItem)
    }
    if (isResizing) {
      dragItem.container.eventManager._callback_('itemResized', dragItem.pos.w, dragItem.pos.h, dragItem)
    }
  }

  //-------------------------------重置相关缓存-------------------------------//
  if (fromItem) fromItem.__temp__.resizeLock = false
  const resetKeys = [
    'fromContainer',
    'moveContainer',
    'dragContainer',
    'beforeContainerArea',
    'currentContainerArea',
    'cloneElement',
    'fromItem',
    'toItem',
    'moveItem',
    'offsetPageX',
    'offsetPageY',
    'isLeftMousedown',
    'isCoverRow',
    'handleMethod',
    'mousedownEvent',
    'mousedownItemOffsetLeft',
    'mousedownItemOffsetTop',
    'mouseDownElClassName',
    'gridX',
    'gridY',
    "relativeX",
    "relativeY",
    'mouseDownElClassName',
    'mouseDownElClassName',
  ] as (NonNullable<keyof typeof tempStore>)[]
  resetKeys.forEach((key) => delete tempStore[key])
  tempStore.exchangeItems = {
    new: null,
    old: null
  }
}
