import {parseContainer, parseItem, Sync, throttle} from "@/utils";
import {tempStore} from "@/store";
import {Container, Item, ItemPos} from "@/main";
import {cursor, doItemExchange} from "@/events";
import {h} from "vue";

/**
 * 自身容器Item交换和跨容器Item成员交换
 * @param {Container} container
 * @param {Function} itemPositionMethod(newItem)  执行该函数的前提是Item已经转移到当前鼠标对应的Container中，
 *                                                  itemPositionMethod函数接受一个参数newItem,
 *                                                  之后在该回调函数中可以决定该移动的Item在Items中的排序(响应式模式下)
 *                                                  静态模式下只要定义了pos后任何顺序都是不影响位置的。所以该函数主要针对响应式
 * */
export const fromItemChange_mousemove: Function = throttle((ev) => {
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
    deviceEventMode,
    isCoverRow,
    mouseSpeed: mouseSpeedTemp,
  } = tempStore
  ev.stopPropagation()
  if (!isDragging) return
  let toItem: Item | null = parseItem(ev)
  if (toItem) tempStore.toItem = toItem
  if (!fromItem || !mousedownEvent || !isLeftMousedown || !fromContainer) return
  let dragItem: Item = moveItem || fromItem
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
    } else return Math.round(w) + 1
  }
  const pxToGridPosH = (offsetTopPx) => {
    const h = (offsetTopPx) / (container.getConfig('size')[1] + container.getConfig('margin')[1])
    // console.log(h);
    if (h + dragItem.pos.h >= container.containerH) {
      return container.containerH - dragItem.pos.h + 1
    } else return Math.round(h) + 1
  }

  let nowMoveX = pxToGridPosW(offsetLeftPx)
  let nowMoveY = pxToGridPosH(offsetTopPx)
  // console.log(nowMoveX, nowMoveY)

  container.engine.layoutManager.move(container.engine.items, fromItem, nowMoveX, nowMoveY)


  return;
  if (nowMoveX < 1) nowMoveX = 1
  if (nowMoveY < 1) nowMoveY = 1
  // console.log(offsetLeftPx,offsetTopPx);
  const growContainer: Container = dragItem.container
  if (growContainer.getConfig('autoGrowRow') && isCoverRow) growContainer?.['cover']?.('row')
  dragItem.container.eventManager._callback_('itemMoving', nowMoveX, nowMoveY, dragItem)
  const responsiveLayoutAlgorithm = () => {
    if (dragItem === toItem) return   // 减少执行，和静态移动的话不同，对静态不进行限制，使得静态能在大Item下对微距的[移动move]调整更精确反应
    // 响应式Item交换算法
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
    if (!container.__ownTemp__.firstEnterUnLock) {
      const {distance, speed} = mouseSpeed()
      if (deviceEventMode === 'mouse' && toItem && toItem.pos.w > 2 && toItem.pos.h > 2) {
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
      x: nowMoveX < 1 ? 1 : nowMoveX,
      y: nowMoveY < 1 ? 1 : nowMoveY,
      w: dragItem.pos.w,
      h: dragItem.pos.h,
    }
    let moveInBlank = false   // 当前移动到的位置是否是container的空白处
    const innerContentArea = () => {
      // 在containerArea覆盖区域内的交换
      if (!dragItem.follow) return
      const rangeLimitItems = container.engine.layoutManager.findCoverItemFromPosition(container.engine.items, {
        x: nextPos.x, y: nextPos.y, w: nextPos.w, h: nextPos.h
      })
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
      const rangeLimitItems = container.engine.layoutManager.findResponsiveItemFromPosition(container.engine.items, nextPos.x, nextPos.y)
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
      // dragItem.pos.autoOnce = true
      if (toItem) {   // 进入的是容器Item的覆盖位置区域
        if (fromItem.container.parentItem === toItem) {
          return  // 必要，拖动Item边缘相邻容器初进可能识别toItem区域为源容器占用的地，触发toItem.i移动到源容器位置
        }
        if (dragItem.container === toItem.container) return
        doItemExchange(container, (newItem) => {
          container.engine.move(newItem, (toItem as Item).i)
        })
      } else {   //直接进入容器空白区域
        doItemExchange(container)
      }
      tempStore.dragContainer = container
      return   // 交换成功后直接退出
    }
    //---------------------------响应模式【相同】容器交换(下面代码部分)------------------------------//
    if (!toItem) return

    const fromItemPosInfo = dragItem.element.getBoundingClientRect()
    const proportionX = Math.abs(ev.pageX - fromItemPosInfo.left - mousedownItemOffsetLeft) / toItem.element.clientWidth
    const proportionY = Math.abs(ev.pageY - fromItemPosInfo.top - mousedownItemOffsetTop) / toItem.element.clientHeight
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
    dragItem.pos.nextStaticPos.x = nowMoveX < 1 ? 1 : nowMoveX  // 栅格索引最低1
    dragItem.pos.nextStaticPos.y = nowMoveY < 1 ? 1 : nowMoveY

    let foundItems: Item[] = container.engine.layoutManager.findCoverItemFromPosition(container.engine.items,{
      x: dragItem.pos.nextStaticPos.x,
      y: dragItem.pos.nextStaticPos.y,
      w: dragItem.pos.w,
      h: dragItem.pos.h
    })  // 找到该位置下的所有Item

    if (foundItems.length > 0) {
      foundItems = foundItems.filter(item => dragItem !== item)
    }
    if (foundItems.length === 0) {  // 如果该位置下没有Item,则移动过去
      if (container.__ownTemp__.firstEnterUnLock) {
        doItemExchange(container)
        tempStore.dragContainer = container
      } else if (dragItem.pos.x !== dragItem.pos.nextStaticPos.x
        || dragItem.pos.y !== dragItem.pos.nextStaticPos.y
      ) {
        dragItem.pos.x = dragItem.pos.nextStaticPos.x
        dragItem.pos.y = dragItem.pos.nextStaticPos.y
        dragItem.pos.nextStaticPos = null
        container.engine.updateLayout([dragItem])
      }
      if (overContainer && cursor.cursor !== 'mousedown') cursor.mousedown()
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
}, 36)
