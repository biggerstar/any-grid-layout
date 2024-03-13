import {
  definePlugin,
  getClientRect,
  tempStore,
  updateStyle,
  throttle,
  SingleThrottle,
  getContainerConfigs
} from "@biggerstar/layout";


const grid_clone_el = 'grid-clone-el'
/**
 * 判断当前操作行为是否允许跨容器移动
 * */
export function canExchange() {
  const {fromContainer, fromItem, toContainer} = tempStore;
  if (!fromContainer || !fromItem || !toContainer) {
    return false
  }
  return fromItem.exchange                      /* 要求item和容器都允许交换才能继续 */
    && toContainer.getConfig('exchange')
    && fromContainer.getConfig('exchange')
}
/**
 * [resizing] 创建resize的克隆元素
 * 如果已存在，不会重复创建
 * */
const createResizingCloneElSize: Function = throttle(() => {
  const {
    mousedownEvent,
    fromItem,
    cloneElement,
    fromContainer,
  } = tempStore
  if (cloneElement || !mousedownEvent || !fromContainer || !fromItem) {
    return
  }
  const finallyRemoveEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
  finallyRemoveEls.forEach(node => node.remove())   // 防止高频点击

  const newNode = <HTMLElement>fromItem.element.cloneNode(true)
  // newNode.classList.add(grid_clone_el, grid_resizing_clone_el)
  // newNode.classList.remove(grid_resizing_source_el)
  // fromItem.element.classList.add(grid_resizing_source_el)
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
    cloneElement,
    isLeftMousedown,
  } = tempStore
  if (!mousedownEvent || !fromItem || !isLeftMousedown) {
    return
  }
  if (cloneElement) {
    return
  }
  const finallyRemoveEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
  finallyRemoveEls.forEach(node => node.remove())   // 防止高频点击

  const sourceEl = fromItem.element
  const newNode = <HTMLElement>sourceEl.cloneNode(true)
  // newNode.classList.add(grid_clone_el, grid_dragging_clone_el)
  // newNode.classList.remove(grid_dragging_source_el)
  // fromItem.element.classList.add(grid_dragging_source_el)
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
  if (!fromItem || !fromContainer || !cloneElement || !mousemoveEvent) {
    return
  }
  let nextWidth: number, nextHeight: number
  const targetContainer = toContainer || fromContainer
  const exchange = canExchange()
  const {adaption, keepBaseSize} = getContainerConfigs(targetContainer, 'cloneElement')
  if (cloneElScaleMultipleX && cloneElScaleMultipleY) {
    nextWidth = parseInt(targetContainer.nowWidth(fromItem.pos.w) * cloneElScaleMultipleX + '')
    nextHeight = parseInt(targetContainer.nowHeight(fromItem.pos.h) * cloneElScaleMultipleY + '')
  }
  const allowChange = adaption && exchange && toContainer!.parentItem !== fromItem
  let isKeepOffset: boolean
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
    if (
      !mousedownItemWidth
      || !cloneElScaleMultipleX
      || !mousedownItemOffsetLeftProportion
      || !mousedownItemHeight
      || !cloneElScaleMultipleY
      || !mousedownItemOffsetTopProportion
    ) {
      return
    }
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
    if (!mousedownItemOffsetLeftProportion || !mousedownItemOffsetTopProportion) {
      return
    }
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

  if (
    !mousedownItemWidth
    || !cloneElScaleMultipleX
    || !mousedownItemOffsetLeftProportion
    || !mousedownItemHeight
    || !cloneElScaleMultipleY
    || !mousedownItemOffsetTopProportion
  ) {
    return
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

export default function createShadowElementPlugin() {
  return definePlugin({
    name: 'ShadowElementPlugin',
    mousedown(_) {

    },
    mousemove(_) {
      if (!tempStore.cloneElement) {
        /*
         * 自动创建当前行为 (drag, resize) 可用的克隆元素
         * 若已经存在不会重复创建
         * */
        createDraggingClonePosition()
        createResizingCloneElSize()
      }
      /*
       * 自动更新当前拖动所在合适的位置,更新克隆元素尺寸和位置的函数
       * */
      _updateLocation()
    },
    mouseup(_) {
      const gridCloneEls = document.querySelectorAll<HTMLElement>(`.${grid_clone_el}`)
      //------------------进行拖动归位延时动画执行 和 执行完毕后移除克隆元素--------------------//
      //   动画的执行方案来自拖拽指定的Item中transition信息(和Item间交换共用规则)，包括time和field设置都能改变这边回流动画的方式和规则
      if (gridCloneEls.length > 0) {
        const allCloneEls = Array.from(gridCloneEls)
        const lastCloneElement = allCloneEls.pop()
        allCloneEls.forEach((el: HTMLElement) => el.parentNode.removeChild(el))
        delayRemoveCloneEl(lastCloneElement)
      }

      function delayRemoveCloneEl(gridCloneEl: HTMLElement) {
        const {fromItem} = tempStore
        const isDragging = true
        //----------移除Drag或者Resize创建的克隆备份-------------//
        //  清除对Item拖动或者调整大小产生的克隆对象
        let timer = null
        const backTime = 180
        const delayUpdateAnimationTime = 60
        if (!fromItem) {
          gridCloneEl.parentNode.removeChild(gridCloneEl)
          return
        }
        const containerElOffset = getClientRect(fromItem.container.contentElement)
        const baseStyle: Partial<CSSStyleDeclaration> = {
          transitionProperty: `top, left, width, height`,
          transitionDuration: `${backTime}ms`,
          width: `${fromItem.nowWidth()}px`,
          height: `${fromItem.nowHeight()}px`,
        }
        if (isDragging) {
          let left = window.scrollX + containerElOffset.left + fromItem.offsetLeft()
          let top = window.scrollY + containerElOffset.top + fromItem.offsetTop()
          setTimeout(() => {
            updateStyle({
              ...baseStyle,
              left: `${left}px`,
              top: `${top}px`
            }, gridCloneEl)
          }, delayUpdateAnimationTime)
        } else {
          setTimeout(() => {
            updateStyle({
              ...baseStyle,
              left: `${fromItem.offsetLeft()}px`,
              top: `${fromItem.offsetTop()}px`
            }, gridCloneEl)
          })
        }

        function removeCloneEl() {
          if (!fromItem) {
            return
          }
          try {    // 拖拽
            gridCloneEl.parentNode.removeChild(gridCloneEl)
          } catch (e) {
          }
          // fromItem.element.classList.remove(grid_dragging_source_el, grid_resizing_source_el)
          clearTimeout(timer)
          timer = null
        }

        timer = setTimeout(removeCloneEl, backTime + delayUpdateAnimationTime)
      }
    }
  })
}

