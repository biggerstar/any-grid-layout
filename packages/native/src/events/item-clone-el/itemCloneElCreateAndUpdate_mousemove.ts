import {tempStore} from "@/store";
import {Container} from "@/main";
import {parseContainer, Sync, throttle} from "@/utils";

/**
 * 鼠标开始移动后创建一个克隆可实时拖动的元素
 * 鼠标移动过程中实时更新当前克隆元素的位置
 * */
export const itemCloneElCreateAndUpdate_mousemove: Function = throttle((ev) => {
  const {
    mousedownEvent,
    fromItem,
    moveItem,
    isDragging,
    cloneElement,
    mousedownItemOffsetLeft,
    mousedownItemOffsetTop,
  } = tempStore
  if (!mousedownEvent || !fromItem || !isDragging) return
  let dragItem = moveItem || fromItem
  const container: Container = parseContainer(ev)
  dragItem.__temp__.dragging = true
  if (!cloneElement) {
    const newNode = <HTMLElement>dragItem.element.cloneNode(true)
    tempStore.cloneElement = newNode
    newNode.classList.add('grid-clone-el', 'grid-dragging-clone-el')
    document.body.appendChild(newNode)    // 直接添加到body中后面定位省心省力
    dragItem.domImpl.addClass('grid-dragging-source-el')
    dragItem.domImpl.updateStyle({
      pointerEvents: 'none',
      transitionProperty: 'none',
      transitionDuration: 'none',
    }, newNode)
  } else {
    if (container && container.__ownTemp__.firstEnterUnLock) {
      Sync.run({
        func: () => {
          // 交换进入新容器时重新给Item样式
          const newExchangeItem = fromItem
          const className = 'grid-dragging-source-el'
          if (!newExchangeItem.domImpl.hasClass(className)) {
            newExchangeItem.domImpl.addClass(className)
          }
        },
        rule: () => container === fromItem?.container,
        intervalTime: 2,
        timeout: 200
      })
    }
  }
  let left = ev.pageX - mousedownItemOffsetLeft
  let top = ev.pageY - mousedownItemOffsetTop

  if (!dragItem.dragOut) {   // 限制是否允许拖动到容器之外
    const containerElOffset = container.contentElement.getBoundingClientRect()
    const limitLeft = window.scrollX + containerElOffset.left
    const limitTop = window.scrollY + containerElOffset.top
    const limitRight = window.scrollX + containerElOffset.left + container.contentElement.clientWidth - dragItem.nowWidth()
    const limitBottom = window.scrollY + containerElOffset.top + container.contentElement.clientHeight - dragItem.nowHeight()
    if (left < limitLeft) left = limitLeft
    if (left > limitRight) left = limitRight
    if (top < limitTop) top = limitTop
    if (top > limitBottom) top = limitBottom
    // console.log(containerElOffset,left,top);
  }
  dragItem.domImpl.updateStyle({
    left: left + 'px',
    top: top + 'px',
  }, tempStore.cloneElement)  // 必须重新从tempStore获取当前克隆节点
}, 15)
