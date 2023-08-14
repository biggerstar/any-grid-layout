import {Container} from "@/main";
import {parseContainer} from "@/utils";
import {tempStore} from "@/store";
import {updateSlidePageInfo} from "@/events";

export function slidePage(ev) {
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
  updateSlidePageInfo(ev.pageX, ev.pageY)
}
