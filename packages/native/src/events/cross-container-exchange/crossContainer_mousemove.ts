import {throttle} from "@/utils";
import {tempStore} from "@/global";

/**
 *  判断当前移动过程中从哪个container出来或者进去了哪个container
 *  */
export const crossContainer_mousemove: Function = throttle((ev) => {
  const {
    isLeftMousedown,
    fromContainer,
    toContainer,
    fromItem,
    isDragging
  } = tempStore

  if (!isDragging || !fromItem || !isLeftMousedown || !toContainer || !fromContainer) return
  if (fromContainer === toContainer) return

  if (!fromItem.exchange   /* 要求item和容器都允许交换才能继续 */
    || !toContainer.getConfig('exchange')
    || !fromContainer.getConfig('exchange')
  ) return
  if (toContainer.parentItem === fromItem) return
  toContainer.bus.emit('exchange')  // crossTarget如果移除成功，之后在该事件移除源fromItem
}, 15)
















