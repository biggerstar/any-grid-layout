/**  用于Container之间数据临时共享缓存,不计划挂载到window对象
 *   使用该Store的对象：Container，EditEvent
 * */
import {Container, Item} from "@/main";
import {canExchange} from "@/utils";

class TempStore {
  handleMethod: 'drag' | 'resize' | 'close' | null

  get isDragging(): boolean {
    return this.handleMethod === 'drag'
  }

  get isResizing(): boolean {
    return this.handleMethod === 'resize'
  }

  get isClosing(): boolean {
    return this.handleMethod === 'close'
  }

  get isFree() {
    return this.handleMethod === void 0
  }

  //----------通用可写变量-----------//
  fromContainer: Container | null = null    //  当前Item的初始来源
  toContainer: Container | null = null    //  当前鼠标移动位置下是哪个容器，移动到容器外为null
  get exchangeContainer(): Container | null {  //  当前可以允许交换的容器
    return canExchange() ? this.toContainer : this.fromContainer
  }

  fromItem: Item | null    // 表示在Container中的鼠标初次按下未抬起的Item, 除Item类型外的元素不会被赋值到这里
  toItem: Item | null       // 表示在Container中的鼠标按下后抬起的正下方位置的Item, 除Item类型外的元素不会被赋值到这里
  newItem: Item | null    // 跨容器时创建在目标容器且未挂载的Item
  cloneElement: HTMLElement | null      // 表示在用户拖动点击拖动的瞬间克隆出来的文档
  mousedownEvent: MouseEvent | null = null   //  鼠标点击瞬间mousedown触发的对应的dom元素触发的事件
  mousemoveEvent: MouseEvent | null = null   //  鼠标resize | drag期间实时更新触发的事件对象
  mousedownItemOffsetLeftProportion: number | null = null  // 鼠标点击某个Item的时候距离该Item左边界占总宽比例
  mousedownItemOffsetTopProportion: number | null = null  // 同上

  get mousedownItemOffsetLeft(): number | null {   // 鼠标点击某个Item的时候距离该Item左边界距离
    const {mousedownItemOffsetLeftProportion: PLeft, fromItem} = this
    const container = this.exchangeContainer
    if (!container || !fromItem) return null
    if (fromItem.container.parentItem === this.toItem) return PLeft * fromItem.nowWidth()
    return PLeft * container.nowWidth(fromItem.pos.w)
  }

  get mousedownItemOffsetTop(): number | null { // 同上
    const {mousedownItemOffsetTopProportion: PTop, fromItem} = this
    const container = this.exchangeContainer
    if (!container || !fromItem) return null
    if (fromItem.container.parentItem === this.toItem) return PTop * fromItem.nowHeight()
    return PTop * container.nowHeight(fromItem.pos.h)
  }

  scrollReactionTimer: any = null   // 鼠标移动到容器边界自动滚动反应的定时器
  isLeftMousedown: boolean = false
  //----------------------------------------------------------
  allowTouchMoveItem: boolean = false   // 是否允许触屏下拖动Item
  scrollReactionStatic: 'stop' | 'wait' | 'scroll' = 'stop'  //   鼠标移动到容器边界自动滚动状态
  deviceEventMode: 'mouse' | 'touch' = 'mouse'   //   mouse || touch
  timeOutEvent: any = null
  lastMousePointX: number | null
  lastMousePointY: number | null
  lastResizeW: number | null
  lastResizeH: number | null
  lastDragX: number | null
  lastDragY: number | null
  //-----------------------------------------------------------
  preventDragging: boolean | null
  preventResizing: boolean | null
  cloneElScaleMultipleX: number | null  // 克隆元素X方向的放大倍数
  cloneElScaleMultipleY: number | null  // 克隆元素Y方向的放大倍数
}

export const tempStore: TempStore = new TempStore()
