import {parseContainer, parseItem, throttle} from "@/utils";
import {tempStore} from "@/events";
import {Container} from "@/main";


export const startMove_mousemove: Function = throttle((ev) => {
  const {
    fromItem,
    dragItem,
    mousedownEvent,
    isLeftMousedown,
    isDragging,
    mousedownItemOffsetLeft,
    mousedownItemOffsetTop,
    fromContainer,
  } = tempStore
  tempStore.toItem = parseItem(ev)
  tempStore.toContainer = parseContainer(ev)
  if (!isDragging || !fromItem || !dragItem || !mousedownEvent || !isLeftMousedown || !fromContainer) return
  let container: Container = dragItem.container
  //-----------------------是否符合交换环境参数检测结束-----------------------//
  // offsetDragItemX 和 offsetDragItemY 是换算跨容器触发比例，比如大Item到小Item容器换成小Item容器的拖拽触发尺寸
  const offsetDragItemX = mousedownItemOffsetLeft * (container.getConfig('size')[0] / fromContainer.getConfig('size')[0])
  const offsetDragItemY = mousedownItemOffsetTop * (container.getConfig('size')[1] / fromContainer.getConfig('size')[1])
  // console.log(offsetDragItemX,offsetDragItemY);
  const dragContainerElRect = container.contentElement.getBoundingClientRect()
  // Item距离容器的px
  const offsetLeftPx = ev.pageX - offsetDragItemX - (window.scrollX + dragContainerElRect.left)
  const offsetTopPx = ev.pageY - offsetDragItemY - (window.scrollY + dragContainerElRect.top)
  //------------------------------------------------------------------------------------------------//

  const relativeX = Math.round(offsetLeftPx / (container.getConfig('size')[0] + container.getConfig('margin')[0])) + 1
  const relativeY = Math.round(offsetTopPx / (container.getConfig('size')[1] + container.getConfig('margin')[1])) + 1
  const pxToGridLimitPosW = (x) => {
    const containerW = container.contentBoxW
    if (x + dragItem.pos.w > containerW) {  // right方向超出容器进行限制
      return containerW - dragItem.pos.w + 1
    } else {
      return x < 1 ? 1 : x   // left方向超出容器进行限制
    }
  }
  const pxToGridLimitPosH = (y) => {
    const containerH = container.contentBoxH
    if (y + dragItem.pos.h > containerH) { // bottom，同上
      return containerH - dragItem.pos.h + 1
    } else {
      return y < 1 ? 1 : y  // top，同上
    }
  }

  let nowMoveX = pxToGridLimitPosW(relativeX)
  let nowMoveY = pxToGridLimitPosH(relativeY)
  tempStore.relativeX = relativeX
  tempStore.relativeY = relativeY
  tempStore.gridX = nowMoveX
  tempStore.gridY = nowMoveY
}, 10)











