import {tempStore} from "@/store";
import {Container} from "@/main";
import {parseContainer} from "@/utils";

/**
 * 鼠标点击判断意图是否是拖动
 * */
export function autoScrollPage_mousedown(ev) {
  const {fromItem} = tempStore
  const container: Container = parseContainer(ev)
  if (!container) return
  if ((!fromItem || fromItem.container !== container) && !ev.touches) {
    tempStore.slidePageOffsetInfo = {
      offsetTop: container.element.scrollTop,
      offsetLeft: container.element.scrollLeft,
      newestPageX: 0,
      newestPageY: 0,
    }
    tempStore.handleMethod = 'autoScrollPage'
  }
}

