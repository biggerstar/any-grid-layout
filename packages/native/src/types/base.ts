import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";
import {Item} from "@/main/item/Item";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPosGeneralImpl} from "@/main/item-pos/ItemPosGeneralImpl";
import {BaseEvent} from "@/plugins-src/event-types/BaseEvent";
import {Container, LayoutManager} from "@/main";
import {ThrowMessageEvent} from "@/plugins-src/event-types/ThrowMessageEvent";
import {MouseGridEvent} from "@/plugins-src/event-types/MouseGridEvent";

export type CustomItemPos = ItemPosGeneralImpl & Record<any, any>
export type CustomItem = ItemGeneralImpl & Record<any, any>

export type BasePosType = 'x' | 'y' | 'w' | 'h'

/** Container 实例化配置选项 */
export type CustomLayoutOptions = ContainerGeneralImpl
export type ComputedLayoutKeys =
  'gapX'
  | 'gapY'
  | 'itemWidth'
  | 'itemHeight'
  | 'containerWidth'
  | 'ratioCol'
  | 'ratioRow'

export type ComputedLayoutOptions = Pick<ContainerGeneralImpl, ComputedLayoutKeys>  // & { col: number, row: number }
export type UseLayoutOptions = Omit<ContainerGeneralImpl, 'items'> & {
  items: Item[],
  col: number,
  row: number,
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

export type BaseEmitData<T extends Record<any, any>> = {
  [Key in keyof T]:
  Partial<Parameters<T[Key]>[0]>
  // & { callback?(ev: Parameters<T[Key]>[0]): void }
  & {
  /** 回调最终经过插件和内置处理后的事件对象 */
  callback?(ev: any): void
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
  /**
   * 所有需要手动处理的框架错误都会在这里接收
   *  */
  error?(ev: ThrowMessageEvent): void,

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
  containerResizing?(ev: BaseEvent): void,

  //-------------------item---------------------
  /** Item成功挂载事件 */
  itemMounted?(ev: BaseEvent): void,

  /** Item成功卸载事件 */
  itemUnmounted?(ev: BaseEvent): void,

  /**
   * 用作遍历矩阵的控制函数，可以自行实现遍历矩阵逻辑，比如螺旋遍历，交叉遍历...各种花里胡哨的功能，
   * @param next 指定如何遍历矩阵,每次按自定义算法传入一个矩阵点，直到手动将整个矩阵的点按顺序传入next函数
   * @param layoutManager
   * */
  each?(next: (curRow: number, curCol: number) => any, layoutManager: LayoutManager): void,

  /**
   * 点击容器或者item触发的事件
   * */
  click?(ev: MouseGridEvent): void;
  mousedown?(ev: MouseGridEvent): void;
  mousemove?(ev: MouseGridEvent): void;
  mouseup?(ev: MouseGridEvent): void;
  /**
   * 进行自定义布局的钩子
   * 该事件钩子里面必须为所有的 Items 成员完整指定 w, h, x, y 进行生成布局，
   * 该事件钩子是自定义布局算法的实现位置
   * 里面禁止同时使用异步任务包裹 Container.setState 函数， 因为该操作可能会造成无限递归
   * */
  layout?(ev: BaseEvent): void;
}

export type LayoutManagerSetStateOptions = CustomLayoutOptions & {
  col: number,
  // items: Item[],
  /**
   * 每个钩子只支持一个 each 遍历算法, 后面设置的函数会覆盖前面的
   * */
  each: (next: (curRow: number, curCol: number) => any, layoutManager: LayoutManager) => void,
}


export type AnalysisResult = {
  col: number
  row: number
  /** 能否将指定item添加到目标位置 */
  isSuccess: boolean
  /** 允许添加的item信息 */
  successInfo: Array<LayoutItemInfo> | null
  /** 允许添加的item列表 */
  get successItems(): Item[]
  /** 失败的的item列表 */
  failedItems: Item[]
  /** 计算出来的下一次布局的配置信息, pos 的信息只包含上次 ItemPos.customOptions 存在的键 */
  get nextCustomsLayoutOptions(): Partial<CustomLayoutOptions>
  /** 计算出来的下一次布局的配置信息, 包含 x, y, w, h... 等完整位置和大小信息 */
  get nextLayoutOptions(): Partial<CustomLayoutOptions>
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

export type ExpandLineOptType = { len: number, force: boolean }

export type ContainerParameters = {
  containerWidth: number,
  ratioCol: number,
  ratioRow: number,
  col: number,
  gapX: number,
  gapY: number,
  itemWidth: number,
  itemHeight: number,
}
