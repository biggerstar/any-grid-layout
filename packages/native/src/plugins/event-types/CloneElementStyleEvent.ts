import {BaseEvent} from "@/plugins";
import {tempStore} from "@/global";
import {throttle, updateStyle} from "@/utils";
import {
  grid_clone_el,
  grid_dragging_clone_el,
  grid_dragging_source_el,
  grid_resizing_clone_el,
  grid_resizing_source_el
} from "@/constant";

let ticking = false

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
  if (finallyRemoveEls.length) return;
  const sourceEl = fromItem.element
  const newNode = <HTMLElement>sourceEl.cloneNode(true)
  newNode.classList.add(grid_clone_el, grid_dragging_clone_el)
  newNode.classList.remove(grid_dragging_source_el)
  fromItem.element.classList.add(grid_dragging_source_el)
  const {left, top} = sourceEl.getBoundingClientRect()
  updateStyle({
    pointerEvents: 'none',   // 指定克隆元素永远不会成为ev.target值
    transitionProperty: 'none',
    transitionDuration: 'none',
    left: `${window.scrollX + left}px`,
    top: `${window.scrollY + top}px`
  }, newNode)
  tempStore.cloneElement = newNode
  document.body.appendChild(newNode)    // 直接添加到body中后面定位省心省力
// 这里使用newNode.offsetHeight无法获得正确宽高，只能使用rect
  const {width, height} = newNode.getBoundingClientRect()
  tempStore.cloneElScaleMultipleX = width / fromItem.nowWidth()
  tempStore.cloneElScaleMultipleY = height / fromItem.nowHeight()
}, 300)

/**
 * 用于更新克隆元素的样式和大小
 * */
export class CloneElementStyleEvent extends BaseEvent {
  /**
   * 自动创建当前行为 (drag, resize) 可用的克隆元素
   * */
  public autoCreateCloneElement() {
    createDraggingClonePosition()
    createResizingCloneElSize()
  }

  /**
   * 将克隆元素修改成符合目标container的item大小
   * */
  public syncCloneSize() {
    const {
      cloneElement,
      fromItem,
      fromContainer,
      toContainer,
      isDragging,
      cloneElScaleMultipleX = 1,
      cloneElScaleMultipleY = 1
    } = tempStore
    if (!cloneElement || !isDragging || !fromItem || !toContainer || !fromContainer) return
    const item = toContainer.items[0]  // 随便选一个item只为了计算nowWidth，nowHeight
    if (!item) return
    const nextWidth = parseInt(item.nowWidth(fromItem.pos.w) * cloneElScaleMultipleX + '')
    const nextHeight = parseInt(item.nowHeight(fromItem.pos.h) * cloneElScaleMultipleY + '')
    const {clientWidth, clientHeight} = cloneElement
    if (clientWidth === nextWidth && clientHeight === nextHeight) return  // 如果大小没被改变则忽略
    updateStyle({
      width: `${nextWidth}px`,
      height: `${nextHeight}px`,
      transitionDuration: '150ms',
      transitionProperty: 'width,height',
    }, cloneElement)
  }

  /**
   * 自动更新当前拖动所在合适的位置
   * */
  public updatePosition() {
    const {
      cloneElement,
      isDragging,
      mousedownItemOffsetLeft,
      mousedownItemOffsetTop,
      mousemoveEvent
    } = tempStore
    if (!isDragging) return

    function updateDragConeElementLocation() {
      if (!cloneElement || !mousemoveEvent) return
      let left = mousemoveEvent.pageX - mousedownItemOffsetLeft
      let top = mousemoveEvent.pageY - mousedownItemOffsetTop
      updateStyle({
        left: `${left}px`,
        top: `${top}px`
      }, <HTMLElement>cloneElement)
    }

    if (!ticking) {
      requestAnimationFrame(() => {
        updateDragConeElementLocation()
        ticking = false
      })
      ticking = true
    }
  }
}
