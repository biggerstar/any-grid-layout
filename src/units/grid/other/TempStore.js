
/**  用于Container之间数据临时缓存和共享,不计划挂载到window对象
 *   使用该Store的对象：Container，EditEvent
 * */
export default class TempStore {
    static ins = false
    static containerStore = {
        //----------只读变量-----------//
        screenWidth: null,  // 用户屏幕宽度
        screenHeight: null,  // 用户屏幕高度
        editModeItemDragNum:0,
        editModeItemResizeNum:0,
        //----------可写变量-----------//
        belongContainer : null,
        isLeftMousedown: false,
        fromContainer:null,
        dragContainer:null,
        crossContainerItem : false,  // 当前操作的Item是否跨容器操作
        draggingLock: false,    // 拖动限制锁
        currentContainer : null,  //  当前鼠标在哪个Container
        beforeContainer : null,  //  来自上一个的Container
        fromItem: null,    // 表示在Container中的鼠标初次按下未抬起的Item, 除Item类型外的元素不会被赋值到这里
        toItem: null,      // 表示在Container中的鼠标按下后抬起的正下方位置的Item, 除Item类型外的元素不会被赋值到这里
        moveItem : null,   // 多容器情况下，移动出去到新容器新创建的一个符合新容器Item参数的成员,非克隆元素而是参与排列的元素
        beforeItem : null,   // 跨容器时保存的上一个Container对应的Item
        cloneElement: null,      // 表示在用户拖动点击拖动的瞬间克隆出来的文档
        mousedownEvent:null,   //  鼠标点击瞬间mousedown触发的对应的dom元素触发的事件
        mousedownItemOffsetLeft: null,  // 鼠标点击某个Item的时候距离该Item左边界距离
        mousedownItemOffsetTop: null,  // 同上
        dragOrResize: null,  //  drag || resize
        isDragging: false,
        isResizing: false,
        dragItemTrans: null,
        resizeWidth: null,
        resizeHeight: null,
        offsetPageX:null,
        offsetPageY:null,
        mouseSpeed: {
            timestamp: 0,
            endX: 0,
            endY: 0
        }
    }
    static ItemStore = {  }

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
