import {merge} from "@/units/grid/other/tool.js";

/**  Container实例化的时候可以在Layout配置中使用的字段 */
export default class LayoutInstantiationField {
    //----------------实例化传进的的参数---------------------//
    className = 'grid-container'  // Container在文档中默认的类名,可以由外部传入重新自定义
    responsive = false     //  responsive:  默认为static静态布局,值等于true为响应式布局
    responseMode = 'default'  // default(上下左右交换) || exchange(两两交换) || stream(左部压缩排列)
    data = []   // 当前布局使用的数据
    col = null
    row = null    //  响应模式下如果溢出指定效果是和maxRow一样的，如果未溢出按实际占用row计算
    margin = [null, null]
    marginX = null    //  如果和margin[0]优先级大于 marginX
    marginY = null    //  如果和margin[1]优先级大于 marginY
    size = [null, null]   //size[1]如果不传入的话长度将和size[1]一样
    sizeWidth = null    //  如果和size[0]优先级大于 sizeWidth
    sizeHeight = null   //  如果和size[1]优先级大于 sizeHeight
    minCol = null
    maxCol = null
    minRow = null  // 最小行数 只是容器高度，未和布局算法挂钩,由engine配置，和算法通信同步
    maxRow = null  // 最大行数 只是容器高度，未和布局算法挂钩,由engine配置，和算法通信同步

    autoGrowRow = true // 响应式下resize自动撑开Row
    // autoGrowCol = true     // 暂未支持

    ratioCol = 0.1    // (该ratioCol生效能实现铺满col方向)只有col的情况下(margin和size都没有指定)margin和size自动分配margin/size的比例 1:1 ratio值为1
    ratioRow = 0.1    // (该ratioRow生效能实现铺满row方向)只有row的情况下(margin和size都没有指定)......
    followScroll = true  // 是否在有上层滚动盒子包裹住容器的时候拖动到容器边缘时进行自动滚动
    sensitivity = 0.45   //  拖拽移动的灵敏度，表示每秒移动X像素触发交换检测,这里默认每秒36px   ## 不稳定性高，自用
    itemLimit = {} // 单位栅格倍数{minW,maxW,minH,maxH} ,接受的Item大小限制,同样适用于嵌套Item交换通信,建议最好在外部限制
    exchange = false
    pressTime = 360   // 触屏下长按多久响应拖拽事件,默认360ms
    scrollWaitTime = 800   // 当Item移动到容器边缘，等待多久进行自动滚动,默认800ms
    scrollSpeedX = null    // 当Item移动到容器边缘，自动滚动每36ms 的X轴速度,单位是px,默认为null
    scrollSpeedY = null    // 当Item移动到容器边缘，自动滚动每36ms 的Y轴速度,单位是px,默认为null
    resizeReactionDelay = 200    // 当Container元素大小改变时检测是否切换其他符合px限制的layout所用的时间间隔
    slidePage = true    // 点击container的空白处是否能拖拽进行滑动容器
    nestedOutExchange = false   //  如果是嵌套页面，从嵌套页面里面拖动出来Item是否立即允许该被嵌套的容器参与响应布局,true是允许，false是不允许,参数给被嵌套容器
    //------------------------------------------------------//
    constructor(config = {}) {
        merge(this, config)
    }
}
