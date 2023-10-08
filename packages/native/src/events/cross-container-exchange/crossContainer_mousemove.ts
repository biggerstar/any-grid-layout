import {tempStore} from "@/global";
import {canExchange, throttle} from "@/utils";

/**
 *  判断当前移动过程中从哪个container出来或者进去了哪个container
 *  */
export const crossContainer_mousemove: Function = throttle((_) => {
  const {
    isLeftMousedown,
    fromContainer,
    toContainer,
    fromItem,
    toItem,
    isDragging
  } = tempStore

  if (!isDragging || !fromItem || !isLeftMousedown || !toContainer || !fromContainer) return
  if (
    fromContainer === toContainer
    // 如果在同一个container中 或者 源容器是嵌套容器的时候移动到挂载源容器的item上，不进行跨容器移动
    || (toItem && fromContainer.parentItem === toItem)
    || !canExchange()
  ) return
  toContainer.bus.emit('exchangeVerification')  // crossTarget如果移除成功，之后在该事件移除源fromItem
}, 30)
