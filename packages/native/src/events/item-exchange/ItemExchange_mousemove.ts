import {parseContainer, parseItem, throttle} from "@/utils";
import {Container, Item} from "@/main";
import {tempStore} from "@/events";

/**
 * 「自身容器」Item交换和跨容器Item成员交换  TODO  重构后缺少 itemMovePositionChange itemExchange itemMoving vueItemMovePositionChange事件
 * @param {Container} container
 * @param {Function} itemPositionMethod(newItem)  执行该函数的前提是Item已经转移到当前鼠标对应的Container中，
 *                                                  itemPositionMethod函数接受一个参数newItem,
 *                                                  之后在该回调函数中可以决定该移动的Item在Items中的排序(响应式模式下)
 *                                                  静态模式下只要定义了pos后任何顺序都是不影响位置的。所以该函数主要针对响应式
 * */
export const itemExchange_mousemove: Function = throttle((ev) => {
  //  Item的交换主逻辑
  const {
    fromItem,
    moveItem,
    mousedownEvent,
    isLeftMousedown,
    isDragging,
    mousedownItemOffsetLeft,
    mousedownItemOffsetTop,
    fromContainer,
    mouseSpeed: mouseSpeedTemp,
  } = tempStore
  if (!isDragging) return
  let toItem: Item | null = parseItem(ev)
  if (toItem) tempStore.toItem = toItem
  if (!fromItem || !mousedownEvent || !isLeftMousedown || !fromContainer) return
  let dragItem: Item = moveItem || fromItem
  if (!dragItem) return
  let container: Container = dragItem.container
  let overContainer: Container | null

  //------计算鼠标的移动速度，太慢不做操作-----------//
  let startY, startX
  let now = Date.now()
  startX = ev.screenX
  startY = ev.screenY
  const mouseSpeed = () => {
    let dt = now - mouseSpeedTemp.timestamp;
    let distanceX = Math.abs(startX - mouseSpeedTemp.endX)
    let distanceY = Math.abs(startY - mouseSpeedTemp.endY)
    let distance = distanceX > distanceY ? distanceX : distanceY   //  选一个移动最多的方向
    let speed = Math.round(distance / dt * 1000);
    // console.log(dt, distance, speed);
    mouseSpeedTemp.endX = startX
    mouseSpeedTemp.endY = startY
    mouseSpeedTemp.timestamp = now;
    return {distance, speed}
  }
  //------对移动速度和距离做出限制,某个周期内移动速度太慢或距离太短忽略本次移动(only mouse event)------//
  const {distance, speed} = mouseSpeed()
  //---------------------------------------------------------------------------------------------

  if (dragItem.exchange) {  // 如果目标允许参与交换，则判断当前是否在自身容器移动，如果是阻止进入防止自身嵌套
    overContainer = parseContainer(ev)
    if (overContainer) container = overContainer // 如果开了exchange则移动将overContainer重置目标容器
    if (dragItem.container !== overContainer) {
      if (container.parentItem && container.parentItem === dragItem) return
    }
  }
  if (!container.__ownTemp__.firstEnterUnLock) {
    if (dragItem.container && overContainer
      && dragItem.container !== overContainer
      && (dragItem.container.childContainer.length > 0
        || overContainer.childContainer.length > 0)) return  // 非firstXXX标记下移出去容器外将不进行反应,此时正常是嵌套容器下发生
  }
  //-----------------------是否符合交换环境参数检测结束-----------------------//
  // offsetDragItemX 和 offsetDragItemY 是换算跨容器触发比例，比如大Item到小Item容器换成小Item容器的拖拽触发尺寸
  const offsetDragItemX = mousedownItemOffsetLeft * (container.getConfig('size')[0] / fromContainer.getConfig('size')[0])
  const offsetDragItemY = mousedownItemOffsetTop * (container.getConfig('size')[1] / fromContainer.getConfig('size')[1])
  // console.log(offsetDragItemX,offsetDragItemY);
  const dragContainerElRect = container.contentElement.getBoundingClientRect()
  // Item距离容器的px
  const offsetLeftPx = ev.pageX - offsetDragItemX - (window.scrollX + dragContainerElRect.left)
  const offsetTopPx = ev.pageY - offsetDragItemY - (window.scrollY + dragContainerElRect.top)
  // console.log(dragItem);
  //------------------------------------------------------------------------------------------------//
  const pxToGridPosW = (offsetLeftPx) => {
    const w = (offsetLeftPx) / (container.getConfig('size')[0] + container.getConfig('margin')[0])
    if (w + dragItem.pos.w >= container.containerW) {
      return container.containerW - dragItem.pos.w + 1
    } else {
      const rand = Math.round(w) + 1
      return rand <= 0 ? 1 : rand
    }
  }
  const pxToGridPosH = (offsetTopPx) => {
    const h = (offsetTopPx) / (container.getConfig('size')[1] + container.getConfig('margin')[1])
    if (h + dragItem.pos.h >= container.containerH) {
      return container.containerH - dragItem.pos.h + 1
    } else {
      const rand = Math.round(h) + 1
      return rand <= 0 ? 1 : rand
    }
  }

  let nowMoveX = pxToGridPosW(offsetLeftPx)
  let nowMoveY = pxToGridPosH(offsetTopPx)
  // console.log(nowMoveX, nowMoveY)

  container.engine.layoutManager.layout({
    dragItem,
    toItem,  /* toItem 为null则是空白处 */
    x: nowMoveX,
    y: nowMoveY,
    distance,
    speed
  }).then()
}, 32)
