import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {Item} from "@/main/item/Item";
import {Container} from "@/main/container/Container";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";

export type HandleErrorType = {
  type: 'error' | 'warn',
  name: string,
  msg: string,
  /** 来自哪个数据或者实例 Container or Item */
  from: any
}


// export type CustomItemField = 'el' | 'name' | 'type' | 'follow' | 'dragOut'
//   | 'resizeOut' | 'className' | 'dragIgnoreEls' | 'dragAllowEls' | 'transition'
//   | 'draggable' | 'resize' | 'close' | 'static' | 'exchange' | 'pos'

// export type ItemLayoutOption =
//   Omit<ItemGeneralImpl, 'pos'>
//   & { pos: Partial<CustomItemPos> }
//   & { [key: string]: any }

export type CustomItemPos = ItemPosGeneralImpl

export type CustomItem = ItemGeneralImpl
export type CustomItems = ItemGeneralImpl[]

/** Container 实例化配置选项 */
export type CustomLayoutsOptions = ContainerGeneralImpl | ContainerGeneralImpl[]

/** Container 实例化配置选项 */
export type ContainerInstantiationOptions = {
  [key: string]: any

  /**
   * 指定容器Id名或者一个Element网页节点，该节点将作为当前布局数据的根容器
   * */
  el: string | HTMLElement,

  /**
   * 该容器的名称,只是给个命名，不影响执行的行为
   * */
  name?: string

  /**
   * Container在文档中默认的类名,可以由外部传入重新自定义
   *
   * @default 'grid-container'
   * */
  className?: string

  /**
   * 指定使用的是原生或者其他常见框架，内部做了一定优化
   *
   * @default 'native' | 'vue'
   * */
  platform?: 'native' | 'vue'

  /**
   * 当前的事件钩子
   * */
  events?: CustomEventOptions,

  /**
   * 当前的布局配置，可以是一个配置对象或者配置对象数组
   * */
  layouts?: CustomLayoutsOptions,

  /**
   * 当前的全局布局配置，该配置最终会和layouts中不同px下的配置合并作为最终使用的配置
   * */
  global?: ContainerGeneralImpl,
}

export type ItemTransition = ItemTransitionObject | number | boolean

export type ItemTransitionObject = {
  time: number,
  field: 'top,left,width,height'
}

export type MarginOrSizeDesc = [number | null, number | null]

export type ItemLimitType = {
  maxW?: number,
  maxH?: number,
  minW?: number,
  minH?: number
}


export type CustomEventOptions = {
  /** 所有非阻断式错误都能在这里接受处理,如果未设定该函数取接受异常将直接将错误抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用 new Error抛出 */
  error?(err: HandleErrorType): void,

  /** 所有非阻断式警告都能在这里接受处理,如果未设定该函数取接受异常将直接将警告抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用抛出warn */
  warn?(err: HandleErrorType): void,

  /**  触发条件： items列表长度变化，item的宽高变化，item的位置变化都会触发 */
  updated?(): void

  /** Container成功挂载事件 */
  containerMounted?(container: Container): void,

  /** Container成功卸载事件 */
  containerUnmounted?(container: Container): void,

  /** Item成功挂载事件 */
  itemMounted?(item: Item): void,

  /** Item成功卸载事件 */
  itemUnmounted?(item: Item): void,

  /** Item添加成功事件 */
  addItemSuccess?(item: Item): void,

  /** item关闭前事件,返回null或者false将会阻止关闭该Item */
  itemClosing?(item: Item): void,

  /** item关闭后事件 */
  itemClosed?(item: Item): void,

  /**
   * item每次大小被改变时
   * */
  itemResizing?(w: number, h: number, item: Item): void,

  /**
   * item鼠标抬起后在容器中的最终大小
   * */
  itemResized?(w: number, h: number, item: Item): void,

  /**
   * item拖动时在容器内所属位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
   * */
  itemMoving?(nowX: number, nowY: number, item: Item): void,

  /**
   * item拖动结束时在容器内最终位置的nowX和nowY，如果鼠标在容器外,则nowX和nowY是容器边缘最大最小值,不会是超过或者是负数
   * */
  itemMoved?(nowX: number, nowY: number, item: Item): void,

  /** item位置变化时响应的事件,只有位置变化才触发 */
  itemMovePositionChange?(oldX: number, oldY: number, newX: number, newY: number): void

  /**
   *交换成功后oldItem会从原Container中卸载,而新Item将会自动添加进新容器中，无需手动添加，返回null或者false将会阻止该次交换
   * */
  crossContainerExchange?(oldItem: Item, newItem: Item): void,

  /**
   *   鼠标移动到容器边界自动滚动时触发，direction是方向X或Y,offset是滚动距离，触发间隔36ms，
   *   返回null或者false取消该次滚动，direction是方向, offset是滚动距离,负值为反方向滚动
   *   可以返回 {direction,offset} 对象临时指定该次滚动的新参数,允许返回{direction}或{offset}修改单个值
   */
  autoScroll?(direction: 'X' | 'Y', offset: number, container: Container): void,

  /**
   响应式模式中自身容器中的Item交换，fromItem:来自哪个Item，toItem:要和哪个Item交换，返回null或者false将会阻止该次交换
   */
  itemExchange?(fromItem: Item, toItem: Item): void,

  /**
   * 内层容器(grid-container)col或者row大小改变触发的事件,oldSize和newSize包含以下信息{ containerW,containerH,row,col,width,height }
   */
  containerSizeChange?(oldSize: number, newSize: number, container: Container): void,

  /**
   *  外层容器(挂载点)大小正在改变时触发的事件(如果是嵌套容器,只会等col和row改变才触发，效果和containerResized一样),
   *  containerWidth是当前container的宽度，useLayout是当前使用的布局配置,使用的是实例化时传入的layout字段，
   *  可以直接修改形参useLayout的值或者直接返回一个新的layout对象，框架将会使用该新的layout对象进行布局,返回null或者false将会阻止布局切换
   *  可通过实例属性resizeReactionDelay控制触发间隔
   */
  mountPointElementResizing?(useLayout: any, containerWidth: any, container: Container): void,

  /** 当前鼠标按下状态进入的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小 */
  enterContainerArea?(container, item): void,

  /** 当前鼠标按下状态离开的ContainerArea，item是指当前正在操作的Item，如果没有则为null,可做贴边或者拖动到区域边界自动撑开容器大小 */
  leaveContainerArea?(container, item): void,

  /** col列数改变 */
  colChange?(col, preCol, container): void,

  /** row列数改变 */
  rowChange?(row, preRow, container): void,
}

export type MoveDirection = 'left' | 'right' | 'top' | 'bottom' | 'leftTop' | 'letBottom' | 'rightTop' | 'rightBottom'

export type LayoutOptions = {
  [key: string]: any,
  /**
   * 当前正在操作拖动的item
   * */
  dragItem?: Item,

  /**
   * 当前鼠标坐标下的某一个item
   * toItem 为null则是空白处
   * */
  toItem?: Item | null,
  /**
   * item的左上角X坐标，endX 是x坐标加上w - 1
   * */
  x?: number,

  /**
   * item的左上角Y坐标，endY 是x坐标加上y - 1
   * */
  y?: number,

  /**
   * 本次事件响应鼠标移动的距离，响应时间间隔是浏览器对mousemove的间隔
   * */
  distance?: number,

  /**
   * 本次鼠标移动的速度，距离/时间，响应时间间隔是浏览器对mousemove的间隔
   * */
  speed?: number
}
