import {tempStore} from "@/store";
import {Container, Item} from "@/main";
import {parseContainer, Sync, throttle} from "@/utils";

export const mousemoveFromClone: Function = throttle((ev) => {
  //  对drag克隆元素的操作
  // ev.stopPropagation()
  const mousedownEvent = tempStore.mousedownEvent
  const fromItem: Item = tempStore.fromItem
  const moveItem: Item = tempStore.moveItem
  if (!mousedownEvent || !fromItem || !tempStore.isDragging) return
  let dragItem = tempStore.moveItem ? moveItem : fromItem
  const container: Container = parseContainer(ev)
  dragItem.__temp__.dragging = true

  if (tempStore.cloneElement === null) {
    tempStore.cloneElement = dragItem.element.cloneNode(true)
    tempStore.cloneElement.classList.add('grid-clone-el', 'grid-dragging-clone-el')
    document.body.appendChild(tempStore.cloneElement)    // 直接添加到body中后面定位省心省力
    dragItem.domImpl.addClass('grid-dragging-source-el')
    dragItem.domImpl.updateStyle({
      pointerEvents: 'none',
      transitionProperty: 'none',
      transitionDuration: 'none',
    }, tempStore.cloneElement)
  } else {
    if (container && container.__ownTemp__.firstEnterUnLock) {
      Sync.run({
        func: () => {
          // 交换进入新容器时重新给Item样式
          const newExchangeItem = tempStore.fromItem
          const className = 'grid-dragging-source-el'
          if (!newExchangeItem.hasClass(className)) {
            newExchangeItem.addClass(className)
          }
        },
        rule: () => container === tempStore.fromItem?.container,
        intervalTime: 2,
        timeout: 200
      })
    }
  }
  let left = ev.pageX - tempStore.mousedownItemOffsetLeft
  let top = ev.pageY - tempStore.mousedownItemOffsetTop

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
  }, tempStore.cloneElement)
}, 15)
