import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {Item} from "@/main/item/Item";
import {Container} from "@/main/container/Container";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ThrowMessageEvent} from "@/plugins/event-types/ThrowMessageEvent";
import {CrossContainerExchangeEvent} from "@/plugins";
import {CustomItemPos} from "../../dist";

export type CustomItemPos = ItemPosGeneralImpl
export type CustomItem = ItemGeneralImpl
export type CustomItems = ItemGeneralImpl[]

export type BasePosType = 'x' | 'y' | 'w' | 'h'
export type BaseLineType = 'top' | 'left' | 'bottom' | 'right'
export type MarginOrSizeDesc = [number | null, number | null]

/** Container 实例化配置选项 */
export type CustomLayoutsOptions = ContainerGeneralImpl | ContainerGeneralImpl[]
export type CustomLayoutsOption = ContainerGeneralImpl

export type ItemTransition = ItemTransitionObject | number | boolean

export type ItemTransitionObject = {
  time: number,
  field: 'top,left,width,height'
}

export type ItemLimitType = {
  maxW?: number,
  maxH?: number,
  minW?: number,
  minH?: number
}

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

  // /**
  //  * 当前的事件钩子
  //  * */
  // events?: CustomEventOptions,

  /**
   * 当前的布局配置，可以是一个配置对象或者配置对象数组
   * */
  layouts?: CustomLayoutsOptions,

  /**
   * 当前的全局布局配置，该配置最终会和layouts中不同px下的配置合并作为最终使用的配置
   * */
  global?: CustomLayoutsOption,
}

export type BaseEmitData = {
  [key: string | symbol]: any
  target?: Item
}

export type EventBusType = Record<keyof CustomEventOptions, BaseEmitData> & {
  error: {
    message: string | number,
    type?: string,
    from?: any,
  },
  warn: {
    message: string | number,
    type?: string,
    from?: any,
  },
}

export type CustomEventOptions = {
  [key: string]: Function
  /** 所有非阻断式错误都能在这里接受处理,如果未设定该函数取接受异常将直接将错误抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用 new Error抛出 */
  error?(ev: ThrowMessageEvent): void,

  /** 所有非阻断式警告都能在这里接受处理,如果未设定该函数取接受异常将直接将警告抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用抛出warn */
  warn?(ev: ThrowMessageEvent): void,

  /**  触发条件： items列表长度变化，item的宽高变化，item的位置变化都会触发 */
  updated?(ev: BaseEvent): void

  /** Container成功挂载事件 */
  containerMounted?(ev: BaseEvent): void,

  /** Container成功卸载事件 */
  containerUnmounted?(ev: BaseEvent): void,

  /** Item成功挂载事件 */
  itemMounted?(ev: BaseEvent): void,

  /** Item成功卸载事件 */
  itemUnmounted?(ev: BaseEvent): void,

  /** Item添加成功事件 */
  addItemSuccess?(ev: BaseEvent): void,


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
   * 内层容器(grid-container)col或者row大小改变触发的事件,oldSize和newSize包含以下信息{ row,col,width,height }
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


  //--------------other-------------------
  /**
   * @default 初始化载入item成员并挂载
   * */
  init?(ev: ItemLayoutEvent): void,

  /**
   * 发起一次更新，内置默认事件无任何行为，由当前使用的插件自行实现更新逻辑
   * @default 无
   * */
  updateLayout?(ev: ItemLayoutEvent): void,

  /**
   * 内置，跨容器移动成员时的派发函数
   * @default 无
   * */
  cross?(ev: CrossContainerExchangeEvent): void;

  /**
   * 跨容器移动成员时的源容器
   * @default 无
   * */
  crossSource?(ev: CrossContainerExchangeEvent): void,

  /**
   * 跨容器移动成员时的目标容器
   * @default 无
   * */
  crossTarget?(ev: CrossContainerExchangeEvent): void,
  itemSizeChange?(ev: BaseEvent): void,
  //------------container-outer-move------------
  dragOuterLeft?(ev: ItemDragEvent): void,
  dragOuterRight?(ev: ItemDragEvent): void,
  dragOuterTop?(ev: ItemDragEvent): void,
  dragOuterBottom?(ev: ItemDragEvent): void,
  //--------------drag-------------------
  dragging?(ev: ItemDragEvent): void,
  dragend?(ev: ItemDragEvent): void,
  dragToBlank?(ev: ItemDragEvent): void,
  dragToTop?(ev: ItemDragEvent): void,
  dragToBottom?(ev: ItemDragEvent): void,
  dragToLeft?(ev: ItemDragEvent): void,
  dragToRight?(ev: ItemDragEvent): void,
  dragToRightBottom?(ev: ItemDragEvent): void,
  dragToLetBottom?(ev: ItemDragEvent): void,
  dragToLeftTop?(ev: ItemDragEvent): void,
  dragToRightTop?(ev: ItemDragEvent): void,
  //--------------resize-----------------
  containerResizing?(ev: ItemLayoutEvent): void,
  resizing?(ev: ItemResizeEvent): void,
  resized?(ev: ItemResizeEvent): void,
  resizeToTop?(ev: ItemResizeEvent): void,
  resizeToRight?(ev: ItemResizeEvent): void,
  resizeToBottom?(ev: ItemResizeEvent): void,
  resizeToLeft?(ev: ItemResizeEvent): void,
  resizeOuterTop?(ev: ItemResizeEvent): void,
  resizeOuterRight?(ev: ItemResizeEvent): void,
  resizeOuterBottom?(ev: ItemResizeEvent): void,
  resizeOuterLeft?(ev: ItemResizeEvent): void,
  //--------------close------------------
  closing?(ev: ItemLayoutEvent): void,
  closed?(ev: ItemLayoutEvent): void,
}

export type AnalysisResult = {
  col: number
  row: number
  /** 能否将指定item添加到目标位置 */
  isSuccess: boolean
  /** 允许添加的item信息 */
  successInfo: Array<{
    /** item，此时pos可能不是最新位置 */
    item: Item,
    /** 该pos将是当前在矩阵最新位置 */
    pos: CustomItemPos,
  }> | null
  /** 允许添加的item列表 */
  get successItems: Item[]
  /** 失败的的item列表 */
  failedItems: Item[]
  /**
   * 将当前成功的所有列表中的pos信息派发更新到对应的item中
   * @param handler 传入最新pos的item作为参数
   * */
  patch: (handler?: (item: Item) => void) => void
}
