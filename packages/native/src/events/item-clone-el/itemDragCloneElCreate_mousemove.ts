import {throttle} from "@/utils";
import {tempStore} from "@/events";

/**
 * 鼠标开始移动后创建一个克隆可实时拖动的元素
 * 鼠标移动过程中实时更新当前克隆元素的位置
 * */
export const itemDragCloneElCreate_mousemove: Function = throttle(() => {
  const {
    mousedownEvent,
    fromItem,
    isDragging,
    cloneElement,
    isLeftMousedown,
  } = tempStore
  if (!mousedownEvent || !fromItem || !isDragging || !isLeftMousedown) return
  // fromItem.__temp__.dragging = true
  if (!cloneElement) {
    const finallyRemoveEls = document.querySelectorAll<HTMLElement>('.grid-clone-el')
    if (finallyRemoveEls.length) return;
    const sourceEl = fromItem.element
    const newNode = <HTMLElement>sourceEl.cloneNode(true)
    newNode.classList.add('grid-clone-el', 'grid-dragging-clone-el')
    fromItem.domImpl.addClass('grid-dragging-source-el')
    const {left, top} = sourceEl.getBoundingClientRect()
    fromItem.domImpl.updateStyle({
      pointerEvents: 'none',   // 指定克隆元素永远不会成为ev.target值
      transitionProperty: 'none',
      transitionDuration: 'none',
      left: `${left}px`,
      top: `${top}px`
    }, newNode)
    tempStore.cloneElement = newNode
    document.body.appendChild(newNode)    // 直接添加到body中后面定位省心省力
  } else {
    // const container: Container | null = parseContainer(ev)
    // if (container && container.__ownTemp__.firstEnterUnLock) {
    //   Sync.run({
    //     func: () => {
    //       // 交换进入新容器时重新给Item样式
    //       const newExchangeItem = fromItem
    //       const className = 'grid-dragging-source-el'
    //       if (!newExchangeItem.domImpl.hasClass(className)) {
    //         newExchangeItem.domImpl.addClass(className)
    //       }
    //     },
    //     rule: () => container === fromItem?.container,
    //     intervalTime: 2,
    //     timeout: 200
    //   })
    // }
  }
}, 12)
