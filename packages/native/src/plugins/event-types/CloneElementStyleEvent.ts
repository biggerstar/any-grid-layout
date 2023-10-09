import {BaseEvent} from "@/plugins";
import {tempStore} from "@/global";
import {canExchange, getClientRect, getContainerConfigs, throttle, updateStyle} from "@/utils";
import {
  grid_clone_el,
  grid_dragging_clone_el,
  grid_dragging_source_el,
  grid_resizing_clone_el,
  grid_resizing_source_el
} from "@/constant";
import {SingleThrottle} from "@/utils/SingleThrottle";

/**
 * [resizing] 创建resize的克隆元素
 * 如果已存在，不会重复创建
 * */
const createResizingCloneElSize: Function = throttle(() => {
  const {
    mousedownEvent,
    fromItem,
    isResizing,
    cloneElement,
    fromContainer,
  } = tempStore
  if (cloneElement || !mousedownEvent || !fromContainer || !fromItem || !isResizing) return
  const finallyRemoveEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
  finallyRemoveEls.forEach(node => node.remove())   // 防止高频点击

  const newNode = <HTMLElement>fromItem.element.cloneNode(true)
  newNode.classList.add(grid_clone_el, grid_resizing_clone_el)
  newNode.classList.remove(grid_resizing_source_el)
  fromItem.element.classList.add(grid_resizing_source_el)
  updateStyle({
    transition: 'none',
    pointerEvents: 'none'
  }, newNode)
  tempStore.cloneElement = newNode
  fromContainer.contentElement.appendChild(newNode)
}, 300)

/**
 * [dragging]创建drag的克隆元素
 * 如果已存在，不会重复创建
 * */
const createDraggingClonePosition: Function = throttle(() => {
  const {
    mousedownEvent,
    fromItem,
    isDragging,
    cloneElement,
    isLeftMousedown,
  } = tempStore
  if (!mousedownEvent || !fromItem || !isDragging || !isLeftMousedown) return
  if (cloneElement) return
  const finallyRemoveEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
  finallyRemoveEls.forEach(node => node.remove())   // 防止高频点击

  const sourceEl = fromItem.element
  const newNode = <HTMLElement>sourceEl.cloneNode(true)
  newNode.classList.add(grid_clone_el, grid_dragging_clone_el)
  newNode.classList.remove(grid_dragging_source_el)
  fromItem.element.classList.add(grid_dragging_source_el)
  const {left, top} = getClientRect(sourceEl)
  updateStyle({
    pointerEvents: 'none',   // 指定克隆元素不会触发事件成为ev.target值
    transitionProperty: 'none',
    transitionDuration: 'none',
    left: `${window.scrollX + left}px`,
    top: `${window.scrollY + top}px`
  }, newNode)
  tempStore.cloneElement = newNode
  document.body.appendChild(newNode)    // 直接添加到body中后面定位省心省力
// 这里使用newNode.offsetHeight无法获得正确宽高，只能使用rect
  const {width, height} = getClientRect(newNode)
  tempStore.cloneElScaleMultipleX = width / fromItem.nowWidth()
  tempStore.cloneElScaleMultipleY = height / fromItem.nowHeight()
}, 300)


/**
 * 真实更新克隆元素尺寸和位置的函数，使用raf后无需节流，120帧下很丝滑
 * */
const _updateLocation: Function = () => {
  let {
    fromItem,
    fromContainer,
    toContainer,
    isDragging,
    mousemoveEvent,
    cloneElement,
    cloneElScaleMultipleX = 1,
    cloneElScaleMultipleY = 1,
    mousedownItemOffsetLeftProportion,
    mousedownItemOffsetTopProportion,
    mousedownItemWidth,
    mousedownItemHeight,
    lastOffsetM_left: offsetM_left,
    lastOffsetM_Top: offsetM_top,
  } = tempStore
  if (!isDragging || !fromItem || !fromContainer || !cloneElement || !mousemoveEvent) return
  let nextWidth, nextHeight
  const targetContainer = toContainer || fromContainer
  const exchange = canExchange()
  const {adaption, keepBaseSize} = getContainerConfigs(targetContainer, 'cloneElement')

  nextWidth = parseInt(targetContainer.nowWidth(fromItem.pos.w) * cloneElScaleMultipleX + '')
  nextHeight = parseInt(targetContainer.nowHeight(fromItem.pos.h) * cloneElScaleMultipleY + '')
  const allowChange = adaption && exchange && toContainer!.parentItem !== fromItem
  let isKeepOffset
  let sizeStyle = {}
  if (allowChange) {  // 不允许交换
    isKeepOffset = !adaption || !exchange || toContainer === fromItem.container || !toContainer // 如果移出container，恢复源容器item尺寸
  } else {   // 允许交换
    isKeepOffset = true
  }
  // console.log(
  //   'allowChange', allowChange,
  //   'isKeepOffset', isKeepOffset,
  //   'keepBaseSize', keepBaseSize,
  //   'adaption', adaption,
  // )

  function reset() {
    offsetM_left = mousedownItemWidth * cloneElScaleMultipleX * mousedownItemOffsetLeftProportion
    offsetM_top = mousedownItemHeight * cloneElScaleMultipleY * mousedownItemOffsetTopProportion
    const width = keepBaseSize || isKeepOffset ? mousedownItemWidth : fromItem!.nowWidth()
    const height = keepBaseSize || isKeepOffset ? mousedownItemHeight : fromItem!.nowHeight()
    sizeStyle = {
      width: `${width * cloneElScaleMultipleX}px`,
      height: `${height * cloneElScaleMultipleY}px`,
    }
  }

  function change() {
    offsetM_left = nextWidth * mousedownItemOffsetLeftProportion
    offsetM_top = nextHeight * mousedownItemOffsetTopProportion
    sizeStyle = {
      width: `${nextWidth}px`,
      height: `${nextHeight}px`,
      transitionDuration: '150ms',
      transitionProperty: 'width,height',
    }
    if (!keepBaseSize) {
      tempStore.mousedownItemWidth = fromItem!.nowWidth()
      tempStore.mousedownItemHeight = fromItem!.nowHeight()
    }
  }

  function setNewOffsetInfo() {
    tempStore.lastOffsetM_left = offsetM_left
    tempStore.lastOffsetM_Top = offsetM_top
  }

  if (!offsetM_left || !offsetM_top) {
    offsetM_left = mousedownItemWidth * cloneElScaleMultipleX * mousedownItemOffsetLeftProportion
    offsetM_top = mousedownItemHeight * cloneElScaleMultipleY * mousedownItemOffsetTopProportion
    setNewOffsetInfo()
  }

  throttleChangeCloneSize.do(() => {
    if (allowChange) {
      change()
    } else if (isKeepOffset) {
      reset()
    }
    setNewOffsetInfo()
  })

  let left = mousemoveEvent.pageX - offsetM_left
  let top = mousemoveEvent.pageY - offsetM_top
  updateStyle({
    left: `${left}px`,
    top: `${top}px`,
    ...sizeStyle
  }, cloneElement)
}

const throttleChangeCloneSize = new SingleThrottle(180)

/**
 * 用于更新克隆元素的样式和大小
 * */
export class CloneElementStyleEvent extends BaseEvent {
  /**
   * 自动创建当前行为 (drag, resize) 可用的克隆元素
   * 若已经存在不会重复创建
   * */
  public autoCreateCloneElement() {
    if (tempStore.cloneElement) return
    createDraggingClonePosition()
    createResizingCloneElSize()
  }

  /**
   * 自动更新当前拖动所在合适的位置,更新克隆元素尺寸和位置的函数
   * */
  public updateLocation() {
    _updateLocation()
  }
}
