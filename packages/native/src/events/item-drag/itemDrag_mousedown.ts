import {tempStore} from "@/store";
import {Container, Item} from "@/main";
import {parseContainer, parseItem} from "@/utils";
import {check, cursor} from "@/events";

/**
 * 鼠标点击判断操作意图
 * 可能是 slidePage | close | drag | resize
 * 并保存一些相关信息到全局store中以便后面操作
 * */
export function itemDrag_mousedown(ev) {
  const {isDragging, isResizing, dragOrResize} = tempStore
  if (isDragging || isResizing) return  // 修复可能鼠标左键按住ItemAA，鼠标右键再次点击触发ItemB造成dragItem不一致问题
  const container: Container = parseContainer(ev)
  if (!container) return   // 只有点击Container或里面元素才生效
  const fromItem: Item = tempStore.fromItem = <Item>parseItem(ev)
  if (!container && !fromItem) return

  if ((fromItem && fromItem.container === container)
    && !fromItem.static) cursor.mousedown()
  else if (container && (!fromItem
    || fromItem.container !== container) && !ev.touches) {
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
    if (fromItem) fromItem.__temp__.resizeLock = true
  } else if ((fromItem && dragOrResize !== 'slidePage')
    || (fromItem && fromItem.draggable)) {    //  用于drag
    if (fromItem.static) return  // 如果pos中是要求static则取消该Item的drag
    if ((fromItem.dragIgnoreEls || []).length > 0) {    // 拖拽触发元素的黑名单
      let isAllowDrag = true
      for (let i = 0; i < fromItem.dragIgnoreEls.length; i++) {
        const cssOrEl = fromItem.dragIgnoreEls[i]
        if (cssOrEl instanceof Element) {
          if (ev.target === cssOrEl) isAllowDrag = false
        } else {
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
        } else {
          const queryList = fromItem.element.querySelectorAll(cssOrEl)
          Array.from(queryList).forEach(node => {
            if (ev.path.includes(node)) isAllowDrag = true
          })
        }
      }
      if (!isAllowDrag) return
    }
    tempStore.dragOrResize = 'drag'
    if (fromItem.__temp__.dragging) return
    const fromEl = fromItem.element.getBoundingClientRect()
    tempStore.mousedownItemOffsetLeft = ev.pageX - (fromEl.left + window.scrollX)
    tempStore.mousedownItemOffsetTop = ev.pageY - (fromEl.top + window.scrollY)
  }
//----------------------------------------------------------------//
  tempStore.isLeftMousedown = true
  tempStore.mousedownEvent = ev
  tempStore.fromContainer = fromItem?.container || container  // 必要，表明Item来源
  check.resizeOrDrag(ev)

  if (tempStore.fromItem) {
    fromItem.__temp__.clientWidth = fromItem.nowWidth()
    fromItem.__temp__.clientHeight = fromItem.nowHeight()
    tempStore.offsetPageX = fromItem.offsetLeft()
    tempStore.offsetPageY = fromItem.offsetTop()
  }
//----------------------------------------------------------------//
}
