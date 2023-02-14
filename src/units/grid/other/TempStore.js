/**  用于Container之间数据临时缓存和共享,不计划挂载到window对象
 *   使用该Store的对象：Container，EditEvent
 * */
export default class TempStore {
    static ins = false
    static store = {
        //----------只读变量-----------//
        screenWidth: null,  // 用户屏幕宽度
        screenHeight: null,  // 用户屏幕高度
        // editModeItemDragNum:0,   // 记录当前开启drag的Item个数
        // editModeItemResizeNum:0, // 记录当前开启resize的Item个数
        //----------通用可写变量-----------//
        editItemNum: 0,   // 当前处于编辑模式的Item个数
        belongContainer: null,
        fromContainer: null,    //  当前Item的初始来源
        dragContainer: null,    //  当前Item拖动多次跨容器后的最新所处容器位置来源
        draggingLock: false,    // 拖动限制锁
        currentContainer: null,  //  当前鼠标在哪个Container
        beforeContainer: null,  //  来自上一个的Container
        currentContainerArea: null,  //  当前鼠标在哪个Container容器域名
        beforeContainerArea: null,  //  来自上一个的Container容器域名
        fromItem: null,    // 表示在Container中的鼠标初次按下未抬起的Item, 除Item类型外的元素不会被赋值到这里
        toItem: null,      // 表示在Container中的鼠标按下后抬起的正下方位置的Item, 除Item类型外的元素不会被赋值到这里
        moveItem: null,   // 多容器情况下，移动出去到新容器新创建的一个符合新容器Item参数的成员,非克隆元素而是参与排列的元素
        exchangeItems: {
            old:null,
            new:null
        },   // 跨容器时保存对应的新老Item
        cloneElement: null,      // 表示在用户拖动点击拖动的瞬间克隆出来的文档
        mousedownEvent: null,   //  鼠标点击瞬间mousedown触发的对应的dom元素触发的事件
        mousedownItemOffsetLeft: null,  // 鼠标点击某个Item的时候距离该Item左边界距离
        mousedownItemOffsetTop: null,  // 同上
        dragOrResize: null,  //  drag || resize || slidePage
        isDragging: false,
        isResizing: false,
        dragItemTrans: null,
        resizeWidth: null,
        resizeHeight: null,
        offsetPageX: null,
        offsetPageY: null,
        scrollReactionStatic: 'stop',  // stop || wait || scroll  鼠标移动到容器边界自动滚动状态
        scrollReactionTimer: null,   // 鼠标移动到容器边界自动滚动反应的定时器
        //----------鼠标相关-----------//
        isLeftMousedown: false,
        mouseDownElClassName: null,
        mouseSpeed: {
            timestamp: 0,
            endX: 0,
            endY: 0
        },
        slidePageOffsetInfo: {
            offsetTop: 0,
            offsetLeft: 0,
            newestPageX:0,
            newestPageY:0,
        },
        isWindowResize:true,  // 弃用可删除
        //----------触屏相关-----------//
        deviceEventMode: 'mouse',   //   mouse || touch
        allowTouchMoveItem: false,   // 是否允许触屏下拖动Item
        timeOutEvent: null,
        //----------网页元素-----------//
        nestingMountPointList: [],  // 网页挂载点
    }
    static ItemStore = {}

    constructor() {
    }

    static getInstance() {
        if (!TempStore.ins) {
            TempStore.ins = new TempStore()
            TempStore.ins = true
        }
        return TempStore
    }
}
