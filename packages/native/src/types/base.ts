import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {Item} from "@/main/item/Item";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ThrowMessageEvent} from "@/plugins/event-types/ThrowMessageEvent";
import {ItemPosChangeEvent} from "@/plugins/event-types/ItemPosChangeEvent";
import {ContainerSizeChangeEvent} from "@/plugins/event-types/ContainerSizeChangeEvent";
import {ConfigurationEvent} from "@/plugins/event-types/ConfigurationEvent";
import {Container} from "@/main";
import {InitOptionsEvent} from "@/plugins/event-types/InitOptionsEvent";
import {CloneElementStyleEvent, ItemExchangeEvent, MatrixEvent} from "@/plugins";

export type CustomItemPos = ItemPosGeneralImpl
export type CustomItem = ItemGeneralImpl
export type CustomItems = ItemGeneralImpl[]

export type BasePosType = 'x' | 'y' | 'w' | 'h'
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

export type SmartRowAndColType = {
  smartCol: number,
  smartRow: number,
  maxItemW: number,
  maxItemH: number,
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

  /**
   * 当前的布局配置，可以是一个配置对象或者配置对象数组
   * */
  layouts?: CustomLayoutsOptions,

  /**
   * 当前的全局布局配置，该配置最终会和layouts中不同px下的配置合并作为最终使用的配置
   * */
  global?: CustomLayoutsOption,
}


export type EventMapType<T> = {
  [Key in keyof T]: Parameters<T[Key]>[0]
} & Record<'*', BaseEvent>

export type BaseEmitData<T> = {
  [Key in keyof T]:
  Partial<Parameters<T[Key]>[0]>
  // & { callback?(ev: Parameters<T[Key]>[0]): void }
  & {
  /** 回调最终经过插件和内置处理后的事件对象 */
  callback?(ev): void
}
}

export type EventBusType = BaseEmitData<CustomEventOptions>

export type GridPlugin = CustomEventOptions & {
  /** 安装函数 */
  install?(app: Container): void

  /** 插件名称 */
  name?: string,

  /** each名称 */
  eachName?: string,

  /** 插件版本 */
  version?: string | number,
} | ((app: Container) => void)

export type CustomEventOptions = {
  //------------------throw-message--------------
  /** 所有非阻断式错误都能在这里接受处理,如果未设定该函数取接受异常将直接将错误抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用 new Error抛出 */
  error?(ev: ThrowMessageEvent): void,

  /** 所有非阻断式警告都能在这里接受处理,如果未设定该函数取接受异常将直接将警告抛出到控制台
   *  如果没有使用该函数接受错误，框架则会直接使用抛出warn */
  warn?(ev: ThrowMessageEvent): void,

  //--------------------other--------------------
  /**
   * @default 初始化载入item成员并挂载
   * */
  config?(ev: InitOptionsEvent): void,

  /**
   * @default 经过各个插件的config之后的最终配置
   * */
  configResolved?(ev: InitOptionsEvent): void,

  /**
   * 发起一次更新，内置默认事件无任何行为，由当前使用的插件自行实现更新逻辑
   * @default 无
   * */
  updateLayout?(ev: ItemLayoutEvent): void,

  /**
   * 更新克隆元素的尺寸,移动位置，可以用于跨容器移动同步适配item尺寸
   * */
  updateCloneElementStyle?(ev: CloneElementStyleEvent): void,

  /** 获取配置事件，设置过程可被拦截(configName,configData)修改 */
  getConfig?(ev: ConfigurationEvent): void,
  /** 设置配置事件，设置过程可被拦截(configName,configData)修改 */
  setConfig?(ev: ConfigurationEvent): void,

  //-----------------container------------------
  /**
   * @default 初始化载入item成员并挂载
   * */
  containerMountBefore?(ev: BaseEvent): void,

  /** Container成功挂载事件 */
  containerMounted?(ev: BaseEvent): void,

  /** Container成功卸载事件 */
  containerUnmounted?(ev: BaseEvent): void,

  /** Container dom盒子大小改变 */
  containerResizing?(ev: ContainerSizeChangeEvent): void,

  /**
   * 容器(.grid-container类)col或者row大小改变触发的事件
   */
  containerSizeChanged?(ev: ContainerSizeChangeEvent): void,

  /** col列数改变 */
  colChanged?(ev: ContainerSizeChangeEvent): void,

  /** row列数改变 */
  rowChanged?(ev: ContainerSizeChangeEvent): void,

  //-------------------item---------------------
  /** Item添加成功事件 */
  addItemSuccess?(ev: BaseEvent): void,

  /** Item成功挂载事件 */
  itemMounted?(ev: BaseEvent): void,

  /** Item成功卸载事件 */
  itemUnmounted?(ev: BaseEvent): void,

  /** item 位置变化 时响应的事件,只有位置变化才触发 */
  itemPositionChanged?(ev: ItemPosChangeEvent): void

  /** item 尺寸变化 时响应的事件,只有位置变化才触发 */
  itemSizeChanged?(ev: ItemPosChangeEvent): void,

  //-----------------拖动开始和结束事件-----------------------
  dragging?(ev: ItemDragEvent): void,
  dragend?(ev: ItemDragEvent): void,

  //-----------------拖动到十字线方向的事件---------------------
  dragToTop?(ev: ItemDragEvent): void,
  dragToLeft?(ev: ItemDragEvent): void,
  dragToBottom?(ev: ItemDragEvent): void,
  dragToRight?(ev: ItemDragEvent): void,
  dragToBlank?(ev: ItemDragEvent): void,

  //---------------resize开始和结束事件-------------------
  resizing?(ev: ItemResizeEvent): void,
  resized?(ev: ItemResizeEvent): void,

  //-------------resize到十字线方向的事件------------------
  resizeToTop?(ev: ItemResizeEvent): void,
  resizeToRight?(ev: ItemResizeEvent): void,
  resizeToBottom?(ev: ItemResizeEvent): void,
  resizeToLeft?(ev: ItemResizeEvent): void,

  //------------------close事件---------------------
  closing?(ev: ItemLayoutEvent): void,
  closed?(ev: ItemLayoutEvent): void,

  //------------------exchange------------------
  /**
   * 跨容器交换前的验证，只有验证通过才执行交换
   * */
  exchangeVerification?(ev: ItemExchangeEvent): void;

  /**
   * 跨容器移动时Item提供者，在提供的Container上触发
   * */
  exchangeProvide?(ev: ItemExchangeEvent): void;

  /**
   * 跨容器移动时Item过程，主要用于处理如何挂载Item到新容器中
   * 通过provideItem添加要移动到目标容器的新item
   * */
  exchangeProcess?(ev: ItemExchangeEvent): void;

  /**
   * 跨容器移动时Item接受者，在接收的Container上触发
   * */
  exchangeReceive?(ev: ItemExchangeEvent): void;

  /**
   * 用作遍历矩阵的控制函数，可以自行实现遍历矩阵逻辑，比如螺旋遍历，交叉遍历...各种花里胡哨的功能，
   * 只需关心:
   *       xxx(eachName) + start 方向作为遍历的主布局，后面的 xxx-reverse ,end 等相关功能由 flip 钩子实现
   * */
  each?(ev: MatrixEvent): void;

  /**
   * 翻转矩阵，无需关心实现逻辑，内部已经做了兼容和实现
   * 只需要关心使用遍历的名称 xxx, xxx-reverse 和 遍历的起点  start, end 在不同情况运行 verticalMirrorFlip 或 horizontalMirrorFlip 就行
   *
   * 使用翻转函数:
   *            layoutManager.verticalMirrorFlip
   *            layoutManager.horizontalMirrorFlip翻转
   * */
  flip?(ev: MatrixEvent): void;

  /**
   * 指定在溢出的时候如何增加列，需要指定 autoGrow 配置才会触发
   * */
  changeColBefore?(ev: MatrixEvent): void;

  /**
   * 指定在溢出的时候如何增加行，需要指定 autoGrow 配置才会触发
   * */

  changeRowBefore?(ev: MatrixEvent): void;

  /**
   * changeColBefore事件中如果为矩阵对象进行列数变化，则会触发事件
   * */
  changeCol?(ev: MatrixEvent): void;

  /**
   * changeRowBefore事件中如果为矩阵对象进行行数变化，则会触发事件
   * */
  changeRow?(ev: MatrixEvent): void;
}

export type AnalysisResult = {
  col: number
  row: number
  /** 能否将指定item添加到目标位置 */
  isSuccess: boolean
  /** 允许添加的item信息 */
  successInfo: Array<LayoutItemInfo> | null
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


/**
 * point1 和 point2 一起构成的矩阵范围，外部使用者无需关心point1和point2的传入顺序，内部会自动分析矩阵区域
 * */
export type EachOptions = {
  point1: [number, number]
  point2: [number, number]

  /**
   * 交叉轴的遍历起点
   * */
  align?: AlignEnumType,

  /**
   * 主轴的遍历方向
   * */
  direction?: DirectionEnumType
}

export type PointType = [number, number]
export type AlignEnumType = 'start' | 'end'
export type DirectionEnumType = 'row' | 'row-reverse' | 'column' | 'column-reverse'

export type LayoutItemInfo = {
  /** 对应的item */
  item: Item,
  /** 该pos将是当前在矩阵最新位置 */
  nextPos: CustomItemPos
}
export type LayoutItemsInfo = Array<LayoutItemInfo>
export type EachMiddlewareType = {
  stepCol: 1 | -1,
  stepRow: 1 | -1,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
}
