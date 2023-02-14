import ErrorTypeIndex from "@/units/grid/events/errorType/ErrorTypeIndex.js";

/** 允许的事件名称及其作用
 *  error(err)                                             所有非阻断式错误都能在这里接受处理,如果未设定该函数取接受异常将直接将错误抛出到控制台
 *  containerMounted(container)                            Container成功挂载事件
 *  containerUnmounted(container)                          Container成功卸载事件
 *  itemMounted(item)                                      item成功挂载事件
 *  itemUnmounted(item)                                    item成功卸载事件
 *  addItemSuccess(item)                                   item添加成功事件
 *  itemClosing(item)                                      item关闭前事件,返回null或者false将会阻止关闭该Item
 *  itemClosed(item)                                       item关闭后事件
 *  itemResizing(item,w,h)                                 item每次大小被改变时
 *  itemResized(item,w,h)                                  item在鼠标抬起后在容器中的最终大小
 *  itemMoving(item,nowX,nowY)                             item拖动时在容器内所属位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
 *  itemMoved(item,nowX,nowY)                              item拖动结束时在容器内最终位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
 *  itemMovePositionChange(oldX,oldY,newX,newY)            item位置变化时响应的事件,只有位置变化才触发
 *  crossContainerExchange(oldItem,newItem)                交换成功后oldItem会从原Container中卸载,而新Item将会自动添加进新容器中，无需手动添加，返回null或者false将会阻止该次交换
 *  autoScroll(container,direction,offset)                 鼠标移动到容器边界自动滚动时触发，direction是方向X或Y,offset是滚动距离，触发间隔36ms，
 *                                                         返回null或者false取消该次滚动，direction是方向, offset是滚动距离,负值为反方向滚动
 *                                                         可以返回 {direction,offset} 对象临时指定该次滚动的新参数,允许返回{direction}或{offset}修改单个值
 *  itemExchange(fromItem,toItem)                          响应式模式中自身容器中的Item交换，fromItem:来自哪个Item，toItem:要和哪个Item交换，返回null或者false将会阻止该次交换
 *  containerSizeChange(container,oldSize,newSize)         内层容器(grid-container)大小改变触发的事件,oldSize和newSize包含以下信息{ containerW,containerH,row,col,width,height }
 *  mountPointElementResizing(container,useLayout,containerWidth)  外层容器(挂载点元素)大小正在改变时触发的事件(如果是嵌套容器,只会等col和row改变才触发，效果和containerResized一样),
 *                                                         containerWidth是当前container的宽度，useLayout是当前使用的布局配置,使用的是实例化时传入的layout字段，
 *                                                         可以直接修改形参useLayout的值或者直接返回一个新的layout对象，框架将会使用该新的layout对象进行布局,返回null或者false将会阻止布局切换
 *                                                         可通过实例属性resizeReactionDelay控制触发间隔
 *  enterContainerArea(container,item)                     当前鼠标按下状态进入的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小
 *  leaveContainerArea(container,item)                     当前鼠标按下状态离开的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小
 *  colChange(col,preCol,container)                        col列数改变
 *  rowChange(row,preRow,container)                        row列数改变
 *
 * */
export default class EventCallBack {
    error = null
    warn = null
    // emitter = new Emitter()
    constructor(eventCB) {
        //  直接将外部传入的相关事件回调函数挂载到该类中进行管理
        Object.assign(this, eventCB)
    }

    /** 出现错误的回调钩子接口，所有的错误都能由error这个函数接受处理，如果外部没有传入error函数，将会直接抛出错误 */
    _errback_(errName, ...args) {
        if ((typeof this['error']) !== 'function') {
            throw new (ErrorTypeIndex.index(errName))
        } else {
            this.error.call(this.error, new (ErrorTypeIndex.index(errName)), ...args)
        }
    }

    /** 成功执行的回调钩子接口 */
    _callback_(cbName, ...args) {
        if (typeof this[cbName] === 'function') {
            return this[cbName](...args)
        }
    }

    /** 不会抛出错误中止执行，使用系统控制台的error方法，可附带对象参数 */
    _error_(errName, msg = '', fromData = '', ...args) {
        if ((typeof this['error']) === 'function') {
            this.error.call(this.error, {
                type : 'error',
                name: errName,
                msg: 'getErrAttr=>[name|type|msg|from]  ' + msg,
                from: fromData    //  来自哪个数据或者实例
            }, ...args)
        } else console.error(errName, msg  + '(你可以用error事件函数来接受处理该错误使其不在控制台显示)' , fromData)
    }

    /** 不会抛出错误中止执行，使用系统控制台的warn方法，可附带对象参数 */
    _warn_(warnName, msg = '', fromData = '', ...args) {
        if ((typeof this['warn']) === 'function') {
            this.warn.call(this.warn, {
                type : 'warn',
                name: warnName,
                msg: 'getWarnAttr=>[name|type|msg|from]  ' + msg,
                from: fromData    //  来自哪个数据或者实例
            }, ...args)
        } else console.warn(warnName, msg  + '(你可以用warn事件函数来接受处理或者忽略该警告使其不在控制台显示)' , fromData)
    }
}

