import {tempStore} from "@/events";

/**
 * 鼠标点击判断意图是否是拖动
 * */
export function itemDrag_mousedown(ev) {
  const {handleMethod, fromContainer, fromItem} = tempStore
  if (handleMethod) return  // 修复可能鼠标左键按住ItemAA，鼠标右键再次点击触发ItemB造成fromItem不一致问题
  if (!fromContainer || !fromItem) return
  if (!fromItem.draggable || fromItem.static) return  // 如果pos中是要求static则取消该Item的drag
  tempStore.handleMethod = 'drag'
  //------------------------------------------------------------------------------------------
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
  const fromEl = fromItem.element.getBoundingClientRect()
  tempStore.mousedownItemOffsetLeft = ev.pageX - (fromEl.left + window.scrollX)
  tempStore.mousedownItemOffsetTop = ev.pageY - (fromEl.top + window.scrollY)
//--------------------保留未改变尺寸前原始大小------------------------//
  if (fromItem) {
    tempStore.offsetPageX = fromItem.offsetLeft()
    tempStore.offsetPageY = fromItem.offsetTop()
  }
//----------------------------------------------------------------//
}
