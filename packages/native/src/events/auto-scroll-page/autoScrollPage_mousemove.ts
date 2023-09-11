import {Container} from "@/main";
import {parseContainer, throttle} from "@/utils";
import {tempStore} from "@/events";

/**
 * 拖拽到边界自动滚动container内容
 * */
export const autoScrollPage_mousemove: Function = throttle((ev) => {
  const {
    mousedownEvent,
    isScrollPage,
    isLeftMousedown,
    dragItem,
    fromItem,
    toContainer,
    scrollReactionStatic,
    slidePageOffsetInfo
  } = tempStore

  if (!isScrollPage || !fromItem || !dragItem || !mousedownEvent || !isLeftMousedown) return
  const container: Container | null = toContainer
  if (!container) return
  if (!container || !container.getConfig('autoScrollPage')) return
  //------------------------------------------------------------------------------------------------
  //------如果容器内容超出滚动条盒子在边界的时候自动滚动(上高0.25倍下高0.75倍触发，左宽0.25倍右宽0.75倍触发)-----//
  const scrollContainerBoxEl = container.contentElement.parentElement
  const scrollContainerBoxElRect = scrollContainerBoxEl.getBoundingClientRect()
  const scrollSpeedX = container.getConfig('scrollSpeedX') ? container.getConfig('scrollSpeedX') : Math.round(scrollContainerBoxElRect.width / 20)
  const scrollSpeedY = container.getConfig('scrollSpeedY') ? container.getConfig('scrollSpeedY') : Math.round(scrollContainerBoxElRect.height / 20)
  const scroll = (direction, scrollOffset) => {
    return; // TODO 设计成默认事件
    const isScroll = dragItem.container.bus.emit('autoScroll')
    if (isScroll === false || isScroll === null) return
    if (typeof isScroll === 'object') {   //按照返回的最新方向和距离进行滚动，这里类型限制不严谨，但是吧开发者自己控制不管那么多了
      if (typeof isScroll.offset === 'number') scrollOffset = isScroll.offset
      if (['X', 'Y'].includes(isScroll.direction)) direction = isScroll.direction
    }
    const scrollWaitTime = container ? container.getConfig('scrollWaitTime') : 800  // 当Item移动到容器边缘，等待多久进行自动滚动
    if (scrollReactionStatic === 'stop') {
      tempStore.scrollReactionStatic = 'wait'
      tempStore.scrollReactionTimer = setTimeout(() => {
        tempStore.scrollReactionStatic = 'scroll'
        clearTimeout(tempStore.scrollReactionTimer)
      }, scrollWaitTime)
    }
    if (direction === 'X') {
      if (tempStore.scrollReactionStatic === 'scroll') {
        container.contentElement.parentElement.scrollLeft += scrollOffset
      }
    }
    if (direction === 'Y') {
      if (tempStore.scrollReactionStatic === 'scroll') {
        container.contentElement.parentElement.scrollTop += scrollOffset
      }
    }
  }
  let isClearScrollTimerX = false, isClearScrollTimerY = false
  // 横向滚动
  if (ev.pageX - window.scrollX - scrollContainerBoxElRect.left < scrollContainerBoxElRect.width * 0.25) {
    scroll('X', -scrollSpeedX)
  } else if (ev.pageX - window.scrollX - scrollContainerBoxElRect.left > scrollContainerBoxElRect.width * 0.75) {
    scroll('X', scrollSpeedX)
  } else isClearScrollTimerX = true

  // 纵向滚动
  if (ev.pageY - window.scrollY - scrollContainerBoxElRect.top < scrollContainerBoxElRect.height * 0.25) {
    scroll('Y', -scrollSpeedY)
  } else if (ev.pageY - window.scrollY - scrollContainerBoxElRect.top > scrollContainerBoxElRect.height * 0.75) {
    scroll('Y', scrollSpeedY)
  } else isClearScrollTimerY = true
  if (isClearScrollTimerX && isClearScrollTimerY) {   // 当X和Y都不在预备滚动范围中，则可以清除定时器
    tempStore.scrollReactionStatic = 'stop'
    clearTimeout(tempStore.scrollReactionTimer)
  }

  // 拖拽滑动整个容器元素
  const element = container.element
  let offsetX = ev.pageX - mousedownEvent.pageX
  let offsetY = ev.pageY - mousedownEvent.pageY
  const offsetLeft = slidePageOffsetInfo.offsetLeft - offsetX
  const offsetTop = slidePageOffsetInfo.offsetTop - offsetY
  if (offsetLeft >= 0) element.scrollLeft = offsetLeft
  if (offsetTop >= 0) element.scrollTop = offsetTop
  slidePageOffsetInfo.newestPageX = ev.pageX
  slidePageOffsetInfo.newestPageY = ev.pageY
}, 30)
