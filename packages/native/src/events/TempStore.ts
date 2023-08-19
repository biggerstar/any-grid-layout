/**  用于Container之间数据临时共享缓存,不计划挂载到window对象
 *   使用该Store的对象：Container，EditEvent
 * */
import {Container, Item} from "@/main";

class TempStore {
  handleMethod: 'drag' | 'resize' | 'autoScrollPage' | undefined

  get isDragging(): boolean {
    return this.handleMethod === 'drag'
  }

  get isResizing(): boolean {
    return this.handleMethod === 'resize'
  }

  get isScrollPage(): boolean {
    return this.handleMethod === 'autoScrollPage'
  }

  //----------只读变量-----------//
  screenWidth: null | number = null  // 用户屏幕宽度
  screenHeight: null | number = null  // 用户屏幕高度
  //----------通用可写变量-----------//
  editItemNum: number = 0   // 当前处于编辑模式的Item个数
  fromContainer: Container | null = null    //  当前Item的初始来源
  dragContainer: Container | null = null    //  当前Item拖动多次跨容器后的最新所处容器位置来源
  moveContainer: Container | null = null    //  当前正聚焦的容器
  currentContainer: Container | null = null  //  当前鼠标在哪个Container
  beforeContainer: Container | null = null  //  来自上一个的Container
  currentContainerArea: HTMLElement   //  当前鼠标在哪个Container容器域名
  beforeContainerArea: HTMLElement   //  来自上一个的Container容器域名
  fromItem: Item | null = null    // 表示在Container中的鼠标初次按下未抬起的Item, 除Item类型外的元素不会被赋值到这里
  toItem: Item | null = null      // 表示在Container中的鼠标按下后抬起的正下方位置的Item, 除Item类型外的元素不会被赋值到这里
  moveItem: Item | null = null   // 多容器情况下，移动出去到新容器新创建的一个符合新容器Item参数的成员,非克隆元素而是参与排列的元素
  exchangeItems: {
    old: Item | null
    new: Item | null
  } = { /* 跨容器时保存对应的新老Item */
    old: null,
    new: null
  }
  cloneElement: HTMLElement | null      // 表示在用户拖动点击拖动的瞬间克隆出来的文档
  mousedownEvent: MouseEvent | null = null   //  鼠标点击瞬间mousedown触发的对应的dom元素触发的事件
  mousedownItemOffsetLeft: number | null = null  // 鼠标点击某个Item的时候距离该Item左边界距离
  mousedownItemOffsetTop: number | null = null  // 同上
  offsetPageX: number | null = null
  offsetPageY: number | null = null
  scrollReactionStatic: 'stop' | 'wait' | 'scroll' = 'stop'  //   鼠标移动到容器边界自动滚动状态
  scrollReactionTimer: any = null   // 鼠标移动到容器边界自动滚动反应的定时器
  isCoverRow: boolean = false   //  是否进行Cover覆盖完整容器操作
  //----------鼠标相关-----------//
  isLeftMousedown: boolean = false
  mouseDownElClassName: string | null = null
  mouseSpeed = {
    timestamp: 0,
    endX: 0,
    endY: 0
  }
  slidePageOffsetInfo = {
    offsetTop: 0,
    offsetLeft: 0,
    newestPageX: 0,
    newestPageY: 0,
  }
  //----------触屏相关-----------//
  deviceEventMode: 'mouse' | 'touch' = 'mouse'   //   mouse || touch
  allowTouchMoveItem: boolean = false   // 是否允许触屏下拖动Item
  timeOutEvent: any = null
  //----------网页元素-----------//
  nestingMountPointList: any[] = []  // 网页挂载点
}

export const tempStore: TempStore = new TempStore()
