import {cloneDeep, merge, parseContainer, parseItem, throttle} from "@/units/grid/other/tool.js";
import {defaultStyle} from "@/units/grid/style/defaultStyle.js";
import TempStore from "@/units/grid/other/TempStore.js";
import Item from "@/units/grid/Item.js";
import Sync from "@/units/grid/other/Sync.js";
import ItemPos from "@/units/grid/ItemPos.js";

const tempStore = TempStore.containerStore


export default class EditEvent {

    /** 用于事件委托触发的函数集  */
    static _eventEntrustFunctor = {
        itemResize: {
            doResize: throttle((ev) => {
                const mousedownEvent = tempStore.mousedownEvent
                const isLeftMousedown = tempStore.isLeftMousedown
                const fromItem = tempStore.fromItem
                if (fromItem === null || mousedownEvent === null || !isLeftMousedown) return
                // console.log('doResize');

                if (tempStore.cloneElement === null) {
                    tempStore.cloneElement = fromItem.element.cloneNode(true)
                    tempStore.cloneElement.classList.add('grid-clone-el')
                    if (tempStore.cloneElement) tempStore.fromContainer.element.appendChild(tempStore.cloneElement)
                    fromItem.updateStyle({transition: 'none'}, tempStore.cloneElement)
                    fromItem.updateStyle({opacity: tempStore.fromContainer.style.opacity})
                }
                //-----------------判断Item是左右平移还是上下平移---------------------//
                const resized = {
                    w: Math.ceil(tempStore.cloneElement.clientWidth / (fromItem.size[0] + fromItem.margin[0])) || 1,
                    h: Math.ceil(tempStore.cloneElement.clientHeight / (fromItem.size[1] + fromItem.margin[1])) || 1,
                }
                if (!fromItem.container.responsive) {
                    //  静态模式下对resize进行重置范围的限定，如果resize超过容器边界或者压住其他静态成员，直接打断退出resize过程
                    fromItem.pos.nextStaticPos = merge(new ItemPos(fromItem.pos), resized)
                    const nextPos = fromItem.container.engine._isCanAddItemToContainer_(fromItem, false, false)
                    fromItem.pos.nextStaticPos = null
                    if (nextPos === null) return    // 超出边界或者压住其他成员会返回null，等同于该判断函数确定没空位情况下返回的null
                }
                merge(fromItem.pos, resized)
                const pos = fromItem.pos
                //----------------检测改变的大小是否符合用户限制 -------------//
                if ((resized.w + fromItem.pos.x) > pos.col) fromItem.pos.w = pos.col - pos.x + 1    //item调整大小时在容器右边边界超出时进行限制
                if (pos.w < pos.minW) fromItem.pos.w = pos.minW
                if (pos.w > pos.maxW && pos.maxW !== Infinity) fromItem.pos.w = pos.maxW
                if (pos.h < pos.minH) fromItem.pos.h = pos.minH
                if (pos.h > pos.maxH && pos.maxH !== Infinity) fromItem.pos.h = pos.maxH
                //---------------------resize 增减长宽结束--------------//
                // console.log(this.minWidth(),this.minHeight(),this.maxWidth(),this.maxHeight());
                fromItem.pos.temporaryStatic = true    // 使其变成静态不会在调整中被动态改变x,y照成错位，调整后即刻改了回来
                // console.log(fromItem.__temp__.clientWidth ,fromItem.__temp__.clientHeight);
                let width = ev.pageX - mousedownEvent.pageX + fromItem.__temp__.clientWidth
                let height = ev.pageY - mousedownEvent.pageY + fromItem.__temp__.clientHeight
                // console.log(ev.target,width,height);
                if (width > fromItem.maxWidth()) width = fromItem.maxWidth()
                if (height > fromItem.maxHeight()) height = fromItem.maxHeight()
                if (width < fromItem.minWidth()) width = fromItem.minWidth()
                if (height < fromItem.minHeight()) height = fromItem.minHeight()
                // console.log(width,height);
                fromItem.updateStyle({
                    width: width + 'px',
                    height: height + 'px',
                }, tempStore.cloneElement)

                if (fromItem.__temp__.resized.w !== resized.w || fromItem.__temp__.resized.h !== resized.h) { // 只有改变Item的大小才进行style重绘
                    fromItem.__temp__.resized = resized
                    fromItem.updateStyle(fromItem._genLimitSizeStyle())
                    tempStore.fromContainer.updateLayout()
                }
            }, 15),
            mouseup: (ev) => {
                const fromItem = tempStore.fromItem
                if (fromItem === null) return
                //----------------------------------------//
                fromItem.__temp__.clientWidth = fromItem.nowWidth()
                fromItem.__temp__.clientHeight = fromItem.nowHeight()
                fromItem.updateStyle(fromItem._genItemStyle())
                tempStore.isLeftMousedown = false
                tempStore.fromContainer.engine.updateLayout()
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
                }
            }
        },
        cursor: {
            cursor: 'grab',
            grab: function (ev) {
                const container = parseContainer(ev)
                if (!container) return
                container.updateStyle({cursor: 'grab'}, document.body, true)
                this.cursor = 'grab'
            },
            grabbing: function (ev) {
                const container = parseContainer(ev)
                if (!container) return
                container.updateStyle({cursor: 'grabbing'}, document.body, true)
                this.cursor = 'grabbing'
            },
        },
        prevent: {
            default: (ev) => ev.preventDefault(),
            false: (ev) => false,
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
                //------------固定顺序-------------//
                fromItem._mask_(false)    //  相邻清除遮罩防止遮挡嵌套容器内的Item操作
                tempStore.crossContainerItem = true   // 和 mouseenter 同代码同效果
                this.mouseleave(null, fromContainer)

                if (dragItem.container === toContainer) {
                    tempStore.fromContainer = toContainer
                    return
                }
                if (toContainer.isNesting) {   //  修复快速短距重复拖放情况下概率识别成父容器移动到子容器当Item的情况
                    if (toContainer.parentItem === dragItem
                        || toContainer.parentItem.element === dragItem.element) {
                        return;
                    }
                }
                this.mouseenter(null, toContainer)
                //  如果现在点击嵌套容器空白部分选择的Item会是父容器的Item,按照mouseenter逻辑对应不可能删除当前Item(和前面一样是fromItem)在插入
                //  接上:因为这样是会直接附加在父级Container最后面，这倒不如什么都不做直接等待后面逻辑执行换位功能

            },
            mouseenter: function (ev, container = null) {
                if (!container && ev.target._isGridContainer_) {
                    ev.preventDefault()
                    container = ev.target._gridContainer_
                }
                if (!tempStore.isDragging || !container || !tempStore.isLeftMousedown) return
                let fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                if (dragItem.container === container) return   // 非常必要，防止嵌套拖动容器互相包含

                container.__ownTemp__.firstEnterLock = false
                tempStore.moveContainer = container
            },
            mouseleave: function (ev, container = null) {
                let fromItem = tempStore.fromItem
                let moveItem = tempStore.moveItem
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem

                // if (!tempStore.isDragging || fromItem === null || !container || !tempStore.isLeftMousedown) return
                // dragItem.container.engine.updateLayout([dragItem])
                tempStore.crossContainerItem = true   // 和 mouseenter 同代码同效果

                // if (container && container.isNesting) {  //  如果是个嵌套Item   离开该嵌套后该嵌套Item重置到可以进行
                //     //动态交换 === false   不可动态交换 === true    // 这里取舍选了不可
                //     // container.parentItem.pos.static = !container.nestedOutExchange
                // }
            },
            mouseup: (ev) => {   //  容器之间交换Item用
                const container = parseContainer(ev)
                tempStore.moveItem = null
                if (container && container.isNesting) {
                    container.parentItem.pos.temporaryStatic = false

                }
            }
        },
        itemDrag: {
            mouseup: (ev) => {   //  移动经过小于一个容器用，容器内或者容器外鼠标抬起恢复原状
                const container = parseContainer(ev)
                let fromItem = tempStore.fromItem
                if (!container) return
                if (container !== tempStore.fromContainer) fromItem = tempStore.moveItem
                tempStore.isLeftMousedown = false
                fromItem?.updateStyle(defaultStyle.itemDragUp)
                tempStore.mousedownEvent = null
            },
            mousemoveExchange: (ev) => {
                let container = parseContainer(ev)
                // if (!container && ev.target._isGridContainer_) {
                //     ev.preventDefault()
                //     container = ev.target._gridContainer_
                // }
                // console.log(container);
                // if (container && container.isNesting ) {    //  如果是个嵌套Item   进来后该嵌套Item设置成不动
                //     container.parentItem.pos.static = true
                // }
                let fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                if (!tempStore.isDragging || fromItem === null || !container || !tempStore.isLeftMousedown) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                let dragContainer = tempStore.moveContainer !== null ? tempStore.moveContainer : tempStore.fromContainer
                // if (fromItem.container === container) return
                if (!fromItem.container.exchange || !container.exchange) return
                tempStore.crossContainerItem = true   // 进入Container时  moveItem为null，此时指定告诉这是第一次进入，下一次的Item换位使用移动到鼠标位置Item前而不是两两交换
                try {
                    dragItem.pos.el = null   // 要将原本pos中的对应文档清除掉换克隆后的
                    let dragItemElement = fromItem.element
                    // console.log(333333333333333333);
                    dragItem.unmount()  // 先成功移除原来容器中Item后再在新容器新添加Item，移除不成功不添加
                    dragItem.remove()
                    const newItem = new Item({
                        ...dragItem.pos,
                        name: dragItem.name,
                        draggable: dragItem.draggable,
                        resize: dragItem.resize,
                        follow: dragItem.follow,
                        transition: dragItem.transition,
                        el: dragItemElement,
                    })
                    container.add(newItem)
                    container.__ownTemp__.firstEnterLock = true
                    // console.log(dragItem.pos,newItem.pos);
                    // for (let i = 0; i < container.engine.layoutManager._layoutMatrix.length; i++) {
                    //     console.log(container.engine.layoutManager._layoutMatrix[i]);
                    // }

                    if (container) {
                        if (!container.responsive) {
                            // console.log('newItem');
                            newItem.container.engine.updateLayout([newItem])
                            // newItem.pos.__temp__._autoOnce = false
                            // 指定在第一次进入其他容器的时候指定动态寻找空位进行坐下，engine会进行实际处理，详情看updateLayout函数
                            if (dragItem.container !== newItem.container) dragItem.container.engine.updateLayout([dragItem])
                            // newItem.pos.__temp__._autoOnce = false
                        } else {
                            console.log('newItem');
                            newItem.container.engine.updateLayout()
                            // newItem.container.engine.updateLayout([newItem])
                            // dragItem.container.engine.updateLayout([dragItem])
                        }
                    }  // dragItem会跟随进入不同容器，每次离开刷新
                    newItem.mount()
                    dragItem.element.style.backgroundColor = 'red'
                    tempStore.moveItem = newItem
                } catch (e) {
                    console.log(e);
                }

            },
            mousemoveFromItemChange: throttle((ev) => {   // 通过move事件检测是否进入该Item，这里不用DomMouseenterEvent是因为只能触发一次，这里希望触发多次
                ev.stopPropagation()
                if (!tempStore.isDragging) return
                let fromItem = tempStore.fromItem
                let toItem = parseItem(ev)
                if (toItem) tempStore.toItem = toItem
                const moveItem = tempStore.moveItem
                const mousedownEvent = tempStore.mousedownEvent
                if (fromItem === null || mousedownEvent === null || !tempStore.isLeftMousedown) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                const container = parseContainer(ev) || dragItem.container
                // console.log(container,container.parentItem,dragItem);
                if (container.parentItem && container.parentItem === dragItem) return
                if (!container.responsive) {//静态
                    if (toItem !== undefined && !container.isNesting) return  //只有undefined说明底下是没有其他成员的,isNesting是响应嵌套容器的拖动
                }
                // offsetDragItemX 和 offsetDragItemY 是换算跨容器触发比例，比如大Item到小Item容器换成小Item容器的拖拽触发尺寸
                const offsetDragItemX = tempStore.mousedownItemOffsetLeft * (container.size[0] / tempStore.fromContainer.size[0])
                const offsetDragItemY = tempStore.mousedownItemOffsetTop * (fromItem.size[1] / tempStore.fromContainer.size[1])
                // console.log(offsetDragItemX,offsetDragItemY);
                const dragEl = dragItem.container.element.getBoundingClientRect()
                // Item距离容器的px
                const offsetLeftPx = ev.pageX - offsetDragItemX - (window.scrollX + dragEl.left)
                const offsetTopPx = ev.pageY - offsetDragItemY - (window.scrollY + dragEl.top)
                // console.log(offsetLeftPx,offsetTopPx);

                const pxToGridPosW = (offsetLeftPx) => {
                    const w = (offsetLeftPx + container.margin[0]) / (container.size[0] + container.margin[0])
                    if (w + dragItem.pos.w >= container.containerW ) {
                        return container.containerW  - dragItem.pos.w + 1
                    } else return Math.round(w) + 1
                }
                const pxToGridPosH = (offsetTopPx) => {
                    const h = (offsetTopPx + container.margin[1]) / (container.size[1] + container.margin[1])
                    // console.log(h);
                    if (h + dragItem.pos.h >= container.containerH ) {
                        return container.containerH  - dragItem.pos.h + 1
                    } else return Math.round(h) + 1
                }

                const nowMoveWidth = pxToGridPosW(offsetLeftPx)
                const nowMoveHeight = pxToGridPosH(offsetTopPx)
                // console.log(nowMoveWidth,nowMoveHeight);
                const responsiveLayoutAlgorithm = () => {
                    // 响应式Item交换算法
                    //------计算鼠标的移动速度，太慢不做操作(保留该注释，后面可能会使用属性sensitivity)-----------//
                    // if (toItem === null) return
                    let startY, startX
                    let now = Date.now()
                    startX = ev.screenX
                    startY = ev.screenY
                    const mouseSpeed = () => {
                        let dt = now - tempStore.mouseSpeed.timestamp;
                        let distanceX = Math.abs(startX - tempStore.mouseSpeed.endX);
                        let distanceY = Math.abs(startY - tempStore.mouseSpeed.endY);
                        let distance = distanceX > distanceY ? distanceX : distanceY   //  选一个移动最多的方向
                        let speed = Math.round(distance / dt * 1000);
                        // console.log(dt, distance, speed);
                        tempStore.mouseSpeed.endX = startX;
                        tempStore.mouseSpeed.endY = startY;
                        tempStore.mouseSpeed.timestamp = now;
                        return {distance, speed}
                    }
                    //------对移动速度和距离做出限制,某个周期内移动速度太慢或距离太短忽略本次移动------//
                    const {distance,speed} = mouseSpeed()
                    if (container.size[0] < 30 || container.size[1] < 30) {
                        if (distance < 3) return
                    } else if (container.size[0] < 60 || container.size[1] < 60) {
                        if (distance < 7) return
                    } else if (distance < 10 || speed < 10) return
                    if (dragItem === null) return
                    if (container.isNesting) {    //  如果是个嵌套Item  移动进去被嵌套容器后该嵌套容器所在的父级Item变成静态,知道鼠标抬起释放
                        container.parentItem.pos.temporaryStatic = container.parentItem !== tempStore.fromItem
                    }
                    if (container.__ownTemp__.exchangeLock === true) return

                    //-----------找到dragItem当前移动覆盖的Item位置，取左上角第一个设定成toItem-------------//
                    const nextPos = {
                        x: nowMoveWidth < 1 ? 1 : nowMoveWidth,
                        y: nowMoveHeight < 1 ? 1 : nowMoveHeight,
                        w: dragItem.pos.w,
                        h: dragItem.pos.h,
                    }

                    const innerContentArea = ()=>{
                        // 在响应式流Items覆盖区域内的交换
                        if (!toItem && !dragItem.follow) return
                        const rangeLimitItems = container.engine.findCoverItemFromPosition(nextPos.x, nextPos.y, nextPos.w, nextPos.h)
                        if (rangeLimitItems.length > 0){
                            let updateItems = rangeLimitItems.filter(item => dragItem !== item)
                            toItem = updateItems[0]
                        }
                    }

                    const outerContentArea = ()=>{
                        // 在响应式流Items覆盖区域外的检测，为了使得鼠标拖拽超出Items覆盖区域后dragItem还能跟随鼠标位置在流区域进行移动或交换
                        // 说人话就是实现dragItem在鼠标超出边界还能跟随鼠标位置移动到边界
                        const rangeLimitItems = container.engine.findResponsiveItemFromPosition(nextPos.x, nextPos.y, nextPos.w, nextPos.h)
                        if (!rangeLimitItems) return
                        toItem = rangeLimitItems
                    }
                    // console.log(dragItem.follow)
                    if (dragItem.follow){
                        if (toItem) innerContentArea()
                        else outerContentArea()
                    }else innerContentArea()

                    if (!toItem) return
                    const fromItemPosInfo = dragItem.element.getBoundingClientRect()
                    const proportionX = Math.abs(ev.pageX - fromItemPosInfo.left - tempStore.mousedownItemOffsetLeft) / toItem.element.clientWidth
                    const proportionY = Math.abs(ev.pageY - fromItemPosInfo.top - tempStore.mousedownItemOffsetTop) / toItem.element.clientHeight
                    const xOrY = proportionX > proportionY

                    if (Math.abs(proportionX - proportionY) < 0.45) return
                    if (proportionX > 0.1 && proportionY > 0.1 && proportionX < 0.9 && proportionY < 0.9) return

                    //-------------------修复移动高频toItem和dragItem高速互换闪烁限制----------------------//
                    // console.log(dragItem,toItem);
                    // if (dragItem === toItem ) container.__ownTemp__.exchangeLock = false
                    const contLimit = 3   //  设定限制连续不间断经过某个Item几次后执行休息
                    const beforeOverItems = container.__ownTemp__.beforeOverItems
                    let continuousOverCount = 0  // 连续经过toItem计数,超过三次休息，解决移动时候Item连续快速交换的闪烁问题
                    for (let i = 0; i < beforeOverItems.length; i++) {
                        if (i >= 3) break
                        if (beforeOverItems[i] === toItem) continuousOverCount++
                    }
                    if (continuousOverCount >= contLimit) {
                        container.__ownTemp__.exchangeLock = true
                        setTimeout(() => {
                            container.__ownTemp__.exchangeLock = false
                        }, 200)
                    } else if (beforeOverItems.length < contLimit && toItem.draggable) {   // 前contLimit(默认是上面的3个)个连续反应时间为toItem.transition.time
                        if (toItem.transition && toItem.transition.time) {
                            container.__ownTemp__.exchangeLock = true
                            setTimeout(() => {
                                container.__ownTemp__.exchangeLock = false
                            }, toItem.transition.time)
                        }
                    }

                    if (dragItem !== toItem) {
                        container.__ownTemp__.beforeOverItems.unshift(toItem)
                        if (beforeOverItems.length > 20) container.__ownTemp__.beforeOverItems.pop()  // 最多保存20个经过的Item
                    }
                    //-----------------------------------------------------------------------------//
                    // dragItem.pos.nextStaticPos = new ItemPos(dragItem.pos)
                    // dragItem.pos.nextStaticPos.x = nowMoveWidth < 1 ? 1 : nowMoveWidth  // 栅格索引最低1
                    // dragItem.pos.nextStaticPos.y = nowMoveHeight < 1 ? 1 : nowMoveHeight
                    // console.log(dragItem.pos.x,dragItem.pos.y,'',toItem.pos.x,toItem.pos.y);

                    // if (container.isNesting) {    //  如果是个嵌套Item  移动进去被嵌套容器后该嵌套容器所在的父级Item变成静态,直到鼠标抬起释放
                    //     container.parentItem.pos.temporaryStatic = container.parentItem !== tempStore.fromItem
                    // }


                    if (!container.__ownTemp__.firstEnterLock) {
                        // 跨容器交换
                        console.log('mousemoveExchange');
                        EEF.itemDrag.mousemoveExchange(ev)
                        // tempStore.dragContainer = container
                    } else {
                        // 同容器成员间交换方式
                        if (container.responseMode === 'default') {
                            if (xOrY) {  // X轴
                                container.engine.move(dragItem, toItem.i)
                            } else { // Y轴
                                container.engine.exchange(dragItem, toItem)
                            }
                        } else if (container.responseMode === 'stream') {
                            container.engine.move(dragItem, toItem.i)
                        }else if (container.responseMode === 'exchange') {
                            container.engine.exchange(dragItem, toItem)
                        }
                        container.engine.updateLayout()
                    }
                }
                const staticLayoutAlgorithm = () => {
                    // 静态布局的Item交换算法
                    if (!dragItem.follow && !parseContainer(ev)) return     // 静态模式设定不跟随且移动到容器之外不进行算法操作
                    if (container.isNesting) {    //  如果是个嵌套Item  移动进去被嵌套容器后该嵌套容器所在的父级Item变成静态,直到鼠标抬起释放
                        container.parentItem.pos.temporaryStatic = container.parentItem !== tempStore.fromItem
                    }
                    dragItem.pos.nextStaticPos = new ItemPos(dragItem.pos)
                    dragItem.pos.nextStaticPos.x = nowMoveWidth < 1 ? 1 : nowMoveWidth  // 栅格索引最低1
                    dragItem.pos.nextStaticPos.y = nowMoveHeight < 1 ? 1 : nowMoveHeight

                    // console.log(container.__ownTemp__.firstEnterLock);
                    if (container.engine._isCanAddItemToContainer_(dragItem, false, false)) {  // 静态纯检测
                        // console.log(container.__ownTemp__.firstEnterLock);
                        if (!container.__ownTemp__.firstEnterLock) {
                            EEF.itemDrag.mousemoveExchange(ev)
                            tempStore.dragContainer = container
                        } else container.engine.updateLayout([dragItem])
                    }
                }
                Sync.run(() => {
                    //  判断使用的是静态布局还是响应式布局并执行响应的算法
                    if (container.responsive) responsiveLayoutAlgorithm()
                    else staticLayoutAlgorithm()
                })


                //------判断Item是左右平移还是上下平移的算法，二分过半判断(初始算法，不如简单版来的实在，留着或许以后有用)------//
                // console.log('move');
                // let left
                // let top
                // if (tempStore.fromContainer === toItem.container) {
                //     left = ev.pageX - mousedownEvent.pageX + tempStore.offsetPageX
                //     top = ev.pageY - mousedownEvent.pageY + tempStore.offsetPageY
                // } else {
                //     left = ev.pageX - container.element.offsetLeft
                //     top = ev.pageY - container.element.offsetTop
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
            mousemoveFromClone: (ev) => {    //  对drag克隆元素的操作
                ev.stopPropagation()
                const mousedownEvent = tempStore.mousedownEvent
                const fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                if (mousedownEvent === null || fromItem === null) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                const container = dragItem.container
                dragItem.__temp__.dragging = true
                if (tempStore.cloneElement === null) {
                    tempStore.cloneElement = dragItem.element.cloneNode(true)
                    tempStore.cloneElement.classList.add('grid-clone-el')
                    document.body.appendChild(tempStore.cloneElement)    // 直接添加到body中后面定位省心省力
                    dragItem.updateStyle({opacity: (container?.style.opacity )})
                    dragItem.updateStyle({
                        pointerEvents: 'none',
                        transform: container?.style.transform,
                        transitionProperty: 'none',
                        transitionDuration: 'none',
                        opacity:'1',
                    }, tempStore.cloneElement)
                }
                let left = ev.pageX - tempStore.mousedownItemOffsetLeft
                let top = ev.pageY - tempStore.mousedownItemOffsetTop

                if (!container.dragOut){   // 限制是否允许拖动到容器之外
                    const containerElOffset = container.element.getBoundingClientRect()
                    const limitLeft = window.scrollX + containerElOffset.left
                    const limitTop = window.scrollY  + containerElOffset.top
                    const limitRight = window.scrollX + containerElOffset.left +  container.element.clientWidth - dragItem.nowWidth()
                    const limitBottom = window.scrollY  + containerElOffset.top + container.element.clientHeight - dragItem.nowHeight()
                    if (left < limitLeft) left = limitLeft
                    if (left > limitRight) left = limitRight
                    if (top < limitTop) top = limitTop
                    if (top > limitBottom) top = limitBottom
                }
                dragItem.updateStyle({
                    left: left + 'px',
                    top: top + 'px',
                    zIndex: '9999',
                }, tempStore.cloneElement)
            }
        }
    }

    static _eventPerformer = {
        item: {
            mouseenter: (ev) => {   // 主要用于处理跨Container中的Item互换,和其他事件不同的是这里fromItem 和 toItem 可能来自不同容器
                ev.stopPropagation()
                // console.log(ev);
                const container = parseContainer(ev)
                const toItem = tempStore.toItem
                if (!container) return
                if (ev.target._gridItem_) {
                    // const toContainer = ev.target._gridItem_.container   // 可能是自己，也可能是其他容器
                    tempStore.toItem = parseItem(ev)
                }
                if (tempStore.toItem === null) return false
                // if (tempStore.isDragging) EEF.itemDrag.mouseenter(ev)
            },
            onanimationend(ev) {
                console.log(ev);
            }

        },
        container: {
            mousedown: (ev) => {
                ev.stopPropagation()
                if (tempStore.isDragging || tempStore.isResizing) return  // 修复可能鼠标左键按住ItemAA，鼠标右键再次点击触发ItemB造成dragItem不一致问题
                const container = parseContainer(ev)
                // if (ev.target._isGridContainer_) return  //所有的操作只对于Item生效，Container只有装在Item中才能被拖动或者重置大小

                // if (!container) return
                // console.log(ev);
                const downTagClassName = ev.target.className
                if (downTagClassName === 'grid-clone-el') return
                if (downTagClassName === 'resizable-handle') {   //   用于resize
                    tempStore.dragOrResize = 'resize'
                    for (let i = 0; i < container.engine.items.length; i++) {
                        if (container.engine.items[i]._resizeTabEl === ev.target) {
                            tempStore.fromItem = container.engine.items[i]
                            break
                        }
                    }
                } else {    //  用于drag
                    tempStore.dragOrResize = 'drag'
                    tempStore.fromItem = parseItem(ev)
                    // tempStore.fromItem.dragging = true
                    if (!tempStore.fromItem) return
                    if (tempStore.fromItem.__temp__.dragging) return
                    const fromEl =  tempStore.fromItem.element.getBoundingClientRect()
                    tempStore.mousedownItemOffsetLeft = ev.pageX - (fromEl.left + window.scrollX)
                    tempStore.mousedownItemOffsetTop = ev.pageY - (fromEl.top + window.scrollY)
                }
                //----------------------------------------------------------------//

                tempStore.isLeftMousedown = true
                tempStore.mousedownEvent = ev
                // console.log(ev);
                tempStore.fromContainer = container
                // console.log(container);
                if (tempStore.fromItem) {
                    tempStore.fromItem._mask_(true)
                    tempStore.fromItem.__temp__.clientWidth = tempStore.fromItem.nowWidth()
                    tempStore.fromItem.__temp__.clientHeight = tempStore.fromItem.nowHeight()
                    tempStore.offsetPageX = tempStore.fromItem.offsetLeft()
                    tempStore.offsetPageY = tempStore.fromItem.offsetTop()
                    if (EEF.check.resizeOrDrag(ev) === 'drag') {
                        EEF.cursor.grabbing(ev)
                    }
                    clearInterval(timeOutEvent)
                }
                //----------------------------------------------------------------//
            },
            mousemove: throttle((ev) => {
                ev.stopPropagation()
                // console.log(this.__store__.isLeftMousedown);
                EEF.check.resizeOrDrag(ev)
                const container = parseContainer(ev)
                tempStore.beforeContainer = tempStore.currentContainer
                tempStore.currentContainer = container || null
                if (tempStore.isLeftMousedown) {
                    if (tempStore.currentContainer !== null && tempStore.beforeContainer !== null) {   // 表示进去了某个Container内
                        if (tempStore.currentContainer !== tempStore.beforeContainer) {
                            EEF.moveOuterContainer.leaveToEnter(tempStore.beforeContainer, tempStore.currentContainer)
                        }
                    } else {
                        if (tempStore.currentContainer !== null || tempStore.beforeContainer !== null) {
                            if (tempStore.currentContainer === null) {
                                // EEF.moveOuterContainer.mouseleave(null, tempStore.beforeContainer)
                            }
                            if (tempStore.beforeContainer === null) {
                                // EEF.moveOuterContainer.mouseenter(null, tempStore.currentContainer)
                            }
                        }
                    }
                    // console.log(tempStore.dragOrResize);
                    if (tempStore.isDragging) {
                        if (EEF.cursor.cursor !== 'grabbing') EEF.cursor.grabbing(ev)  //  加判断为了禁止css重绘
                        EEF.itemDrag.mousemoveFromClone(ev)   // 控制drag克隆移动
                    } else if (tempStore.isResizing) {
                        EEF.itemResize.doResize(ev)
                    }
                } else {
                    if (EEF.cursor.cursor !== 'grab') EEF.cursor.grab(ev)
                }
            }, 10),
            mouseleave: (ev) => {
                ev.stopPropagation()
                const container = parseContainer(ev)
                if (!container) return
                if (ev.target === container.element) {
                }
                // console.log(ev);
                if (tempStore.isResizing) EEF.itemResize.mouseup(ev)
                // if (this.__store__.isDragging) EEF.itemDrag.mouseleave(ev)
            },
            mouseup: (ev) => {
                const container = parseContainer(ev)
                if (tempStore.isResizing) EEF.itemResize.mouseup(ev)
                if (tempStore.isDragging) {
                    EEF.itemDrag.mouseup(ev)
                    EEF.moveOuterContainer.mouseup(ev)
                }
                if (EEF.cursor.cursor !== 'grab') EEF.cursor.grab(ev)
                //----------移除Drag或者Resize创建的克隆备份-------------//
                const fromItem = tempStore.fromItem
                const dragItem = tempStore.moveItem ? tempStore.moveItem : tempStore.fromItem
                if (container) container.engine.updateLayout()
                fromItem?.container.engine.updateLayout()
                if (tempStore.cloneElement !== null) {   //  清除对Item拖动或者调整大小产生的克隆对象
                    const gridCloneEls = document.querySelectorAll('.grid-clone-el')
                    //------------------进行拖动归位延时动画执行和执行完毕后移除克隆元素--------------------//
                    //   动画的执行方案来自拖拽指定的Item中transition信息(和Item间交换共用规则)，包括time和field设置都能改变这边回流动画的方式和规则
                    for (let i = 0; i < gridCloneEls.length; i++) {
                        const gridCloneEl = gridCloneEls[i]
                        if (dragItem.transition) {
                            const containerElOffset = dragItem.container.element.getBoundingClientRect()
                            if (tempStore.isDragging) {
                                dragItem.updateStyle({
                                    transitionProperty: `${dragItem.transition.field}`,
                                    transitionDuration: `${dragItem.transition.time}ms`,
                                    left: `${window.scrollX + containerElOffset.left + dragItem.offsetLeft()}px`,
                                    top: `${window.scrollY + containerElOffset.top + dragItem.offsetTop()}px`,
                                }, gridCloneEl)
                                dragItem.updateStyle({
                                    opacity: `${dragItem.container.style.opacity}`
                                })
                            } else if (tempStore.isResizing) {
                                dragItem.updateStyle({
                                    transitionProperty: `${dragItem.transition.field}`,
                                    transitionDuration: `${dragItem.transition.time}ms`,
                                    width: `${dragItem.nowWidth()}px`,
                                    height: `${dragItem.nowHeight()}px`,
                                    left: `${dragItem.offsetLeft()}px`,
                                    top: `${dragItem.offsetTop()}px`,
                                }, gridCloneEl)
                            }
                        }
                        function removeCloneEl() {
                            dragItem.updateStyle({ opacity: '1' })
                            try {    // 拖拽
                                gridCloneEl.parentNode.removeChild(gridCloneEl)
                            } catch (e) {
                            }
                            dragItem.__temp__.dragging = false
                        }
                        if (dragItem.transition) {
                            // dragItem.updateStyle({ opacity: '0' })
                            setTimeout(removeCloneEl, dragItem.transition.time)
                        } else removeCloneEl()
                    }
                }
                //  清除Item限制操作的遮罩层
                const maskList = document.querySelectorAll('.item-mask')
                for (let i = 0; i < maskList.length; i++) {
                    const maskEl = maskList[i]
                    maskEl.parentElement.removeChild(maskEl)
                }
                //------------------------------//
                // tempStore.fromItem._mask_(false)
                if (tempStore.fromContainer) tempStore?.fromContainer.updateStyle(tempStore?.fromContainer.genContainerStyle())
                //------------------------------//
                clearInterval(timeOutEvent)
                if (container && container.isNesting) {
                    container.parentItem.pos.temporaryStatic = false
                }
                // if (dragItem) dragItem.dragging = false
                const dragFromContainer =  dragItem ? dragItem.container : container
                if (dragFromContainer) {
                    dragFromContainer.__ownTemp__.firstEnterLock = true
                    dragFromContainer.__ownTemp__.exchangeLock = false
                    dragFromContainer.__ownTemp__.beforeOverItems = []
                    dragFromContainer.__ownTemp__.moveCount = 0
                    if (tempStore.fromContainer && dragFromContainer !== tempStore.fromContainer) {
                        tempStore.fromContainer.__ownTemp__.firstEnterLock = true
                    }
                }
                tempStore.fromContainer = null
                tempStore.dragContainer = null
                tempStore.beforeContainer = null
                tempStore.currentContainer = null
                tempStore.crossContainerItem = false
                tempStore.draggingLock = false
                tempStore.cloneElement = null
                tempStore.fromItem = null
                tempStore.toItem = null
                tempStore.offsetPageX = null
                tempStore.offsetPageY = null
                tempStore.isDragging = false
                tempStore.isResizing = false
                tempStore.isLeftMousedown = false
                tempStore.dragOrResize = null
                tempStore.mousedownEvent = null
                tempStore.mousedownItemOffsetLeft = null
                tempStore.mousedownItemOffsetTop = null
                if (dragItem) dragItem.pos.temporaryStatic = false
            }
        },
    }

    static startEventFromItem(item) {
        item.element.addEventListener('mouseenter', EPF.item.mouseenter)
    }

    static removeEventFromItem(item) {
        item.element.removeEventListener('mouseenter', EPF.item.mouseenter)
    }


    /** 事件委托  */
    static startEventFromContainer(container) {
        //-----------------------------事件委托(debug注销这里可选排查问题出因)------------------------------//
        container.element.addEventListener('mousedown', EPF.container.mousedown)
        //mouseenter该事件监听在静态布局模式下必要，解决了拖拽以超慢进入另一个容器mousemove未触发进入事件导致源容器成员未卸载,新容器未挂载问题
        container.element.addEventListener('mouseenter', EEF.moveOuterContainer.mouseenter)
        container.element.addEventListener('dragstart', EEF.prevent.default)
        container.element.addEventListener('selectstart', EEF.prevent.default)
        //--------------------------------------------------------------------------------------------//
    }

    static removeEventFromContainer(container) {
        container.element.removeEventListener('mousedown', EPF.container.mousedown)
        container.element.removeEventListener('mouseenter', EEF.moveOuterContainer.mouseenter)
        container.element.removeEventListener('dragstart', EEF.prevent.default)
        container.element.removeEventListener('selectstart', EEF.prevent.default)

    }

    static startGlobalEvent() {
        document.addEventListener('mousemove', EPF.container.mousemove)
        document.addEventListener('mouseup', EPF.container.mouseup)
        document.addEventListener('mouseleave', EPF.container.mouseleave)
        document.addEventListener('mousemove', EEF.itemDrag.mousemoveFromItemChange)

    }

    static removeGlobalEvent() {
        document.removeEventListener('mousemove', EPF.container.mousemove)
        document.removeEventListener('mouseup', EPF.container.mouseup)
        document.removeEventListener('mouseleave', EPF.container.mouseleave)
        document.removeEventListener('mousemove', EEF.itemDrag.mousemoveFromItemChange)


    }

    static startEvent(container = null, item = null, eventRecord = {}) {
        if (container) EditEvent.startEventFromContainer(container)
        if (tempStore.editModeItemDragNum === 0 && tempStore.editModeItemResizeNum === 0) {
            EditEvent.startGlobalEvent()
        }
        if (item) {
            if (item.__temp__.eventRunning === false) EditEvent.startEventFromItem(item)
            if (eventRecord.draggable) tempStore.editModeItemDragNum++
            if (eventRecord.resize) tempStore.editModeItemResizeNum++
        }
    }

    static removeEvent(container = null, item = null, eventRecord = {}) {
        if (item) {
            if (!item.draggable && !item.resize) EditEvent.removeEventFromItem(item)
            if (!eventRecord.draggable && eventRecord.draggable !== null) {   // 也不知道防止什么，反正就是特殊情况
                if (tempStore.editModeItemDragNum >= 0) tempStore.editModeItemDragNum--
            }
            if (!eventRecord.resize && eventRecord.resize !== null) {
                if (tempStore.editModeItemResizeNum >= 0) tempStore.editModeItemResizeNum--
            }
        }

        if (container) EditEvent.removeEventFromContainer(container)
        if (tempStore.editModeItemDragNum === 0 && tempStore.editModeItemResizeNum === 0) {
            EditEvent.removeGlobalEvent()
        }
    }

}


const EEF = EditEvent._eventEntrustFunctor
const EPF = EditEvent._eventPerformer
let timeOutEvent





