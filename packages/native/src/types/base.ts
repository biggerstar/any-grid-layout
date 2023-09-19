import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {Item} from "@/main/item/Item";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ThrowMessageEvent} from "@/plugins/event-types/ThrowMessageEvent";
import {CloneElementStyleEvent, ItemExchangeEvent} from "@/plugins";
import {ItemPosChangeEvent} from "@/plugins/event-types/ItemPosChangeEvent";
import {ContainerSizeChangeEvent} from "@/plugins/event-types/ContainerSizeChangeEvent";
import {ConfigurationEvent} from "@/plugins/event-types/ConfigurationEvent";

export type CustomItemPos = ItemPosGeneralImpl
export type CustomItem = ItemGeneralImpl
export type CustomItems = ItemGeneralImpl[]

// export type BasePosType = 'x' | 'y' | 'w' | 'h'
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
  /** 插件名称 */
  name?: string,

  /** 插件版本 */
  version?: string | number,
}

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
  init?(ev: ItemLayoutEvent): void,

  /**
   * 发起一次更新，内置默认事件无任何行为，由当前使用的插件自行实现更新逻辑
   * @default 无
   * */
  updateLayout?(ev: ItemLayoutEvent): void,

  /**
   * 更新克隆元素的尺寸，可以用于跨容器移动同步适配item尺寸
   * */
  updateCloneElementSize?(ev: CloneElementStyleEvent): void,

  /** 获取配置事件，设置过程可被拦截(configName,configData)修改 */
  getConfig?(ev: ConfigurationEvent): void,
  /** 设置配置事件，设置过程可被拦截(configName,configData)修改 */
  setConfig?(ev: ConfigurationEvent): void,

  //-----------------container------------------
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

  //------------------drag----------------------
  dragging?(ev: ItemDragEvent): void,
  dragend?(ev: ItemDragEvent): void,
  dragToTop?(ev: ItemDragEvent): void,
  dragToLeft?(ev: ItemDragEvent): void,
  dragToBottom?(ev: ItemDragEvent): void,
  dragToRight?(ev: ItemDragEvent): void,
  dragToLeftTop?(ev: ItemDragEvent): void,
  dragToRightTop?(ev: ItemDragEvent): void,
  dragToRightBottom?(ev: ItemDragEvent): void,
  dragToLeftBottom?(ev: ItemDragEvent): void,
  dragOuterTop?(ev: ItemDragEvent): void,
  dragOuterRight?(ev: ItemDragEvent): void,
  dragOuterBottom?(ev: ItemDragEvent): void,
  dragOuterLeft?(ev: ItemDragEvent): void,

  //-----------------resize---------------------
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

  //------------------close---------------------
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
