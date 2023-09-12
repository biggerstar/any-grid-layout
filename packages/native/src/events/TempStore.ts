/**  用于Container之间数据临时共享缓存,不计划挂载到window对象
 *   使用该Store的对象：Container，EditEvent
 * */
import {Container, Item} from "@/main";

class TempStore {
  handleMethod: 'drag' | 'resize' | 'close' | 'autoScrollPage' | null

  get isDragging(): boolean {
    return this.handleMethod === 'drag'
  }

  get isResizing(): boolean {
    return this.handleMethod === 'resize'
  }

  get isClosing(): boolean {
    return this.handleMethod === 'close'
  }

  get isScrollPage(): boolean {
    return this.handleMethod === 'autoScrollPage'
  }

  get isFree() {
    return this.handleMethod === void 0
  }

  //----------通用可写变量-----------//
  editItemNum: number = 0   // 当前处于编辑模式的Item个数
  fromContainer: Container | null = null    //  当前Item的初始来源
  toContainer: Container | null = null    //  当前鼠标移动位置下是哪个容器，移动到容器外为null
  fromItem: Item | null    // 表示在Container中的鼠标初次按下未抬起的Item, 除Item类型外的元素不会被赋值到这里
  toItem: Item | null       // 表示在Container中的鼠标按下后抬起的正下方位置的Item, 除Item类型外的元素不会被赋值到这里
  moveItem: Item | null   // 多容器情况下，移动出去到新容器新创建的一个符合新容器Item参数的成员,非克隆元素而是参与排列的元素
  newItem: Item | null    // 跨容器时创建在目标容器且未挂载的Item
  cloneElement: HTMLElement | null      // 表示在用户拖动点击拖动的瞬间克隆出来的文档
  mousedownEvent: MouseEvent | null = null   //  鼠标点击瞬间mousedown触发的对应的dom元素触发的事件
  mousemoveEvent: MouseEvent | null = null   //  鼠标resize | drag期间实时更新触发的事件对象
  mousedownItemOffsetLeft: number | null = null  // 鼠标点击某个Item的时候距离该Item左边界距离
  mousedownItemOffsetTop: number | null = null  // 同上
  offsetPageX: number | null = null
  offsetPageY: number | null = null
  scrollReactionTimer: any = null   // 鼠标移动到容器边界自动滚动反应的定时器
  isLeftMousedown: boolean = false
  //----------------------------------------------------------
  allowTouchMoveItem: boolean = false   // 是否允许触屏下拖动Item
  scrollReactionStatic: 'stop' | 'wait' | 'scroll' = 'stop'  //   鼠标移动到容器边界自动滚动状态
  deviceEventMode: 'mouse' | 'touch' = 'mouse'   //   mouse || touch
  timeOutEvent: any = null
}

export const tempStore: TempStore = new TempStore()
