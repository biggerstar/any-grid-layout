import {parseContainer, throttle} from "@/utils";
import {Container} from "@/main";
import {tempStore} from "@/store";

export const otherEvent = {
  updateSlidePageInfo: throttle((pageX, pageY) => {
    tempStore.slidePageOffsetInfo.newestPageX = pageX
    tempStore.slidePageOffsetInfo.newestPageY = pageY
    // console.log(1111111111111);
  }),
  slidePage: (ev) => {
    // 拖拽滑动整个容器元素
    const container: Container = parseContainer(ev)
    if (!container) return
    if (!container.getConfig('slidePage')) return
    const element = container.element
    let offsetX = ev.pageX - tempStore.mousedownEvent.pageX
    let offsetY = ev.pageY - tempStore.mousedownEvent.pageY
    const offsetLeft = tempStore.slidePageOffsetInfo.offsetLeft - offsetX
    const offsetTop = tempStore.slidePageOffsetInfo.offsetTop - offsetY
    if (offsetLeft >= 0) element.scrollLeft = offsetLeft
    if (offsetTop >= 0) element.scrollTop = offsetTop
    otherEvent.updateSlidePageInfo(ev.pageX, ev.pageY)
  }
}
