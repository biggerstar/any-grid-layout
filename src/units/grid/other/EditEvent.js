import {merge, parseContainer, parseItem, throttle} from "@/units/grid/other/tool.js";
import {defaultStyle} from "@/units/grid/style/defaultStyle.js";
import TempStore from "@/units/grid/other/TempStore.js";
import Item from "@/units/grid/Item.js";
import Sync from "@/units/grid/other/Sync.js";

const tempStore = TempStore.containerStore


export default class EditEvent {

    /** 用于事件委托触发的函数集  */
    static _eventEntrustFunctor = {
        itemResize: {
            doResize: throttle((ev) => {
                const mousedownEvent = tempStore.mousedownEvent
                const fromItem = tempStore.fromItem
                // if (ev.target === this.element) return
                if (fromItem === null || mousedownEvent === null) return
                // console.log('doResize');
                //----------------------------------------//
                // let offset = {  // 偏离鼠标 resize 的像素
                //     x: fromItem.element.offsetX + fromItem.__temp__.clientWidth,
                //     y: fromItem.element.offsetY + fromItem.__temp__.clientHeight
                // }
                // console.log(offset);
                // console.log(ev.target);

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
                fromItem.pos.static = true    // 使其变成静态不会在调整中被动态改变x,y照成错位，调整后即刻改了回来

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
                fromItem.pos.static = fromItem.__temp__.static
                fromItem.updateStyle(fromItem._genItemStyle())
                tempStore.isResizing = false
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
                    if (toContainer.parentItem === dragItem) return
                }
                this.mouseenter(null, toContainer)
                //  如果现在点击嵌套容器空白部分选择的Item会是父容器的Item,按照mouseenter逻辑对应不可能删除当前Item(和前面一样是fromItem)在插入
                //  接上:因为这样是会直接附加在父级Container最后面，这倒不如什么都不做直接等待后面逻辑执行换位功能

                // fromContainer.updateLayout()
                // toContainer.updateLayout()

            },
            mouseenter: function (ev, container = null) {
                // if (ev === null && container === null) return
                // console.log(container,tempStore.fromItem,tempStore.moveItem);
                if (!container && ev.target._isGridContainer_) {
                    ev.preventDefault()
                    container = ev.target._gridContainer_
                }
                console.log(container);
                // if (container && container.isNesting ) {    //  如果是个嵌套Item   进来后该嵌套Item设置成不动
                //     container.parentItem.pos.static = true
                // }
                let fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                if (!tempStore.isDragging || fromItem === null || !container) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem

                tempStore.crossContainerItem = true   // 进入Container时  moveItem为null，此时指定告诉这是第一次进入，下一次的Item换位使用移动到鼠标位置Item前而不是两两交换
                try {
                    dragItem.pos.el = null   // 要将原本pos中的对应文档清除掉换克隆后的
                    let dragItemElement = fromItem.element
                    dragItem.unmount()  // 先成功移除原来容器中Item后再在新容器新添加Item，移除不成功不添加
                    const newItem = new Item({
                        ...dragItem.pos,
                        draggable: dragItem.draggable,
                        resize: dragItem.resize,
                        el: dragItemElement,
                    })

                    container.add(newItem)
                    newItem.mount()
                    dragItem.element.style.backgroundColor = 'red'
                    dragItem.remove()
                    // console.log(container);
                    if (dragItem.container !== container) dragItem.container.engine.updateLayout()   // dragItem会跟随进入不同容器，每次离开刷新
                    tempStore.moveItem = newItem
                } catch (e) {
                }

            },
            mouseleave: function (ev, container = null) {
                // container = container ? container : parseContainer(ev)
                let fromItem = tempStore.fromItem
                if (!tempStore.isDragging || fromItem === null || !container) return
                tempStore.crossContainerItem = true   // 和 mouseenter 同代码同效果
                if (container && container.isNesting) {  //  如果是个嵌套Item   离开该嵌套后该嵌套Item重置到可以进行
                    //动态交换 === false   不可动态交换 === true    // 这里取舍选了不可
                    // container.parentItem.pos.static = !container.nestedOutExchange
                }
                container.engine.updateLayout()
            },
            mouseup: (ev) => {   //  容器之间交换Item用
                const container = parseContainer(ev)
                let fromItem = tempStore.fromItem
                tempStore.moveItem = null
                if (container && container.isNesting) {
                    container.parentItem.pos.static = false
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
                tempStore.isDragging = false
                fromItem?.updateStyle(defaultStyle.itemDragUp)
                container.engine.updateLayout()
            },
            mouseenter: throttle((ev) => {   // 通过move事件检测是否进入该Item，这里不用DomMouseenterEvent是因为只能触发一次，这里希望触发多次
                ev.stopPropagation()
                const container = parseContainer(ev)
                if (!container) return
                let fromItem = tempStore.fromItem
                const toItem = tempStore.toItem
                const moveItem = tempStore.moveItem
                const mousedownEvent = tempStore.mousedownEvent
                if (!tempStore.isDragging) return
                if (fromItem === null || toItem === null || mousedownEvent === null) return
                if (toItem === fromItem) return   // 克隆元素经过隔壁元素互换的时候动画过程概率会再fromItem触发经过鼠标造成两次触发该事件
                //------计算鼠标的移动速度，太慢不做操作(保留该注释，后面可能会使用属性sensitivity)-----------//
                let start, startY, startX
                let now = Date.now();
                startX = ev.screenX
                startY = ev.screenY
                let dt = now - tempStore.mouseSpeed.timestamp;
                let distanceX = Math.abs(startX - tempStore.mouseSpeed.endX);
                let distanceY = Math.abs(startY - tempStore.mouseSpeed.endY);
                let distance = distanceX > distanceY ? distanceX : distanceY   //  选一个移动最多的方向
                let speed = Math.round(distance / dt * 1000);
                // console.log(dt, distance, speed);
                tempStore.mouseSpeed.endX = startX;
                tempStore.mouseSpeed.endY = startY;
                tempStore.mouseSpeed.timestamp = now;
                if (container.size[0] < 30 || container.size[1] < 30) {
                    if (distance < 5) return
                } else if (distance < 20 || speed < 50) return
                else if (distance < ((container.size[0] > container.size[1] ? container.size[1] : container.size[0]) / 4)) return;

                if (!container.exchangeLock) {
                    if (container.isNesting) {    //  如果是个嵌套Item  移动进去被嵌套容器后该嵌套容器所在的父级Item变成静态,知道鼠标抬起释放
                        container.parentItem.pos.static = container.parentItem !== tempStore.fromItem
                    }
                    Sync.run(() => {
                        if (container.engine.items[toItem.i] === toItem) {
                            container.exchangeLock = true
                            setTimeout(() => {
                                container.exchangeLock = false
                            }, 150)
                        }
                        let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                        if (dragItem === null) return
                        if (tempStore.crossContainerItem) {   // 如果是第一次跨容器操作
                            container.engine.move(dragItem, toItem.i)
                            tempStore.crossContainerItem = false
                        } else {
                            container.engine.exchange(dragItem, toItem)
                        }
                        container.engine.updateLayout()
                    })
                }

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
                // console.log(left,top);
                // console.log(toItem.pos.x - 1 + (toItem.pos.w / container.sensitivity),moveBoundaryX);
                // if (dragItem.pos.x > toItem.pos.x && (toItem.pos.x - 1 + (toItem.pos.w - (toItem.pos.w * container.sensitivity)) >= moveBoundaryX)) {
                //     // 左移动,希望 toItem.pos.w / sensitivity等这种偏移大一点，越大越接近右边左移也更快，总体感觉就灵敏
                //     container.engine.move(dragItem, dragItem.i, toItem.i)
                // } else if (dragItem.pos.x < toItem.pos.x && (toItem.pos.x - 1 + (toItem.pos.w * container.sensitivity) <= moveBoundaryX)) {
                //     // 右移动 希望XX偏移小一点 (toItem.pos.w - (toItem.pos.w / sensitivity)) 减去是因为和左移相反，扣除左移距离left部分便能和toItem中形成轴对称点
                //     container.engine.move(dragItem, dragItem.i, toItem.i)
                // } else if (dragItem.pos.y > toItem.pos.y && (toItem.pos.y - 1 + (toItem.pos.h - (toItem.pos.h * container.sensitivity)) >= moveBoundaryY)) {
                //     // 上移动   希望XX偏移大一点
                //     container.engine.exchange(dragItem, toItem)
                // } else if (dragItem.pos.y < toItem.pos.y && (toItem.pos.y - 1 + (toItem.pos.h * container.sensitivity) <= moveBoundaryY)) {
                //     // 下移动  希望XX偏移小一点
                //     container.engine.exchange(dragItem, toItem)
                // }
                //------------------------------------------------------------------------------------//
            }, 150),
            mousemove: (ev) => {    //  对drag克隆元素的操作
                ev.stopPropagation()
                const container = parseContainer(ev)
                // if (!container) return
                const mousedownEvent = tempStore.mousedownEvent
                const fromItem = tempStore.fromItem
                const moveItem = tempStore.moveItem
                const fromContainer = tempStore.fromContainer
                // if (ev.target === this.element)  console.log(ev.target);
                if (mousedownEvent === null || fromItem === null) return
                let dragItem = tempStore.moveItem !== null ? moveItem : fromItem
                if (tempStore.cloneElement === null) {
                    tempStore.cloneElement = dragItem.element.cloneNode(true)
                    tempStore.cloneElement.classList.add('grid-clone-el')
                    document.body.appendChild(tempStore.cloneElement)    // 直接添加到body中后面定位省心省力
                    dragItem.updateStyle({opacity: (container?.style.opacity || '1')})
                    dragItem.updateStyle({
                        pointerEvents: 'none',
                        transform: container?.style.transform
                    }, tempStore.cloneElement)
                }
                // const left = ev.pageX - mousedownEvent.pageX + tempStore.offsetPageX
                // const top = ev.pageY - mousedownEvent.pageY + tempStore.offsetPageY
                // console.log(tempStore.cloneElement.style.transitionProperty,tempStore.cloneElement.style.transitionDuration);
                const left = ev.pageX - mousedownEvent.offsetX
                const top = ev.pageY - mousedownEvent.offsetY


                // console.log(ev.pageY ,mousedownEvent.offsetY);
                // console.log(left,top);
                // TODO  这里点击内嵌Item会无限增加高度
                dragItem.updateStyle({
                    left: left + 'px',
                    top: top + 'px',
                    zIndex: '9999',
                    // height: mousedownEvent.target.clientHeight + 'px',
                    // width: mousedownEvent.target.clientWidth + 'px',
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
                if (tempStore.isDragging) EEF.itemDrag.mouseenter(ev)
            },

        },
        container: {
            mousedown: (ev) => {
                // ev.stopPropagation()
                // console.log(this.__store__.fromItem );
                // timeOutEvent = setTimeout(() => {   //  监控长按事件
                //     clearTimeout(timeOutEvent)
                //     // console.log('长按了');
                // }, 0)
                // if (ev.target === this.element) console.log(ev.target);

                const container = parseContainer(ev)
                // if (!container) return
                const isHandleResize = ev.target.className === 'resizable-handle'
                if (isHandleResize) {   //   用于resize
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
                        tempStore.fromItem.animation(false)
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
                                EEF.moveOuterContainer.mouseleave(null, tempStore.beforeContainer)
                            }
                            if (tempStore.beforeContainer === null) {
                                EEF.moveOuterContainer.mouseenter(null, tempStore.currentContainer)
                            }
                        }
                    }
                    // console.log(tempStore.dragOrResize);
                    if (tempStore.isDragging) {
                        if (EEF.cursor.cursor !== 'grabbing') EEF.cursor.grabbing(ev)  //  加判断为了禁止css重绘
                        EEF.itemDrag.mousemove(ev)   // 控制drag克隆移动
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
                const toItem = tempStore.toItem
                if (tempStore.cloneElement !== null) {   //  清除对Item拖动或者调整大小产生的克隆对象
                    const gridCloneEls = document.getElementsByClassName('grid-clone-el')
                    for (let i = 0; i < gridCloneEls.length; i++) {
                        const gridCloneEl = gridCloneEls[i]
                        // 两个try是二选一,这样用try有问题吗? 有问题吗?  好知道了,没问题就好 -_-
                        try {
                            document.body.removeChild(gridCloneEl)
                        } catch (e) {
                        }
                        try {
                            tempStore.fromContainer.element.removeChild(tempStore.cloneElement)
                        } catch (e) {
                        }
                    }
                    tempStore.cloneElement = null
                    fromItem?.updateStyle({
                        opacity: '1'
                    })
                }
                //  清除Item限制操作的遮罩层
                const maskList = document.getElementsByClassName('item-mask')
                for (let i = 0; i < maskList.length; i++) {
                    const maskEl = maskList[i]
                    maskEl.parentElement.removeChild(maskEl)
                }
                if (container) container.engine.updateLayout()
                fromItem?.container.engine.updateLayout()
                //------------------------------//
                // tempStore.fromItem._mask_(false)
                if (fromItem?.transition) fromItem?.animation(fromItem.transition)
                if (tempStore.fromContainer) tempStore?.fromContainer.updateStyle(tempStore?.fromContainer.genContainerStyle())
                //------------------------------//
                clearInterval(timeOutEvent)
                if (container && container.isNesting) {
                    container.parentItem.pos.static = false
                }

                tempStore.fromContainer = null
                tempStore.cloneElement = null
                tempStore.fromItem = null
                tempStore.toItem = null
                tempStore.moveItem = null
                tempStore.dragItemTrans = null
                tempStore.offsetPageX = null
                tempStore.offsetPageY = null
                tempStore.isDragging = false
                tempStore.isResizing = false
                tempStore.isLeftMousedown = false
                tempStore.dragOrResize = null
                tempStore.mousedownEvent = null
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
        container.element.addEventListener('mousemove', EEF.itemDrag.mouseenter)

        // container.element.addEventListener('mouseenter', EEF.moveOuterContainer.mouseenter)
        // container.element.addEventListener('mouseleave', EEF.moveOuterContainer.mouseleave)

        // container.element.addEventListener('contextmenu', EPF.container.mouseup)

        container.element.addEventListener('dragstart', EEF.prevent.default)
        container.element.addEventListener('selectstart', EEF.prevent.default)
        //--------------------------------------------------------------------------------------------//
    }

    static removeEventFromContainer(container) {
        container.element.removeEventListener('mousedown', EPF.container.mousedown)
        container.element.removeEventListener('mousemove', EEF.itemDrag.mouseenter)

        // container.element.removeEventListener('mouseenter', EEF.moveOuterContainer.mouseenter)
        // container.element.removeEventListener('mouseleave', EEF.moveOuterContainer.mouseleave)

        // container.element.removeEventListener('contextmenu', EEF.prevent.false)

        container.element.removeEventListener('dragstart', EEF.prevent.default)
        container.element.removeEventListener('selectstart', EEF.prevent.default)

    }

    static startGlobalEvent() {
        document.addEventListener('mousemove', EPF.container.mousemove)
        document.addEventListener('mouseup', EPF.container.mouseup)
        document.addEventListener('mouseleave', EPF.container.mouseleave)
    }

    static removeGlobalEvent() {
        document.removeEventListener('mousemove', EPF.container.mousemove)
        document.removeEventListener('mouseup', EPF.container.mouseup)
        document.removeEventListener('mouseleave', EPF.container.mouseleave)

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





