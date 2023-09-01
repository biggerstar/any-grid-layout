import {Container, Item} from "@/main";
import {parseContainer, parseItem} from "@/utils";
import {tempStore} from "@/events";

/**
 * 鼠标点击判断意图是否是拖动
 * */
export function itemDrag_mousedown(ev) {
  const {isDragging, isResizing, handleMethod} = tempStore
  if (isDragging || isResizing) return  // 修复可能鼠标左键按住ItemAA，鼠标右键再次点击触发ItemB造成dragItem不一致问题
  const container: Container | null = parseContainer(ev)
  if (!container) return   // 只有点击Container或里面元素才生效
  const fromItem: Item = tempStore.fromItem = <Item>parseItem(ev)
  if (!container || !fromItem) return
  if (!fromItem.draggable || fromItem.static) return  // 如果pos中是要求static则取消该Item的drag
  if (fromItem.__temp__.dragging) return
  if (handleMethod) return   // 如果已经是其他操作则退出
  //------------------------------------------------------------------------------------------
  tempStore.handleMethod = 'drag'
  tempStore.fromContainer = fromItem?.container || container  // 必要，表明Item来源
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
    fromItem.__temp__.clientWidth = fromItem.nowWidth()
    fromItem.__temp__.clientHeight = fromItem.nowHeight()
    tempStore.offsetPageX = fromItem.offsetLeft()
    tempStore.offsetPageY = fromItem.offsetTop()
  }
//----------------------------------------------------------------//
}
