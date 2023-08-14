import {Container} from "@/main";
import {parseContainer, throttle} from "@/utils";
import {tempStore} from "@/store";


/**
 * 拖拽到边界自动滚动container内容
 * */
export const slidePage_mousemove: Function = throttle((ev) => {
  const {mousedownEvent, dragOrResize, isLeftMousedown, slidePageOffsetInfo} = tempStore
  // 拖拽滑动整个容器元素
  if (dragOrResize !== 'slidePage' || !isLeftMousedown || !mousedownEvent) return
  const container: Container = parseContainer(ev)
  if (!container) return
  if (!container.getConfig('slidePage')) return
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
