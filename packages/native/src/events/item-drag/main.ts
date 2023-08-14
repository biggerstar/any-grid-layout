import {Container, Item, ItemPos} from "@/main";
import {parseContainer, parseItem, Sync, throttle} from "@/utils";
import {tempStore} from "@/store";
import {cursor} from "@/events/common";

export const itemDragEvent = {
  /** 跨容器Item成员交换
   * @param {Container} container
   * @param {Function} itemPositionMethod(newItem)  执行该函数的前提是Item已经转移到当前鼠标对应的Container中，
   *                                                  itemPositionMethod函数接受一个参数newItem,
   *                                                  之后在该回调函数中可以决定该移动的Item在Items中的排序(响应式模式下)
   *                                                  静态模式下只要定义了pos后任何顺序都是不影响位置的。所以该函数主要针对响应式
   * */
  mousemoveExchange: (container: Container, itemPositionMethod: Function = null) => {
    const fromItem: Item = tempStore.fromItem
    const moveItem: Item = tempStore.moveItem
    if (!tempStore.isDragging || !fromItem || !container || !tempStore.isLeftMousedown) return
    const dragItem: Item = tempStore.moveItem ? moveItem : fromItem
    // console.log(container);
    // console.log(fromItem,fromItem.container.exchange,dragItem.container.exchange,dragItem.exchange);
    // TODO  exchange getConfig
    if (!dragItem.exchange   /* 要求item和容器都允许交换才能继续 */
      || (
        !container.getConfig('exchange')
        || !fromItem.container.getConfig('exchange')
        || !dragItem.container.getConfig('exchange')
      )
    ) return
    try {
      delete dragItem.pos.el
      let dragItemElement = fromItem.element
      const newItem = new Item({
        pos: dragItem.pos,
        el: dragItemElement,  //  将原本pos中的对应文档清除掉换克隆后的
        name: dragItem.name,
        type: dragItem.type,
        draggable: dragItem.draggable,
        resize: dragItem.resize,
        close: dragItem.close,
        transition: dragItem.transition,
        static: dragItem.static,
        follow: dragItem.follow,
        dragOut: dragItem.dragOut,
        resizeOut: dragItem.resizeOut,
        className: dragItem.className,
        dragIgnoreEls: dragItem.dragIgnoreEls,
        dragAllowEls: dragItem.dragAllowEls
      })
      const isExchange = fromItem.container.eventManager._callback_('crossContainerExchange', dragItem, newItem)
      if (isExchange === false || isExchange === null) return   // 通过事件返回值来判断是否继续进行交换

      const doItemPositionMethod = (newItem) => {
        //注意:必须在不同平台Exchange逻辑之后,保证Item添加进去之后再进行位置确定
        // 该函数用于修改确定Item交换之后下次布局更新的位置
        if (typeof itemPositionMethod === 'function') { // 回调拿到newItem
          itemPositionMethod(newItem)
        }
      }
      const vueExchange = () => {
        container._VueEvents['vueCrossContainerExchange'](newItem, tempStore, (newItem) => {
          dragItem.unmount()
          dragItem.remove()
          if (tempStore.deviceEventMode === 'touch' && tempStore.cloneElement) {
            // 在触屏模式下， 原本的fromItem克隆源必须保留在文档流中，所以省事临时放置在该克隆元素中，当鼠标抬起后会被自动移除
            tempStore.cloneElement.appendChild(document.adoptNode(dragItem.element))
          }
          doItemPositionMethod(newItem)
          if (container) {
            if (dragItem !== newItem && !dragItem.container.getConfig('responsive')) {
              dragItem.container.engine.updateLayout([dragItem])
            } else {
              dragItem.container.engine.updateLayout(true)
            }
          }
        })
      }
      const nativeExchange = () => {
        if (container.getConfig('responsive')) newItem.pos.autoOnce = true
        else if (!container.getConfig('responsive')) newItem.pos.autoOnce = false
        container.add(newItem)
        dragItem.unmount()  // 先成功移除原来容器中Item后再在新容器新添加Item，移除不成功不添加
        dragItem.remove()
        if (container) {
          if (!newItem.container.getConfig("responsive")) {
            newItem.container.engine.updateLayout([newItem])
          } else {
            newItem.container.engine.updateLayout(true)
          }
          if (dragItem !== newItem && !dragItem.container.getConfig('responsive')) {
            dragItem.container.engine.updateLayout([dragItem])
          } else {
            dragItem.container.engine.updateLayout(true)
          }
        }
        newItem.mount()
        // dragItem.element.style.backgroundColor = 'red'
        tempStore.moveItem = newItem
        tempStore.fromItem = newItem   // 原Item移除，将新位置作为源Item
        tempStore.exchangeItems.old = dragItem
        tempStore.exchangeItems.new = newItem
        doItemPositionMethod(newItem)
      }
      container.__ownTemp__.firstEnterUnLock = false
      container.__ownTemp__.nestingEnterBlankUnLock = false
      if (container.platform === 'vue') vueExchange()
      else nativeExchange()
    } catch (e) {
      console.error('跨容器Item移动出错', e);
    }
  },
  mousemoveFromItemChange: throttle((ev) => {
    //  Item的交换主逻辑
    ev.stopPropagation()
    if (!tempStore.isDragging) return
    let fromItem: Item = tempStore.fromItem
    let toItem: Item | null = parseItem(ev)
    if (toItem) tempStore.toItem = toItem
    const moveItem = tempStore.moveItem
    const mousedownEvent: MouseEvent = tempStore.mousedownEvent
    if (!fromItem || !mousedownEvent || !tempStore.isLeftMousedown) return
    let dragItem: Item = tempStore.moveItem ? moveItem : fromItem
    let container: Container = dragItem.container
    let overContainer: Container

    if (dragItem.exchange) {  // 如果目标允许参与交换，则判断当前是否在自身容器移动，如果是阻止进入防止自身嵌套
      overContainer = parseContainer(ev)
      if (overContainer) container = overContainer // 如果开了exchange则移动将overContainer重置目标容器
      if (dragItem.container !== overContainer) {
        if (container.parentItem && container.parentItem === dragItem) return
        // const target = ev.touchTarget ? ev.touchTarget : ev.target
        // if (!target._isGridContainerArea) return   // (该代码bug：exchange toItem无响应)跨容器只有移动到gridContainerArea才进行响应，只移动到GridContainer元素上忽略掉
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
    const offsetDragItemX = tempStore.mousedownItemOffsetLeft * (container.getConfig('size')[0] / tempStore.fromContainer.getConfig('size')[0])
    const offsetDragItemY = tempStore.mousedownItemOffsetTop * (container.getConfig('size')[1] / tempStore.fromContainer.getConfig('size')[1])
    // console.log(offsetDragItemX,offsetDragItemY);
    const dragContainerElRect = container.contentElement.getBoundingClientRect()
    // Item距离容器的px
    const offsetLeftPx = ev.pageX - offsetDragItemX - (window.scrollX + dragContainerElRect.left)
    const offsetTopPx = ev.pageY - offsetDragItemY - (window.scrollY + dragContainerElRect.top)
    // console.log(dragItem);


    //------如果容器内容超出滚动条盒子在边界的时候自动滚动(上高0.25倍下高0.75倍触发，左宽0.25倍右宽0.75倍触发)-----//
    if (dragItem.container.getConfig('followScroll')) {
      const scrollContainerBoxEl = container.contentElement.parentElement
      const scrollContainerBoxElRect = scrollContainerBoxEl.getBoundingClientRect()
      const scrollSpeedX = container.getConfig('scrollSpeedX') ? container.getConfig('scrollSpeedX') : Math.round(scrollContainerBoxElRect.width / 20)
      const scrollSpeedY = container.getConfig('scrollSpeedY') ? container.getConfig('scrollSpeedY') : Math.round(scrollContainerBoxElRect.height / 20)
      const scroll = (direction, scrollOffset) => {
        const isScroll = dragItem.container.eventManager._callback_('autoScroll', direction, scrollOffset, dragItem.container)
        if (isScroll === false || isScroll === null) return
        if (typeof isScroll === 'object') {   //按照返回的最新方向和距离进行滚动，这里类型限制不严谨，但是吧开发者自己控制不管那么多了
          if (typeof isScroll.offset === 'number') scrollOffset = isScroll.offset
          if (['X', 'Y'].includes(isScroll.direction)) direction = isScroll.direction
        }
        const scrollWaitTime = container ? container.getConfig('scrollWaitTime') : 800  // 当Item移动到容器边缘，等待多久进行自动滚动
        if (tempStore.scrollReactionStatic === 'stop') {
          tempStore.scrollReactionStatic = 'wait'
          tempStore.scrollReactionTimer = setTimeout(() => {
            tempStore.scrollReactionStatic = 'scroll'
            clearTimeout(tempStore.scrollReactionTimer)
          }, scrollWaitTime)
        }
        if (direction === 'X') {
          if (tempStore.scrollReactionStatic === 'scroll') {
            container.contentElement.parentElement.scrollLeft += scrollOffset
          }
        }
        if (direction === 'Y') {
          if (tempStore.scrollReactionStatic === 'scroll') {
            container.contentElement.parentElement.scrollTop += scrollOffset
          }
        }
      }
      let isClearScrollTimerX = false, isClearScrollTimerY = false
      // 横向滚动
      if (ev.pageX - window.scrollX - scrollContainerBoxElRect.left < scrollContainerBoxElRect.width * 0.25) {
        scroll('X', -scrollSpeedX)
      } else if (ev.pageX - window.scrollX - scrollContainerBoxElRect.left > scrollContainerBoxElRect.width * 0.75) {
        scroll('X', scrollSpeedX)
      } else isClearScrollTimerX = true

      // 纵向滚动
      if (ev.pageY - window.scrollY - scrollContainerBoxElRect.top < scrollContainerBoxElRect.height * 0.25) {
        scroll('Y', -scrollSpeedY)
      } else if (ev.pageY - window.scrollY - scrollContainerBoxElRect.top > scrollContainerBoxElRect.height * 0.75) {
        scroll('Y', scrollSpeedY)
      } else isClearScrollTimerY = true
      if (isClearScrollTimerX && isClearScrollTimerY) {   // 当X和Y都不在预备滚动范围中，则可以清除定时器
        tempStore.scrollReactionStatic = 'stop'
        clearTimeout(tempStore.scrollReactionTimer)
      }
    }
    //------------------------------------------------------------------------------------------------//

    const pxToGridPosW = (offsetLeftPx) => {
      const w = (offsetLeftPx) / (container.getConfig('size')[0] + container.getConfig('margin')[0])
      if (w + dragItem.pos.w >= container.containerW) {
        return container.containerW - dragItem.pos.w + 1
      } else return Math.round(w) + 1
    }
    const pxToGridPosH = (offsetTopPx) => {
      const h = (offsetTopPx) / (container.getConfig('size')[1] + container.getConfig('margin')[1])
      // console.log(h);
      if (h + dragItem.pos.h >= container.containerH) {
        return container.containerH - dragItem.pos.h + 1
      } else return Math.round(h) + 1
    }

    let nowMoveWidth = pxToGridPosW(offsetLeftPx)
    let nowMoveHeight = pxToGridPosH(offsetTopPx)
    // console.log(nowMoveWidth,nowMoveHeight)

    if (nowMoveWidth < 1) nowMoveWidth = 1
    if (nowMoveHeight < 1) nowMoveHeight = 1
    // console.log(offsetLeftPx,offsetTopPx);
    const growContainer: Container = dragItem.container
    if (growContainer.getConfig('autoGrowRow') && tempStore.isCoverRow) growContainer?.['cover']?.('row')
    dragItem.container.eventManager._callback_('itemMoving', nowMoveWidth, nowMoveHeight, dragItem)
    const responsiveLayoutAlgorithm = () => {
      if (dragItem === toItem) return   // 减少执行，和静态移动的话不同，对静态不进行限制，使得静态能在大Item下对微距的[移动move]调整更精确反应
      // 响应式Item交换算法
      //------计算鼠标的移动速度，太慢不做操作-----------//
      let startY, startX
      let now = Date.now()
      startX = ev.screenX
      startY = ev.screenY
      const mouseSpeed = () => {
        let dt = now - tempStore.mouseSpeed.timestamp;
        let distanceX = Math.abs(startX - tempStore.mouseSpeed.endX)
        let distanceY = Math.abs(startY - tempStore.mouseSpeed.endY)
        let distance = distanceX > distanceY ? distanceX : distanceY   //  选一个移动最多的方向
        let speed = Math.round(distance / dt * 1000);
        // console.log(dt, distance, speed);
        tempStore.mouseSpeed.endX = startX
        tempStore.mouseSpeed.endY = startY
        tempStore.mouseSpeed.timestamp = now;
        return {distance, speed}
      }

      //------对移动速度和距离做出限制,某个周期内移动速度太慢或距离太短忽略本次移动(only mouse event)------//
      if (!container.__ownTemp__.firstEnterUnLock) {
        const {distance, speed} = mouseSpeed()
        if (tempStore.deviceEventMode === 'mouse' && toItem && toItem.pos.w > 2 && toItem.pos.h > 2) {
          if (container.getConfig('size')[0] < 30 || container.getConfig('size')[1] < 30) {
            if (distance < 3) return
          } else if (container.getConfig('size')[0] < 60 || container.getConfig('size')[1] < 60) {
            if (distance < 7) return
          } else if (distance < 10 || speed < 10) return
          if (!dragItem) return
        }
      }

      //-----------找到dragItem当前移动覆盖的Item位置，取左上角第一个设定成toItem-------------//
      const nextPos = {
        x: nowMoveWidth < 1 ? 1 : nowMoveWidth,
        y: nowMoveHeight < 1 ? 1 : nowMoveHeight,
        w: dragItem.pos.w,
        h: dragItem.pos.h,
      }
      let moveInBlank = false   // 当前移动到的位置是否是container的空白处
      const innerContentArea = () => {
        // 在containerArea覆盖区域内的交换
        if (!dragItem.follow) return
        const rangeLimitItems = container.engine.findCoverItemFromPosition(nextPos.x, nextPos.y, nextPos.w, nextPos.h)
        // console.log(rangeLimitItems)
        if (rangeLimitItems.length > 0) {
          let updateItems = rangeLimitItems.filter(item => dragItem !== item)
          toItem = updateItems[0]
          // console.log(toItem,container);
        } else moveInBlank = true
      }
      const outerContentArea = () => {
        // 在响应式流Items覆盖区域外的检测，为了使得鼠标拖拽超出Items覆盖区域后dragItem还能跟随鼠标位置在流区域进行移动或交换
        // 说人话就是实现dragItem在鼠标超出边界还能跟随鼠标位置移动到边界
        const rangeLimitItems = container.engine.findResponsiveItemFromPosition(nextPos.x, nextPos.y)
        // console.log(rangeLimitItems);
        if (!rangeLimitItems) return
        toItem = rangeLimitItems
      }
      if (container.__ownTemp__.firstEnterUnLock) {
        innerContentArea()
      } else {
        if (dragItem.follow) {   // 是否可以拖动跟随和在container里面
          if (toItem) innerContentArea()
          else outerContentArea()
        } else innerContentArea()
      }
      // console.log(moveInBlank);
      // 如果是嵌套，toItem是和当前fromItem同级的，移动到空白处toItem置成null忽略才能直接让Item和子容器交换
      if (moveInBlank && toItem && toItem.nested) toItem = null

      // console.log(moveInBlank,toItem);
      // console.log(container.__ownTemp__.firstEnterUnLock);
      // console.log(nowMoveWidth,nowMoveHeight)
      //---------------------------响应模式【跨】容器交换(跨容器交换后直接跳出)------------------------------//
      if (container.__ownTemp__.firstEnterUnLock) {
        if (!moveInBlank) {
          if (!toItem) return   // 相邻容器移出来进入margin的空白区域不进行Item 交换
        }
        dragItem.pos.nextStaticPos = new ItemPos(dragItem.pos)
        dragItem.pos.nextStaticPos.x = nextPos.x
        dragItem.pos.nextStaticPos.y = nextPos.y
        dragItem.pos.autoOnce = true
        if (toItem) {   // 进入的是容器Item的覆盖位置区域
          if (tempStore.fromItem.container.parentItem === toItem) {
            return  // 必要，拖动Item边缘相邻容器初进可能识别toItem区域为源容器占用的地，触发toItem.i移动到源容器位置
          }
          if (dragItem.container === toItem.container) return
          itemDragEvent.mousemoveExchange(container, (newItem) => {
            container.engine.move(newItem, (toItem as Item).i)
          })
        } else {   //直接进入容器空白区域
          itemDragEvent.mousemoveExchange(container)
        }
        tempStore.dragContainer = container
        return   // 交换成功后直接退出
      }
      //---------------------------响应模式【相同】容器交换(下面代码部分)------------------------------//
      if (!toItem) return

      const fromItemPosInfo = dragItem.element.getBoundingClientRect()
      const proportionX = Math.abs(ev.pageX - fromItemPosInfo.left - tempStore.mousedownItemOffsetLeft) / toItem.element.clientWidth
      const proportionY = Math.abs(ev.pageY - fromItemPosInfo.top - tempStore.mousedownItemOffsetTop) / toItem.element.clientHeight
      const xOrY = proportionX > proportionY
      // console.log(proportionX,proportionY);
      if (Math.abs(proportionX - proportionY) < container.getConfig('sensitivity')) return
      // if (proportionX > 0.1 && proportionY > 0.1 && proportionX < 0.9 && proportionY < 0.9) return

      //-------------------修复移动高频toItem和dragItem高速互换闪烁限制----------------------//
      if (container.__ownTemp__.exchangeLock) return
      const contLimit = 3   //  设定限制连续不间断经过某个Item几次后执行休息
      const beforeOverItems = container.__ownTemp__.beforeOverItems
      let continuousOverCount = 0  // 连续经过toItem计数,超过三次休息，解决移动时候Item连续快速交换的闪烁问题
      for (let i = 0; i < beforeOverItems.length; i++) {
        if (i >= 3) break
        if (beforeOverItems[i] === toItem) continuousOverCount++
      }
      if (continuousOverCount >= contLimit) {
        container.__ownTemp__.exchangeLock = true
        let timer: any = setTimeout(() => {
          container.__ownTemp__.exchangeLock = false
          clearTimeout(timer)
          timer = null
        }, 200)
      } else if (beforeOverItems.length < contLimit && toItem.draggable) {   // 前contLimit(默认是上面的3个)个连续反应时间为toItem.transition.time
        if (typeof toItem.transition === 'object' && toItem.transition.time) {
          container.__ownTemp__.exchangeLock = true
          let timer: any = setTimeout(() => {
            container.__ownTemp__.exchangeLock = false
            clearTimeout(timer)
            timer = null
          }, toItem.transition.time)
        }
      }
      if (dragItem !== toItem) {
        container.__ownTemp__.beforeOverItems.unshift(toItem)
        if (beforeOverItems.length > 20) container.__ownTemp__.beforeOverItems.pop()  // 最多保存20个经过的Item
      } else return false // 必要，减少重排
      //---------Item跨容器交换方式,根据Items的顺序将会影响也能控制在容器中顺序布局位置--------//
      // 同容器成员间交换方式
      const isExchange = dragItem.container.eventManager._callback_('itemExchange', fromItem, toItem)
      if (isExchange === false || isExchange === null) return
      // console.log(dragItem,toItem);
      const responseMode = container.getConfig('responseMode')
      if (responseMode === 'default') {
        if (xOrY) {  // X轴
          container.engine.sortResponsiveItem()    // 必须且只能用于move排除不可用于exchange排序，不然item会坍塌
          container.engine.move(dragItem, toItem.i)
        } else { // Y轴
          container.engine.exchange(dragItem, toItem)
        }
      } else if (responseMode === 'stream') {
        container.engine.sortResponsiveItem()   //  如上解释
        container.engine.move(dragItem, toItem.i)
      } else if (responseMode === 'exchange') {
        container.engine.exchange(dragItem, toItem)
      }
      container.engine.updateLayout(true)
    }
    const staticLayoutAlgorithm = () => {
      // 静态布局的Item交换算法
      if (!dragItem.follow && !parseContainer(ev)) return     // 静态模式设定不跟随且移动到容器之外不进行算法操作
      dragItem.pos.nextStaticPos = new ItemPos(dragItem.pos)
      dragItem.pos.nextStaticPos.x = nowMoveWidth < 1 ? 1 : nowMoveWidth  // 栅格索引最低1
      dragItem.pos.nextStaticPos.y = nowMoveHeight < 1 ? 1 : nowMoveHeight

      let foundItems: Item[] = container.engine.findCoverItemFromPosition(dragItem.pos.nextStaticPos.x
        , dragItem.pos.nextStaticPos.y, dragItem.pos.w, dragItem.pos.h)  // 找到该位置下的所有Item

      if (foundItems.length > 0) {
        foundItems = foundItems.filter(item => dragItem !== item)
      }
      if (foundItems.length === 0) {  // 如果该位置下没有Item,则移动过去
        if (container.__ownTemp__.firstEnterUnLock) {
          itemDragEvent.mousemoveExchange(container)
          tempStore.dragContainer = container
        } else if (dragItem.pos.x !== dragItem.pos.nextStaticPos.x
          || dragItem.pos.y !== dragItem.pos.nextStaticPos.y
        ) {
          dragItem.pos.x = dragItem.pos.nextStaticPos.x
          dragItem.pos.y = dragItem.pos.nextStaticPos.y
          dragItem.pos.nextStaticPos = null
          container.engine.updateLayout([dragItem])
        }
        if (overContainer &&  cursor.cursor !== 'mousedown') cursor.mousedown()
      } else {
        // 静态模式下移动到Item上,这里的作用是在有margin的时候保证移动到margin也是禁止状态
        dragItem.pos.nextStaticPos = null   // 必须在这里，不可缺，作用:找不到空位清除nextStaticPos
      }
    }
    Sync.run(() => {
      //  判断使用的是静态布局还是响应式布局并执行响应的算法
      const oldPos = Object.assign({}, dragItem.pos)
      let doAlgorithmContainer = container
      if (overContainer && overContainer.__ownTemp__.firstEnterUnLock) {
        doAlgorithmContainer = overContainer
      }
      // console.log(doAlgorithmContainer.responsive);
      if (doAlgorithmContainer.getConfig('responsive')) responsiveLayoutAlgorithm()
      else staticLayoutAlgorithm()
      if (oldPos.x !== dragItem.pos.x || oldPos.y !== dragItem.pos.y) {
        const vuePosChange = dragItem._VueEvents['vueItemMovePositionChange']
        if (typeof vuePosChange === 'function') {
          vuePosChange(oldPos.x, oldPos.y, dragItem.pos.x, dragItem.pos.y)
        }
        dragItem.container.eventManager._callback_('itemMovePositionChange', oldPos.x, oldPos.y, dragItem.pos.x, dragItem.pos.y)
      }
    })
  }, 36),
  mousemoveFromClone: (ev) => {
    //  对drag克隆元素的操作
    // ev.stopPropagation()
    const mousedownEvent = tempStore.mousedownEvent
    const fromItem: Item = tempStore.fromItem
    const moveItem: Item = tempStore.moveItem
    if (!mousedownEvent || !fromItem) return
    let dragItem = tempStore.moveItem ? moveItem : fromItem
    const container: Container = parseContainer(ev)
    dragItem.__temp__.dragging = true

    if (tempStore.cloneElement === null) {
      tempStore.cloneElement = dragItem.element.cloneNode(true)
      tempStore.cloneElement.classList.add('grid-clone-el', 'grid-dragging-clone-el')
      document.body.appendChild(tempStore.cloneElement)    // 直接添加到body中后面定位省心省力
      dragItem.domImpl.addClass('grid-dragging-source-el')
      dragItem.domImpl.updateStyle({
        pointerEvents: 'none',
        transitionProperty: 'none',
        transitionDuration: 'none',
      }, tempStore.cloneElement)
    } else {
      if (container && container.__ownTemp__.firstEnterUnLock) {
        Sync.run({
          func: () => {
            // 交换进入新容器时重新给Item样式
            const newExchangeItem = tempStore.fromItem
            const className = 'grid-dragging-source-el'
            if (!newExchangeItem.hasClass(className)) {
              newExchangeItem.addClass(className)
            }
          },
          rule: () => container === tempStore.fromItem?.container,
          intervalTime: 2,
          timeout: 200
        })
      }
    }
    let left = ev.pageX - tempStore.mousedownItemOffsetLeft
    let top = ev.pageY - tempStore.mousedownItemOffsetTop

    if (!dragItem.dragOut) {   // 限制是否允许拖动到容器之外
      const containerElOffset = container.contentElement.getBoundingClientRect()
      const limitLeft = window.scrollX + containerElOffset.left
      const limitTop = window.scrollY + containerElOffset.top
      const limitRight = window.scrollX + containerElOffset.left + container.contentElement.clientWidth - dragItem.nowWidth()
      const limitBottom = window.scrollY + containerElOffset.top + container.contentElement.clientHeight - dragItem.nowHeight()
      if (left < limitLeft) left = limitLeft
      if (left > limitRight) left = limitRight
      if (top < limitTop) top = limitTop
      if (top > limitBottom) top = limitBottom
      // console.log(containerElOffset,left,top);
    }
    dragItem.domImpl.updateStyle({
      left: left + 'px',
      top: top + 'px',
    }, tempStore.cloneElement)
  }
}
