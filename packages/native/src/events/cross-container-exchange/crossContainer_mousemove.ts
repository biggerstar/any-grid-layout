import {throttle} from "@/utils";
import {tempStore,} from "@/events";

/**
 *  判断当前移动过程中从哪个container出来或者进去了哪个container
 *  */
export const crossContainer_mousemove: Function = throttle((ev) => {
  const {
    isLeftMousedown,
    fromContainer,
    toContainer,
    fromItem,
    toContainerArea,
    isDragging
  } = tempStore
  if (!isDragging ||!fromItem || !isLeftMousedown || !toContainerArea || !toContainer || !fromContainer) return
  if (fromContainer === toContainer) return
  if (!fromItem.exchange   /* 要求item和容器都允许交换才能继续 */
    || (
      !toContainer.getConfig('exchange')
      || !fromItem.container.getConfig('exchange')
      // || !toItem.container.getConfig('exchange')
    )
  ) return
  fromContainer.bus.emit('crossSource')
  toContainer.bus.emit('crossTarget')
}, 15)
