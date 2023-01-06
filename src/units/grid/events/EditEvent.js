import {
    merge,
    parseContainer, parseContainerAreaElement, parseContainerFromPrototypeChain,
    parseItem,
    singleTouchToCommonEvent,
    throttle
} from "@/units/grid/other/tool.js";
import TempStore from "@/units/grid/other/TempStore.js";
import Item from "@/units/grid/main/item/Item.js";
import Sync from "@/units/grid/other/Sync.js";
import ItemPos from "@/units/grid/main/item/ItemPos.js";

const tempStore = TempStore.store


export default class EditEvent {

    /** 用于事件委托触发的函数集  */
    static _eventEntrustFunctor = {
        itemResize: {
            doResize: throttle((ev) => {
                const mousedownEvent = tempStore.mousedownEvent
                const isLeftMousedown = tempStore.isLeftMousedown
                const fromItem = tempStore.fromItem
                if (fromItem === null || mousedownEvent === null || !isLeftMousedown) return
                const container = fromItem.container
                if (tempStore.cloneElement === null) {
                    tempStore.cloneElement = fromItem.element.cloneNode(true)
                    tempStore.cloneElement.classList.add('grid-clone-el', 'grid-resizing-clone-el')
                    if (tempStore.cloneElement) tempStore.fromContainer.contentElement.appendChild(tempStore.cloneElement)
                    fromItem.updateStyle({transition: 'none'}, tempStore.cloneElement)
                    fromItem.addClass('grid-resizing-source-el')
                }
                // console.log(fromItem.pos);
                const containerElRect = fromItem.container.contentElement.getBoundingClientRect()
                let width = ev.pageX - containerElRect.left - window.scrollX - fromItem.offsetLeft()
                let height = ev.pageY - containerElRect.top - window.scrollY - fromItem.offsetTop()
                //-----------------判断克隆Item当前对应栅格中的w，h---------------------//
                const resized = {
                    w: Math.ceil(width / (fromItem.size[0] + fromItem.margin[0])),
                    h: Math.ceil(height / (fromItem.size[1] + fromItem.margin[1])),
                }
                if (resized.w < 1) resized.w = 1
                if (resized.h < 1) resized.h = 1
                //-----------------限制信息计算函数定义---------------------//
                const limitGrid = ({w, h}) => {
                    // w，h是新的resize克隆元素对应生成大小的w，和h
                    const pos = fromItem.pos
                    //----------------检测改变的大小是否符合用户限制 -------------//
                    if ((w + pos.x) > container.col) w = container.col - pos.x + 1     //item调整大小时在容器右边边界超出时进行限制
                    if (w < pos.minW) w = pos.minW
                    if (w > pos.maxW && pos.maxW !== Infinity) w = pos.maxW

                    if (!fromItem.container.autoGrowRow) {
                        if ((h + pos.y) > container.row) h = container.row - pos.y + 1
                    }
                    if (h < pos.minH) h = pos.minH
                    if (h > pos.maxH && pos.maxH !== Infinity) h = pos.maxH
                    return {
                        w,
                        h
                    }
                }

                const limitCloneEl = () => {
                    //------------------------克隆元素长宽限制---------------------------//
                    if (width > fromItem.maxWidth()) width = fromItem.maxWidth()
                    if (height > fromItem.maxHeight()) height = fromItem.maxHeight()
                    if (width < fromItem.minWidth()) width = fromItem.minWidth()
                    if (height < fromItem.minHeight()) height = fromItem.minHeight()
                    return {
                        width,
                        height
                    }
                }
                //-----------------响应式和静态的分别resize算法实现---------------------//
                const newResize = limitGrid(resized)    //当前鼠标距离x,y的距离构成的矩形
                // console.log(fromItem.pos.w,fromItem.pos.h);

                if (!fromItem.container.responsive) {
                    //  静态模式下对resize进行重置范围的限定，如果resize超过容器边界或者压住其他静态成员，直接打断退出resize过程
                    const nowElSize = limitCloneEl()
                    const maxBlankMatrixLimit = fromItem.container.engine.findStaticBlankMaxMatrixFromItem(fromItem)
                    const updateStyle = {}
                    // console.log(maxBlankMatrixLimit);
                    if (newResize.w > maxBlankMatrixLimit.minW && newResize.h > maxBlankMatrixLimit.minH) return  // 最低要求限制不能同时超过
                    if (maxBlankMatrixLimit.maxW >= newResize.w) {    // 横向调整
                        updateStyle.width = nowElSize.width + 'px'
                        fromItem.pos.w = newResize.w
                    } else {
                        newResize.w = fromItem.pos.w      //必要，将当前实际宽给newResize
                    }
                    if (maxBlankMatrixLimit.maxH >= newResize.h) {  // 纵向调整
                        updateStyle.height = nowElSize.height + 'px'
                        fromItem.pos.h = newResize.h
                    } else {
                        newResize.h = fromItem.pos.h   //必要，将当前实际高给newResize
                    }
                    if (Object.keys(updateStyle).length > 0) {
                        fromItem.updateStyle(updateStyle, tempStore.cloneElement)
                    }
                    // console.log(fromItem.pos.w,fromItem.pos.h, container.col, fromItem.pos.col);

                } else if (fromItem.container.responsive) {
                    //---------------------动态模式resize判断是否w和h是否改变并更新---------------------//
                    merge(fromItem.pos, newResize)
                    const nowElSize = limitCloneEl()
                    fromItem.updateStyle({
                        width: nowElSize.width + 'px',
                        height: nowElSize.height + 'px',
                    }, tempStore.cloneElement)
                }
                if (!fromItem.__temp__.resized) fromItem.__temp__.resized = {w: 1, h: 1}
                if (fromItem.__temp__.resized.w !== resized.w || fromItem.__temp__.resized.h !== resized.h) { // 只有改变Item的大小才进行style重绘
                    fromItem.__temp__.resized = newResize
                    if (typeof fromItem._VueEvents.vueItemResizing === 'function') {
                        fromItem._VueEvents.vueItemResizing(fromItem, newResize.w, newResize.h)
                    }

                    fromItem.container.eventManager._callback_('itemResizing', newResize.w, newResize.h, fromItem)
                    tempStore.fromContainer.updateLayout([fromItem])
                    fromItem.updateStyle(fromItem._genLimitSizeStyle())
                    fromItem.container.updateContainerStyleSize()
                }
            }, 15),
            mouseup: (ev) => {
                const fromItem = tempStore.fromItem
                if (fromItem === null) return
                //----------------------------------------//
                fromItem.__temp__.clientWidth = fromItem.nowWidth()
                fromItem.__temp__.clientHeight = fromItem.nowHeight()
                tempStore.isLeftMousedown = false
                fromItem.updateStyle(fromItem._genItemStyle())
            },
        },
        check: {
            resizeOrDrag: (ev) => {
                const container = parseContainer(ev)
                if (!container) return
                if (tempStore.fromItem?.draggable && tempStore.dragOrResize === 'drag') {
                    tempStore.isDragging = true
                    tempStore.isResizing = false
                    return 'drag'
                } else if (tempStore.fromItem?.resize && tempStore.dragOrResize === 'resize') {
                    tempStore.isResizing = true
                    tempStore.isDragging = false
                    return 'resize'
                } else if (tempStore.dragOrResize === 'slidePage') {
                    return 'slidePage'
                }


            }
        },
        cursor: {
            cursor: 'notFound',
            removeAllCursors: () => {
                document.body.classList.forEach(className => {
                    if (className.includes('grid-cursor')) {
                        document.body.classList.remove(className)
                    }
                })
            },
            default: function () {
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-default')
                this.cursor = 'default'
            },
            inContainer: function () { // 正常是grab才好看
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-in-container')
                this.cursor = 'in-container'
            },
            mousedown: function () { // 正常是grabbing才好看
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-mousedown')
                this.cursor = 'mousedown'
            },
            notDrop: function () {
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-no-drop')
                this.cursor = 'no-drop'
            },
            staticItemNoDrop: function () {
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-static-item')
                this.cursor = 'static-no-drop'
            },
            dragToItemNoDrop: function () {
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-drag-to-item')
                this.cursor = 'drag-to-item-no-drop'
            },
            itemClose: function () {
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-item-close')
                this.cursor = 'item-close'
            },
            itemResize: function () {
                this.removeAllCursors()
                document.body.classList.add('grid-cursor-item-resize')
                this.cursor = 'item-resize'
            },
            removeAllCursor: function () {
                this.removeAllCursors()
                this.cursor = 'notFound'
            },
        },
        prevent: {
            default: (ev) => ev.preventDefault(),
            false: (ev) => false,
            contextmenu: (ev) => ev.preventDefault()
        },
        windowResize: {
            setResizeFlag: () => tempStore.isWindowResize = true,
            removeResizeFlag: () => tempStore.isWindowResize = false,
        },
        moveOuterContainer: {  //  用于跨容器Item通信，转移的各种处理
            /**用于嵌套情况两个【相邻】Container的直接过渡
             * @param {Container}  fromContainer   从那个Container中来
             * @param {Container}  toContainer      到哪个Container中去
             * 在嵌套容器中假设父容器为A，被嵌套容器为B,  如果A到 B 则fromContainer为A，toContainer为B,此时dragItem属于A，
             * 如果A到 B 此时鼠标不抬起继续从B返回A 则fromContainer为 B，toContainer为A，此时dragItem还是属于A,通过dragItem的归属能确定跨容器时候是否鼠标被抬起
             * */
            leaveToEnter: function (fromContainer, toContainer) {
                if (!tempStore.isDragging || !fromContainer || !toContainer) return
                let fromItem = tempStore.fromItem
                let moveItem = tempStore.moveItem
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                // console.log(fromContainer,toContainer,dragItem);
                //------------下方代码固定顺序-------------//
                // fromItem._mask_(false)    //  相邻清除遮罩防止遮挡嵌套容器内的Item操作
                this.mouseleave(null, fromContainer)
                // console.log(dragItem.container,toContainer)

                if (dragItem.container === toContainer) {
                    tempStore.fromContainer = toContainer
                    return
                }

                if (toContainer.isNesting) {   //  修复快速短距重复拖放情况下概率识别成父容器移动到子容器当Item的情况
                    if (toContainer.parentItem === dragItem
                        || toContainer.parentItem.element === dragItem.element) {
                        return
                    }
                }
                toContainer.__ownTemp__.nestingEnterBlankUnLock = true
                this.mouseenter(null, toContainer)
                //  如果现在点击嵌套容器空白部分选择的Item会是父容器的Item,按照mouseenter逻辑对应不可能删除当前Item(和前面一样是fromItem)在插入
                //  接上:因为这样是会直接附加在父级Container最后面，这倒不如什么都不做直接等待后面逻辑执行换位功能
            },
            mouseenter: function (ev, container = null) {
                if (!container && ev.target._isGridContainer_) {
                    ev.preventDefault()
                    container = ev.target._gridContainer_
                }
                let fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                if (dragItem && dragItem.container === container) return   // 非常必要，防止嵌套拖动容器互相包含
                if (tempStore.isLeftMousedown) {
                    Sync.run({
                        func: () => {
                            container.eventManager._callback_('enterContainerArea', container, tempStore.exchangeItems.new)
                            tempStore.exchangeItems.new = null
                            tempStore.exchangeItems.old = null
                        },
                        rule: () => tempStore.exchangeItems.new,
                        intervalTime: 2, // 每2ms查询是否vue的新Item创建成功,
                        timeout: 200
                    })
                }
                container.__ownTemp__.firstEnterUnLock = true
                tempStore.moveContainer = container
            },
            mouseleave: function (ev, container = null) {
                let fromItem = tempStore.fromItem
                let moveItem = tempStore.moveItem
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                container.__ownTemp__.firstEnterUnLock = false
                container.__ownTemp__.nestingEnterBlankUnLock = false
                if (tempStore.isLeftMousedown) {
                    container.eventManager._callback_('leaveContainerArea', container, dragItem)
                    // container._VueEvents.vueLeaveContainerArea(container, dragItem)
                }

            }
        },
        itemDrag: {
            /** 跨容器Item成员交换
             * @param {Container} container
             * @param {Function} itemPositionMethod(newItem)  执行该函数的前提是Item已经转移到当前鼠标对应的Container中，
             *                                                  itemPositionMethod函数接受一个参数newItem,
             *                                                  之后在该回调函数中可以决定该移动的Item在Items中的排序(响应式模式下)
             *                                                  静态模式下只要定义了pos后任何顺序都是不影响位置的。所以该函数主要针对响应式
             * */
            mousemoveExchange: (container, itemPositionMethod = null) => {
                let fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                if (!tempStore.isDragging || fromItem === null || !container || !tempStore.isLeftMousedown) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                if (!fromItem.container.exchange
                    || !dragItem.container.exchange
                    || !dragItem.exchange
                ) return
                try {
                    dragItem.pos.el = null   // 要将原本pos中的对应文档清除掉换克隆后的
                    let dragItemElement = fromItem.element
                    const newItem = new Item({
                        pos: dragItem.pos,
                        size: container['size'],
                        margin: container['margin'],
                        el: dragItemElement,
                        name: dragItem.name,
                        type: dragItem.type,
                        draggable: dragItem.draggable,
                        resize: dragItem.resize,
                        close: dragItem.close,
                        transition: dragItem.transition,
                        static: dragItem.static,
                        follow: dragItem.follow,
                        dragOut: dragItem.dragOut,
                        className: dragItem.className,
                        dragIgnoreEls: dragItem.dragIgnoreEls,
                        dragAllowEls: dragItem.dragAllowEls,
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
                        // dragItem._mounted = false
                        container._VueEvents.vueCrossContainerExchange(newItem, tempStore, (newItem) => {
                            dragItem.unmount()  // 这里不卸载  交给vue管理
                            dragItem.remove()
                            doItemPositionMethod(newItem)
                            if (container) {
                                if (dragItem !== newItem && !dragItem.container.responsive) {
                                    dragItem.container.engine.updateLayout([dragItem])
                                } else {
                                    dragItem.container.engine.updateLayout(true)
                                }
                            }
                        })
                    }
                    const nativeExchange = () => {
                        if (container['responsive']) newItem.pos.autoOnce = true
                        else if (!container['responsive']) newItem.pos.autoOnce = false
                        container.add(newItem)
                        dragItem.unmount()  // 先成功移除原来容器中Item后再在新容器新添加Item，移除不成功不添加
                        dragItem.remove()
                        if (container) {
                            if (!newItem.container.responsive) {
                                newItem.container.engine.updateLayout([newItem])
                            } else {
                                newItem.container.engine.updateLayout()
                            }
                            if (dragItem !== newItem && !dragItem.container.responsive) {
                                dragItem.container.engine.updateLayout([dragItem])
                            } else {
                                dragItem.container.engine.updateLayout()
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
                let fromItem = tempStore.fromItem
                let toItem = parseItem(ev)
                if (toItem) tempStore.toItem = toItem
                const moveItem = tempStore.moveItem
                const mousedownEvent = tempStore.mousedownEvent
                if (fromItem === null || mousedownEvent === null || !tempStore.isLeftMousedown) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                let container = dragItem.container
                let overContainer = null
                if (dragItem.exchange) {  // 如果目标允许参与交换，则判断当前是否在自身容器移动，如果是阻止进入防止自身嵌套
                    overContainer = parseContainer(ev)
                    if (overContainer) container = overContainer // 如果开了exchange则移动将overContainer重置目标容器
                    if (dragItem.container !== overContainer) {
                        if (container.parentItem && container.parentItem === dragItem) return
                        // const target = ev.touchTarget ? ev.touchTarget : ev.target
                        // if (!target._isGridContainerArea) return   // (该代码bug：exchange toItem无响应)跨容器只有移动到gridContainerArea才进行响应，只移动到GridContainer元素上忽略掉
                    }
                }

                //-----------------------是否符合交换环境参数检测结束-----------------------//
                // offsetDragItemX 和 offsetDragItemY 是换算跨容器触发比例，比如大Item到小Item容器换成小Item容器的拖拽触发尺寸
                const offsetDragItemX = tempStore.mousedownItemOffsetLeft * (container.size[0] / tempStore.fromContainer.size[0])
                const offsetDragItemY = tempStore.mousedownItemOffsetTop * (container.size[1] / tempStore.fromContainer.size[1])
                // console.log(offsetDragItemX,offsetDragItemY);
                const dragContainerElRect = container.contentElement.getBoundingClientRect()
                // Item距离容器的px
                const offsetLeftPx = ev.pageX - offsetDragItemX - (window.scrollX + dragContainerElRect.left)
                const offsetTopPx = ev.pageY - offsetDragItemY - (window.scrollY + dragContainerElRect.top)
                // console.log(dragItem);

                //------如果容器内容超出滚动条盒子在边界的时候自动滚动(上高0.25倍下高0.75倍触发，左宽0.25倍右宽0.75倍触发)-----//
                if (dragItem.container.followScroll) {
                    const scrollContainerBoxEl = container.contentElement.parentElement
                    const scrollContainerBoxElRect = scrollContainerBoxEl.getBoundingClientRect()
                    const scrollSpeedX = container.scrollSpeedX ? container.scrollSpeedX : Math.round(scrollContainerBoxElRect.width / 20)
                    const scrollSpeedY = container.scrollSpeedY ? container.scrollSpeedY : Math.round(scrollContainerBoxElRect.height / 20)
                    const scroll = (direction, scrollOffset) => {
                        const isScroll = dragItem.container.eventManager._callback_('autoScroll', direction, scrollOffset, dragItem.container)
                        if (isScroll === false || isScroll === null) return
                        if (typeof isScroll === 'object') {   //按照返回的最新方向和距离进行滚动，这里类型限制不严谨，但是吧开发者自己控制不管那么多了
                            if (typeof isScroll.offset === 'number') scrollOffset = isScroll.offset
                            if (['X', 'Y'].includes(isScroll.direction)) direction = isScroll.direction
                        }
                        const scrollWaitTime = container ? container.scrollWaitTime : 800  // 当Item移动到容器边缘，等待多久进行自动滚动
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
                    const w = (offsetLeftPx) / (container.size[0] + container.margin[0])
                    // console.log(w);
                    if (w + dragItem.pos.w >= container.containerW) {
                        return container.containerW - dragItem.pos.w + 1
                    } else return Math.round(w) + 1
                }
                const pxToGridPosH = (offsetTopPx) => {
                    const h = (offsetTopPx) / (container.size[1] + container.margin[1])
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
                dragItem.container.eventManager._callback_('itemMoving', nowMoveWidth, nowMoveHeight, dragItem)

                const responsiveLayoutAlgorithm = () => {
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
                            if (container.size[0] < 30 || container.size[1] < 30) {
                                if (distance < 3) return
                            } else if (container.size[0] < 60 || container.size[1] < 60) {
                                if (distance < 7) return
                            } else if (distance < 10 || speed < 10) return
                            if (dragItem === null) return
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
                        const rangeLimitItems = container.engine.findResponsiveItemFromPosition(nextPos.x, nextPos.y, nextPos.w, nextPos.h)
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
                            EEF.itemDrag.mousemoveExchange(container, (newItem) => {
                                container.engine.move(newItem, toItem.i)
                            })
                        } else {   //直接进入容器空白区域
                            EEF.itemDrag.mousemoveExchange(container)
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
                    if (Math.abs(proportionX - proportionY) < container.sensitivity) return
                    // if (proportionX > 0.1 && proportionY > 0.1 && proportionX < 0.9 && proportionY < 0.9) return

                    //-------------------修复移动高频toItem和dragItem高速互换闪烁限制----------------------//
                    if (container.__ownTemp__.exchangeLock === true) return
                    const contLimit = 3   //  设定限制连续不间断经过某个Item几次后执行休息
                    const beforeOverItems = container.__ownTemp__.beforeOverItems
                    let continuousOverCount = 0  // 连续经过toItem计数,超过三次休息，解决移动时候Item连续快速交换的闪烁问题
                    for (let i = 0; i < beforeOverItems.length; i++) {
                        if (i >= 3) break
                        if (beforeOverItems[i] === toItem) continuousOverCount++
                    }
                    if (continuousOverCount >= contLimit) {
                        container.__ownTemp__.exchangeLock = true
                        let timer = setTimeout(() => {
                            container.__ownTemp__.exchangeLock = false
                            clearTimeout(timer)
                            timer = null
                        }, 200)
                    } else if (beforeOverItems.length < contLimit && toItem.draggable) {   // 前contLimit(默认是上面的3个)个连续反应时间为toItem.transition.time
                        if (toItem.transition && toItem.transition.time) {
                            container.__ownTemp__.exchangeLock = true
                            let timer = setTimeout(() => {
                                container.__ownTemp__.exchangeLock = false
                                clearTimeout(timer)
                                timer = null
                            }, toItem.transition.time)
                        }
                    }

                    if (dragItem !== toItem) {
                        container.__ownTemp__.beforeOverItems.unshift(toItem)
                        if (beforeOverItems.length > 20) container.__ownTemp__.beforeOverItems.pop()  // 最多保存20个经过的Item
                    }
                    //---------Item跨容器交换方式,根据Items的顺序将会影响也能控制在容器中顺序布局位置--------//
                    // 同容器成员间交换方式
                    const isExchange = dragItem.container.eventManager._callback_('itemExchange', fromItem, toItem)
                    if (isExchange === false || isExchange === null) return
                    // console.log(dragItem,toItem);
                    if (container.responseMode === 'default') {
                        if (xOrY) {  // X轴
                            // console.log(111111111111111111)
                            container.engine.sortResponsiveItem()
                            container.engine.move(dragItem, toItem.i)
                        } else { // Y轴
                            container.engine.exchange(dragItem, toItem)
                        }
                    } else if (container.responseMode === 'stream') {
                        container.engine.sortResponsiveItem()
                        container.engine.move(dragItem, toItem.i)
                        // container.engine.sortResponsiveItem()
                    } else if (container.responseMode === 'exchange') {
                        container.engine.exchange(dragItem, toItem)
                    }

                    container.engine.updateLayout()
                }
                const staticLayoutAlgorithm = () => {
                    // 静态布局的Item交换算法
                    if (!dragItem.follow && !parseContainer(ev)) return     // 静态模式设定不跟随且移动到容器之外不进行算法操作
                    dragItem.pos.nextStaticPos = new ItemPos(dragItem.pos)
                    dragItem.pos.nextStaticPos.x = nowMoveWidth < 1 ? 1 : nowMoveWidth  // 栅格索引最低1
                    dragItem.pos.nextStaticPos.y = nowMoveHeight < 1 ? 1 : nowMoveHeight
                    // console.log(container.engine.layoutManager._layoutMatrix);
                    // const Matrix= container.engine.layoutManager._layoutMatrix
                    // for (let i = 0; i < Matrix.length; i++) {
                    //     // console.log(Matrix[i]);
                    // }

                    let foundItems = container.engine.findCoverItemFromPosition(dragItem.pos.nextStaticPos.x
                        , dragItem.pos.nextStaticPos.y, dragItem.pos.w, dragItem.pos.h)  // 找到该位置下的所有Item

                    if (foundItems.length > 0) {
                        foundItems = foundItems.filter(item => dragItem !== item)
                    }
                    if (foundItems.length === 0) {  // 如果该位置下没有Item,则移动过去
                        if (container.__ownTemp__.firstEnterUnLock) {
                            EEF.itemDrag.mousemoveExchange(container)
                            tempStore.dragContainer = container
                        } else {
                            dragItem.pos.x = dragItem.pos.nextStaticPos.x
                            dragItem.pos.y = dragItem.pos.nextStaticPos.y
                            dragItem.pos.nextStaticPos = null
                            container.engine.updateLayout([dragItem])
                        }
                        if (overContainer && EEF.cursor.cursor !== 'mousedown') EEF.cursor.mousedown(ev)
                    } else {
                        // 静态模式下移动到Item上,这里的作用是在有margin的时候保证移动到margin也是禁止状态
                        dragItem.pos.nextStaticPos = null   // 必须在这里，不可缺，作用:找不到空位清除nextStaticPos
                        const overItem = parseItem(ev)
                        if (overItem && dragItem !== overItem) {
                            if (EEF.cursor.cursor !== 'drag-to-item-no-drop') EEF.cursor.dragToItemNoDrop()
                        }
                    }

                }
                Sync.run(() => {
                    //  判断使用的是静态布局还是响应式布局并执行响应的算法
                    const oldPos = Object.assign({}, dragItem.pos)
                    if (container.responsive) responsiveLayoutAlgorithm()
                    else staticLayoutAlgorithm()
                    if (oldPos.x !== dragItem.pos.x || oldPos.y !== dragItem.pos.y) {
                        const vuePosChange = dragItem._VueEvents.vueItemMovePositionChange
                        if (typeof vuePosChange === 'function') {
                            vuePosChange(oldPos.x, oldPos.y, dragItem.pos.x, dragItem.pos.y)
                        }
                        dragItem.container.eventManager._callback_('itemMovePositionChange', oldPos.x, oldPos.y, dragItem.pos.x, dragItem.pos.y)
                    }
                })


                //------判断Item是左右平移还是上下平移的算法，二分过半判断(初始算法，不如简单版来的实在，留着或许以后有用)------//
                // console.log('move');
                // let left
                // let top
                // if (tempStore.fromContainer === toItem.container) {
                //     left = ev.pageX - mousedownEvent.pageX + tempStore.offsetPageX
                //     top = ev.pageY - mousedownEvent.pageY + tempStore.offsetPageY
                // } else {
                //     left = ev.pageX - container.contentElement.offsetLeft
                //     top = ev.pageY - container.contentElement.offsetTop
                // }

                // console.log(left / (container.size[0] + container.margin[0]), top / (container.size[1] + container.margin[1]));
                // let moveBoundaryX = document.body.clientWidth / (container.size[0] + container.margin[0])
                // let moveBoundaryY = document.body.clientHeight / (container.size[1] + container.margin[1])
                // 要反应灵敏一点  修改 sensitivity值
                // let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                // console.log(left,top);
                // console.log(ev);

                // // console.log(toItem.pos.x - 1 + (toItem.pos.w / container.sensitivity),moveBoundaryX);
                // if (dragItem.pos.x > toItem.pos.x && (toItem.pos.x - 1 + (toItem.pos.w - (toItem.pos.w * container.sensitivity)) >= moveBoundaryX)) {
                //     // 左移动,希望 toItem.pos.w / sensitivity等这种偏移大一点，越大越接近右边左移也更快，总体感觉就灵敏
                //     container.engine.move(dragItem, toItem.i)
                // } else if (dragItem.pos.x < toItem.pos.x && (toItem.pos.x - 1 + (toItem.pos.w * container.sensitivity) <= moveBoundaryX)) {
                //     // 右移动 希望XX偏移小一点 (toItem.pos.w - (toItem.pos.w / sensitivity)) 减去是因为和左移相反，扣除左移距离left部分便能和toItem中形成轴对称点
                //     container.engine.move(dragItem, toItem.i)
                // } else if (dragItem.pos.y > toItem.pos.y && (toItem.pos.y - 1 + (toItem.pos.h - (toItem.pos.h * container.sensitivity)) >= moveBoundaryY)) {
                //     // 上移动   希望XX偏移大一点
                //     container.engine.exchange(dragItem, toItem)
                // } else if (dragItem.pos.y < toItem.pos.y && (toItem.pos.y - 1 + (toItem.pos.h * container.sensitivity) <= moveBoundaryY)) {
                //     // 下移动  希望XX偏移小一点
                //     container.engine.exchange(dragItem, toItem)
                // }
                //------------------------------------------------------------------------------------//

            }, 36),
            mousemoveFromClone: (ev) => {
                //  对drag克隆元素的操作
                // ev.stopPropagation()
                const mousedownEvent = tempStore.mousedownEvent
                const fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                if (mousedownEvent === null || fromItem === null) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                const container = parseContainer(ev)
                // console.log(dragItem);
                dragItem.__temp__.dragging = true
                if (tempStore.cloneElement === null) {
                    tempStore.cloneElement = dragItem.element.cloneNode(true)
                    tempStore.cloneElement.classList.add('grid-clone-el', 'grid-dragging-clone-el')
                    document.body.appendChild(tempStore.cloneElement)    // 直接添加到body中后面定位省心省力
                    dragItem.addClass('grid-dragging-source-el')
                    dragItem.updateStyle({
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
                dragItem.updateStyle({
                    left: left + 'px',
                    top: top + 'px',
                }, tempStore.cloneElement)
            }
        }
    }

    static _eventPerformer = {
        item: {
            mouseenter: (ev) => {   // 主要用于处理跨Container中的Item互换,和其他事件不同的是这里fromItem 和 toItem 可能来自不同容器
                ev.stopPropagation()
                // console.log(111111111111111);
                const container = parseContainer(ev)
                if (!container) return
                if (ev.target._gridItem_) {
                    tempStore.toItem = parseItem(ev)
                }
                if (tempStore.toItem === null) return false
            }
        },
        other: {
            updateSlidePageInfo: throttle((pageX, pageY) => {
                tempStore.slidePageOffsetInfo.newestPageX = pageX
                tempStore.slidePageOffsetInfo.newestPageY = pageY
                // console.log(1111111111111);
            }),
            slidePage: (ev) => {
                // 拖拽滑动整个容器元素
                const container = tempStore.fromContainer
                if (!container) return
                if (!container.slidePage) return
                const element = container.element
                let offsetX = ev.pageX - tempStore.mousedownEvent.pageX
                let offsetY = ev.pageY - tempStore.mousedownEvent.pageY
                const offsetLeft = tempStore.slidePageOffsetInfo.offsetLeft - offsetX
                const offsetTop = tempStore.slidePageOffsetInfo.offsetTop - offsetY
                if (offsetLeft >= 0) element.scrollLeft = offsetLeft
                if (offsetTop >= 0) element.scrollTop = offsetTop
                EPF.other.updateSlidePageInfo(ev.pageX, ev.pageY)
            }
        },
        container: {
            mousedown: (ev) => {
                if (tempStore.isDragging || tempStore.isResizing) return  // 修复可能鼠标左键按住ItemAA，鼠标右键再次点击触发ItemB造成dragItem不一致问题
                const container = parseContainer(ev)
                if (!container) return   // 只有点击Container或里面元素才生效
                tempStore.fromItem = parseItem(ev)
                if (!container && !tempStore.fromItem) return
                if (tempStore.fromItem && !tempStore.fromItem.static) EEF.cursor.mousedown()
                else if (container && !tempStore.fromItem && !ev.touches) {
                    EEF.cursor.mousedown()
                    tempStore.slidePageOffsetInfo = {
                        offsetTop: container.element.scrollTop,
                        offsetLeft: container.element.scrollLeft,
                        newestPageX: 0,
                        newestPageY: 0,
                    }
                    tempStore.dragOrResize = 'slidePage'
                }
                // 执行到这行container一定存在,可能点击container或者Item，Item用于操作Item，container用于拖动整个container元素
                const downTagClassName = ev.target.className
                tempStore.mouseDownElClassName = downTagClassName
                if (downTagClassName.includes('grid-clone-el')) return
                if (downTagClassName.includes('grid-item-close-btn')) return
                if (downTagClassName.includes('grid-item-resizable-handle')) {   //   用于resize
                    tempStore.dragOrResize = 'resize'
                    if (tempStore.fromItem) tempStore.fromItem.__temp__.resizeLock = true

                } else if (tempStore.fromItem) {    //  用于drag
                    if (!tempStore.fromItem.container.responsive) {  // 静态布局下如果pos中是要求static则取消该Item的drag
                        if (tempStore.fromItem.static) return
                    }
                    const fromItem = tempStore.fromItem
                    if ((fromItem.dragIgnoreEls || []).length > 0) {    // 拖拽触发元素的黑名单
                        let isAllowDrag = true
                        for (let i = 0; i < fromItem.dragIgnoreEls.length; i++) {
                            const cssOrEl = fromItem.dragIgnoreEls[i]
                            if (cssOrEl instanceof Element) {
                                if (ev.target === cssOrEl) isAllowDrag = false
                            } else if (typeof cssOrEl === 'string') {
                                const queryList = fromItem.element.querySelectorAll(cssOrEl)
                                Array.from(queryList).forEach(node => {
                                    if (ev.path.includes(node)) isAllowDrag = false
                                })
                            }
                            if (isAllowDrag === false) return
                        }
                    }
                    if ((fromItem.dragAllowEls || []).length > 0) {    // 拖拽触发元素的白名单
                        let isAllowDrag = false
                        for (let i = 0; i < fromItem.dragAllowEls.length; i++) {
                            const cssOrEl = fromItem.dragAllowEls[i]
                            if (cssOrEl instanceof Element) {
                                if (ev.target === cssOrEl) {
                                    isAllowDrag = true
                                    break
                                }
                            } else if (typeof cssOrEl === 'string') {
                                const queryList = fromItem.element.querySelectorAll(cssOrEl)
                                Array.from(queryList).forEach(node => {
                                    if (ev.path.includes(node)) isAllowDrag = true
                                })
                            }
                        }
                        if (isAllowDrag === false) return
                    }

                    tempStore.dragOrResize = 'drag'
                    if (tempStore.fromItem.__temp__.dragging) return
                    const fromEl = tempStore.fromItem.element.getBoundingClientRect()
                    tempStore.mousedownItemOffsetLeft = ev.pageX - (fromEl.left + window.scrollX)
                    tempStore.mousedownItemOffsetTop = ev.pageY - (fromEl.top + window.scrollY)
                }
                //----------------------------------------------------------------//
                tempStore.isLeftMousedown = true
                tempStore.mousedownEvent = ev
                tempStore.fromContainer = container
                EEF.check.resizeOrDrag(ev)

                if (tempStore.fromItem) {
                    // tempStore.fromItem._mask_(true)
                    tempStore.fromItem.__temp__.clientWidth = tempStore.fromItem.nowWidth()
                    tempStore.fromItem.__temp__.clientHeight = tempStore.fromItem.nowHeight()
                    tempStore.offsetPageX = tempStore.fromItem.offsetLeft()
                    tempStore.offsetPageY = tempStore.fromItem.offsetTop()
                }
                //----------------------------------------------------------------//
            },
            mousemove: throttle((ev) => {
                // const container = parseContainer(ev)
                const containerArea = parseContainerAreaElement(ev)
                const container = parseContainerFromPrototypeChain(containerArea)
                const overItem = parseItem(ev)
                if (tempStore.isLeftMousedown) {
                    tempStore.beforeContainerArea = tempStore.currentContainerArea
                    tempStore.currentContainerArea = containerArea || null
                    tempStore.beforeContainer = tempStore.currentContainer
                    tempStore.currentContainer = container || null
                    if (tempStore.currentContainerArea !== null && tempStore.beforeContainerArea !== null) {   // 表示进去了某个Container内
                        if (tempStore.currentContainerArea !== tempStore.beforeContainerArea) {
                            // 从相邻容器移动过去，旧容器 ==>  新容器
                            // console.log(tempStore.beforeContainer, tempStore.currentContainer);
                            EEF.moveOuterContainer.leaveToEnter(tempStore.beforeContainer, tempStore.currentContainer)
                        }
                    } else {
                        if (tempStore.currentContainerArea !== null || tempStore.beforeContainerArea !== null) {
                            if (tempStore.beforeContainerArea === null) {
                                // 非相邻容器中的网页其他空白元素移进来某个容器中
                                EEF.moveOuterContainer.mouseenter(null, tempStore.currentContainer)
                            }
                            if (tempStore.currentContainerArea === null) {
                                EEF.moveOuterContainer.mouseleave(null, tempStore.beforeContainer)
                            }
                        }
                    }
                    if (tempStore.dragOrResize === 'slidePage') {
                        EPF.other.slidePage(ev)
                        return
                    }
                    // console.log(tempStore.dragOrResize);
                    const mousedownDragCursor = () => {
                        // 鼠标按下状态的样式
                        // console.log(container);
                        if (!container) {
                            if (EEF.cursor.cursor !== 'no-drop') EEF.cursor.notDrop()  // 容器外
                        } else if (container) {
                            if (container.responsive) {
                                // 拖动中的样式，这里只写的响应式，静态模式拖动中的逻辑在交换算法那里
                                if (EEF.cursor.cursor !== 'mousedown') EEF.cursor.mousedown()
                            } else if (!container.responsive) {
                                // if (!overItem) { }
                            }
                        }
                    }
                    if (tempStore.isDragging) {
                        EEF.itemDrag.mousemoveFromClone(ev)   // 控制drag克隆移动
                        mousedownDragCursor()
                    } else if (tempStore.isResizing) {
                        EEF.itemResize.doResize(ev)
                    }
                } else {
                    // 鼠标抬起状态的样式
                    if (overItem) {
                        const evClassList = ev.target.classList
                        if (evClassList.contains('grid-item-close-btn')) {
                            if (EEF.cursor.cursor !== 'item-close') EEF.cursor.itemClose()
                        } else if (evClassList.contains('grid-item-resizable-handle')) {
                            if (EEF.cursor.cursor !== 'item-resize') EEF.cursor.itemResize()
                        } else if (overItem.static && container && !container.responsive) {
                            if (EEF.cursor.cursor !== 'static-no-drop') EEF.cursor.staticItemNoDrop()   // 静态模式才notDrop
                        } else {
                            if (EEF.cursor.cursor !== 'in-container') EEF.cursor.inContainer()
                        }
                    } else if (parseContainer(ev)) {
                        if (EEF.cursor.cursor !== 'in-container') EEF.cursor.inContainer()
                    } else if (EEF.cursor.cursor !== 'default') EEF.cursor.default()
                }
            }, 12),
            mouseup: (ev) => {
                const container = parseContainer(ev)
                if (tempStore.isResizing) EEF.itemResize.mouseup(ev)
                // if (tempStore.isDragging) EEF.itemDrag.mouseup(ev)

                if (container && EEF.cursor.cursor !== 'in-container') EEF.cursor.inContainer()
                const fromItem = tempStore.fromItem
                const dragItem = tempStore.moveItem ? tempStore.moveItem : tempStore.fromItem

                //----------移除Drag或者Resize创建的克隆备份-------------//
                if (tempStore.cloneElement !== null) {   //  清除对Item拖动或者调整大小产生的克隆对象
                    let timer = null
                    const gridCloneEls = document.querySelectorAll('.grid-clone-el')
                    //------------------进行拖动归位延时动画执行和执行完毕后移除克隆元素--------------------//
                    //   动画的执行方案来自拖拽指定的Item中transition信息(和Item间交换共用规则)，包括time和field设置都能改变这边回流动画的方式和规则
                    for (let i = 0; i < gridCloneEls.length; i++) {
                        const gridCloneEl = gridCloneEls[i]
                        if (dragItem.transition) {
                            const containerElOffset = dragItem.container.contentElement.getBoundingClientRect()
                            if (tempStore.isDragging) {
                                let left = window.scrollX + containerElOffset.left + dragItem.offsetLeft()
                                let top = window.scrollY + containerElOffset.top + dragItem.offsetTop()
                                dragItem.updateStyle({
                                    transitionProperty: `${dragItem.transition.field}`,
                                    transitionDuration: `${dragItem.transition.time}ms`,
                                    width: `${dragItem.nowWidth()}px`,
                                    height: `${dragItem.nowHeight()}px`,
                                    left: `${left}px`,
                                    top: `${top}px`
                                }, gridCloneEl)
                            } else if (tempStore.isResizing) {
                                dragItem.updateStyle({
                                    transitionProperty: `${dragItem.transition.field}`,
                                    transitionDuration: `${dragItem.transition.time}ms`,
                                    width: `${dragItem.nowWidth()}px`,
                                    height: `${dragItem.nowHeight()}px`,
                                    left: `${dragItem.offsetLeft()}px`,
                                    top: `${dragItem.offsetTop()}px`
                                }, gridCloneEl)
                            }
                        }

                        function removeCloneEl() {
                            dragItem.removeClass('grid-dragging-source-el', 'grid-resizing-source-el')
                            try {    // 拖拽
                                gridCloneEl.parentNode.removeChild(gridCloneEl)
                            } catch (e) {
                            }
                            dragItem.__temp__.dragging = false
                            fromItem.__temp__.dragging = false
                            clearTimeout(timer)
                            timer = null
                        }

                        if (dragItem.transition) {
                            timer = setTimeout(removeCloneEl, dragItem.transition.time)
                        } else removeCloneEl()
                    }
                }
                //  清除Item限制操作的遮罩层
                const maskList = document.querySelectorAll('.grid-item-mask')
                for (let i = 0; i < maskList.length; i++) {
                    const maskEl = maskList[i]
                    maskEl.parentElement.removeChild(maskEl)
                }

                //--------------------------点击关闭按钮-----------------------------//
                const downTagClassName = tempStore.mouseDownElClassName
                if (downTagClassName && downTagClassName.includes('grid-item-close-btn')) {
                    const target = ev.touchTarget ? ev.touchTarget : ev.target
                    if (target.classList.contains('grid-item-close-btn')) {
                        const evItem = parseItem(ev)
                        if (evItem === tempStore.fromItem) evItem.remove(true)
                    }
                }

                //--------------------------------------------------------------------------//
                const dragFromContainer = tempStore.moveContainer ? tempStore.moveContainer : tempStore.fromContainer
                if (dragFromContainer) {
                    dragFromContainer.__ownTemp__.firstEnterUnLock = false  // 当前已经进入的Container鼠标在里面抬起
                    dragFromContainer.__ownTemp__.exchangeLock = false
                    dragFromContainer.__ownTemp__.beforeOverItems = []
                    dragFromContainer.__ownTemp__.moveCount = 0
                    if (tempStore.fromContainer && dragFromContainer !== tempStore.fromContainer) {
                        tempStore.fromContainer.__ownTemp__.firstEnterUnLock = false
                    }
                }

                //-------------------------更新所有相关操作的容器布局---------------------------//
                if (fromItem) {
                    fromItem.container.engine.updateLayout(true)
                    // resize下操作有包含内嵌容器的外部Item
                    const resizeIncludeNestedContainer = fromItem.container
                    const childContainers = resizeIncludeNestedContainer.childContainer
                    childContainers.forEach((info) => {
                        if (info.nestingItem === fromItem) {
                            info.container.engine.updateLayout(true)   // 更新内部内嵌的Item
                        }
                    })
                }
                if (fromItem && dragItem.container !== fromItem.container) {
                    dragItem?.container.engine.updateLayout(true)
                }
                //-----------------------------------事件---------------------------------//

                if (dragItem) {
                    if (tempStore.isDragging) {
                        dragItem.container.eventManager._callback_('itemMoved', dragItem.pos.x, dragItem.pos.y, dragItem)
                    }
                    if (tempStore.isResizing) {
                        dragItem.container.eventManager._callback_('itemResized', dragItem.pos.w, dragItem.pos.h, dragItem)
                    }
                }

                if (tempStore.isLeftMousedown) {
                    if (tempStore.dragOrResize === 'slidePage') {
                        const sPFI = tempStore.slidePageOffsetInfo
                        const offsetLeft = sPFI.newestPageX - ev.pageX
                        const offsetTop = sPFI.newestPageY - ev.pageY
                        // 实现container在鼠标释放之后惯性滑动
                        let timeCont = 500
                        const container = tempStore.fromContainer
                        if (container.slidePage && (offsetTop >= 20 || offsetLeft >= 20)) {
                            let timer = setInterval(() => {
                                timeCont -= 20
                                container.element.scrollTop += parseInt((((offsetTop / 100 * timeCont) / 30) || 0).toString())
                                container.element.scrollLeft += parseInt((((offsetLeft / 100 * timeCont) / 30) || 0).toString())
                                if (timeCont <= 0 || tempStore.isLeftMousedown) {
                                    clearInterval(timer)
                                    timer = null
                                }
                            }, 20)
                        }
                    }
                }


                //-------------------------------重置相关缓存-------------------------------//
                if (tempStore.fromItem) tempStore.fromItem.__temp__.resizeLock = false
                tempStore.fromContainer = null
                tempStore.moveContainer = null
                tempStore.dragContainer = null
                tempStore.beforeContainerArea = null
                tempStore.currentContainerArea = null
                tempStore.cloneElement = null
                tempStore.fromItem = null
                tempStore.toItem = null
                tempStore.moveItem = null
                tempStore.offsetPageX = null
                tempStore.offsetPageY = null
                tempStore.isDragging = false
                tempStore.isResizing = false
                tempStore.isLeftMousedown = false
                tempStore.dragOrResize = null
                tempStore.mousedownEvent = null
                tempStore.mousedownItemOffsetLeft = null
                tempStore.mousedownItemOffsetTop = null
                tempStore.mouseDownElClassName = null
                tempStore.exchangeItems = {
                    new: null,
                    old: null
                }
            },
            touchstartOrMousedown: (ev) => {
                // touch 和 drag效果是一样的
                ev = ev || window.event
                if (ev.touches) {
                    if (ev.stopPropagation) ev.stopPropagation()
                    tempStore.deviceEventMode = 'touch'
                    ev = singleTouchToCommonEvent(ev)
                } else tempStore.deviceEventMode = 'mouse'
                if (tempStore.deviceEventMode === 'touch') {
                    tempStore.allowTouchMoveItem = false
                    const container = parseContainer(ev)
                    document.addEventListener('contextmenu', EEF.prevent.contextmenu)  // 禁止长按弹出菜单
                    const pressTime = container ? container.pressTime : 360  // 长按多久响应拖动事件，默认360ms
                    tempStore.timeOutEvent = setTimeout(() => {
                        tempStore.allowTouchMoveItem = true
                        EPF.container.mousemove(ev)   // 触屏模式下只为了触发生成克隆元素
                        let timer = setTimeout(() => {
                            document.removeEventListener('contextmenu', EEF.prevent.contextmenu)
                            clearTimeout(timer)
                            timer = null
                        }, 600)
                        clearTimeout(tempStore.timeOutEvent)
                    }, pressTime)
                }
                EPF.container.mousedown(ev)
            },
            touchmoveOrMousemove: (ev) => {
                ev = ev || window.event
                if (ev.touches) {
                    // console.log(ev.cancelable);
                    tempStore.deviceEventMode = 'touch'
                    if (tempStore.allowTouchMoveItem) {
                        if (ev.preventDefault) ev.preventDefault()
                    } else {
                        clearTimeout(tempStore.timeOutEvent)
                        return
                    }
                    ev = singleTouchToCommonEvent(ev)
                } else tempStore.deviceEventMode = 'mouse'
                if (ev.stopPropagation) ev.stopPropagation()
                // console.log(ev);
                // parseContainer(ev)

                EEF.itemDrag.mousemoveFromItemChange(ev)
                EPF.container.mousemove(ev)
            },
            touchendOrMouseup: (ev) => {
                ev = ev || window.event
                if (ev.touches) {
                    clearTimeout(tempStore.timeOutEvent)
                    tempStore.allowTouchMoveItem = false
                    tempStore.deviceEventMode = 'touch'
                    ev = singleTouchToCommonEvent(ev)
                    document.removeEventListener('contextmenu', EEF.prevent.contextmenu)
                } else tempStore.deviceEventMode = 'mouse'
                EPF.container.mouseup(ev)    // 根据浏览器事件特性，触屏模式下快读点击情况下mouseup和touchend都会执行该函数，所以这里会执行两次但是不影响基本功能
            }
        },
    }

    static startEventFromItem(item) {
        // item.element.addEventListener('mouseenter', EPF.item.mouseenter)
    }

    static removeEventFromItem(item) {
        // item.element.removeEventListener('mouseenter', EPF.item.mouseenter)
    }


    /** 事件委托  */
    static startEventFromContainer(container) {

    }

    static removeEventFromContainer(container) {
    }

    static startGlobalEvent() {
        //-----------------------------事件委托(debug注销这里可选排查问题出因)------------------------------//
        //mouseenter该事件监听在静态布局模式下必要，解决了拖拽以超慢进入另一个容器mousemove未触发进入事件导致源容器成员未卸载,新容器未挂载问题
        // touchcancel
        // 这四个事件原本委托在Container上，但是单个Item编辑的时候会造成不生效，所以就挂document上了
        document.addEventListener('mousedown', EPF.container.touchstartOrMousedown)
        document.addEventListener('touchstart', EPF.container.touchstartOrMousedown, {passive: false})

        // document.addEventListener('dragstart', EEF.prevent.false)
        // document.addEventListener('selectstart', EEF.prevent.false)

        //-------------------------------原来的必须挂dom上的事件-----------------------------//
        document.addEventListener('mousemove', EPF.container.touchmoveOrMousemove)
        document.addEventListener('touchmove', EPF.container.touchmoveOrMousemove, {passive: false})

        document.addEventListener('mouseup', EPF.container.touchendOrMouseup)
        document.addEventListener('touchend', EPF.container.touchendOrMouseup, {passive: false})

        document.addEventListener('mouseleave', EEF.windowResize.setResizeFlag)
        document.addEventListener('mouseenter', EEF.windowResize.removeResizeFlag)

    }

    static removeGlobalEvent() {
        document.removeEventListener('mousedown', EPF.container.touchstartOrMousedown)
        document.removeEventListener('touchstart', EPF.container.touchstartOrMousedown)

        // document.removeEventListener('dragstart', EEF.prevent.false)
        // document.removeEventListener('selectstart', EEF.prevent.false)

        //-----------------------------------------------------------------------------//
        document.removeEventListener('mousemove', EPF.container.touchmoveOrMousemove)
        document.removeEventListener('touchmove', EPF.container.touchmoveOrMousemove)

        document.removeEventListener('mouseup', EPF.container.touchendOrMouseup)
        document.removeEventListener('touchend', EPF.container.touchendOrMouseup)

        document.removeEventListener('mouseleave', EEF.windowResize.setResizeFlag)
        document.removeEventListener('mouseenter', EEF.windowResize.removeResizeFlag)
    }

    static startEvent(container = null, item = null) {
        // if (container) EditEvent.startEventFromContainer(container)
        if (tempStore.editItemNum === 0) {
            EditEvent.startGlobalEvent()
        }
        if (item) {
            EditEvent.startEventFromItem(item)
        }
    }

    static removeEvent(container = null, item = null) {
        if (item) {
            if (!item.draggable && !item.resize) EditEvent.removeEventFromItem(item)
        }
        // if (container) EditEvent.removeEventFromContainer(container)
        if (tempStore.editItemNum === 0) {
            EditEvent.removeGlobalEvent()
        }
    }
}

const EEF = EditEvent._eventEntrustFunctor
const EPF = EditEvent._eventPerformer





