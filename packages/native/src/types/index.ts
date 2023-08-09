import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {Item} from "@/main/item/Item";
import {ItemPos} from "@/main/item/ItemPos";
import {Container} from "@/main/container/Container";

/**  通用错误类型
 *   ContainerOverflowError                                   //container溢出
 *   itemLimitError                                           //  item限制异常
 *   ContainerNotMounted                                      //container未挂载
 *   ItemAlreadyRemove                                        //item已经被移除
 *   # vue专属
 *   vueUseLayoutModificationFailed     arg:[useLayout]       //字段修改失败，row,col.size.margin
 * */
export type HandleErrorType = {
  type: 'error' | 'warn',
  name: string,
  msg: string,
  /** 来自哪个数据或者实例 Container or Item */
  from: any
}

export type CustomContainerOptions = ContainerGeneralImpl


export type CustomItemField = 'el' | 'name' | 'type' | 'follow' | 'dragOut'
  | 'resizeOut' | 'className' | 'dragIgnoreEls' | 'dragAllowEls' | 'transition'
  | 'draggable' | 'resize' | 'close' | 'static' | 'exchange'

export type ItemLayoutOptions = Partial<Pick<Item, CustomItemField> & { pos: Partial<ItemPos> }>

export type CustomItemLayoutOptions = ItemLayoutOptions | ItemLayoutOptions[]


export type ContainerOptions = {
  [key: string]: any
  el: string | HTMLElement,
  layouts?: Partial<ContainerGeneralImpl> | Array<Partial<ContainerGeneralImpl>>,
  events?: Partial<CustomEventOptions>,
  global?: Partial<ContainerGeneralImpl>,
  itemLimit?: Record<any, any>
}


export type CustomEventOptions = {
  /** 所有非阻断式错误都能在这里接受处理,如果未设定该函数取接受异常将直接将错误抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用 new Error抛出 */
  error(err: HandleErrorType): void,

  /** 所有非阻断式警告都能在这里接受处理,如果未设定该函数取接受异常将直接将警告抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用抛出warn */
  warn(err: HandleErrorType): void,

  /**  触发条件： items列表长度变化，item的宽高变化，item的位置变化都会触发 */
  updated(): void

  /** Container成功挂载事件 */
  containerMounted(container: Container): void,

  /** Container成功卸载事件 */
  containerUnmounted(container: Container): void,

  /** Item成功挂载事件 */
  itemMounted(item: Item): void,

  /** Item成功卸载事件 */
  itemUnmounted(item: Item): void,

  /** Item添加成功事件 */
  addItemSuccess(item: Item): void,

  /** item关闭前事件,返回null或者false将会阻止关闭该Item */
  itemClosing(item: Item): void,

  /** item关闭后事件 */
  itemClosed(item: Item): void,

  /**
   * item每次大小被改变时
   * */
  itemResizing(w: number, h: number, item: Item): void,

  /**
   * item鼠标抬起后在容器中的最终大小
   * */
  itemResized(w: number, h: number, item: Item): void,

  /**
   * item拖动时在容器内所属位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
   * */
  itemMoving(nowX: number, nowY: number, item: Item): void,

  /**
   * item拖动结束时在容器内最终位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
   * */
  itemMoved(nowX: number, nowY: number, item: Item): void,

  /** item位置变化时响应的事件,只有位置变化才触发 */
  itemMovePositionChange(oldX: number, oldY: number, newX: number, newY: number): void

  /**
   *交换成功后oldItem会从原Container中卸载,而新Item将会自动添加进新容器中，无需手动添加，返回null或者false将会阻止该次交换
   * */
  crossContainerExchange(oldItem: Item, newItem: Item): void,

  /**
   *   鼠标移动到容器边界自动滚动时触发，direction是方向X或Y,offset是滚动距离，触发间隔36ms，
   *   返回null或者false取消该次滚动，direction是方向, offset是滚动距离,负值为反方向滚动
   *   可以返回 {direction,offset} 对象临时指定该次滚动的新参数,允许返回{direction}或{offset}修改单个值
   */
  autoScroll(direction: 'X' | 'Y', offset: number, container: Container): void,

  /**
   响应式模式中自身容器中的Item交换，fromItem:来自哪个Item，toItem:要和哪个Item交换，返回null或者false将会阻止该次交换
   */
  itemExchange(fromItem: Item, toItem: Item): void,

  /**
   * 内层容器(grid-container)col或者row大小改变触发的事件,oldSize和newSize包含以下信息{ containerW,containerH,row,col,width,height }
   */
  containerSizeChange(oldSize: number, newSize: number, container: Container): void,

  /**
   *  外层容器(挂载点)大小正在改变时触发的事件(如果是嵌套容器,只会等col和row改变才触发，效果和containerResized一样),
   *  containerWidth是当前container的宽度，useLayout是当前使用的布局配置,使用的是实例化时传入的layout字段，
   *  可以直接修改形参useLayout的值或者直接返回一个新的layout对象，框架将会使用该新的layout对象进行布局,返回null或者false将会阻止布局切换
   *  可通过实例属性resizeReactionDelay控制触发间隔
   */
  mountPointElementResizing(useLayout: any, containerWidth: any, container: Container): void,

  /** 当前鼠标按下状态进入的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小 */
  enterContainerArea(container, item): void,

  /** 当前鼠标按下状态离开的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小 */
  leaveContainerArea(container, item): void,

  /** col列数改变 */
  colChange(col, preCol, container): void,

  /** row列数改变 */
  rowChange(row, preRow, container): void,
}

export type ItemTransition = {
  time: number,
  field: 'top,left,width,height'
} | number | boolean

export type MarginOrSizeDesc = [string | null, string | null]

export type ItemLimitType = {
  maxW?: number,
  maxH?: number,
  minW?: number,
  minH?: number
}
