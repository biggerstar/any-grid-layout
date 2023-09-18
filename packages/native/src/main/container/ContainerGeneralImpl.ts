import {BaseLineType, CustomItems, MarginOrSizeDesc} from "@/types";

/**
 * Container实例化的时候可以在Layout配置中使用的字段
 * 包含默认配置信息，用户配置找不到则会找该类的默认配置
 * */
export class ContainerGeneralImpl {
  [key: string]: any

  //----------------Container实例化传进的的参数---------------------//
  /**
   * 使用多个layout预设布局方案请必须指定对应的像素px,单位为数字,假设px=1024表示Container宽度1024像素以下执行该布局方案
   * */
  px?: number

  /** 当前布局使用的数据*/
  items?: CustomItems = []

  /** 列数 响应模式下col由引擎管理且col不可固定，用户指定的col永远不会生效 */
  col?: number

  /** 行数， 响应模式下row由引擎管理且row不可固定，用户指定的row永远不会生效 */
  row?: number

  /** 禁止传入的数组内出现单个null */
  margin?: MarginOrSizeDesc = [null, null]

  /** 左右margin距离之和，单位px，如果和margin[0]优先级大于 marginX */
  marginX?: any = null

  /** 上下margin距离之和，单位px，如果和margin[1]优先级大于 marginY*/
  marginY?: any = null

  /** 成员大小 [width, height]，size[1]如果不传入的话长度将和size[1]一样， 禁止传入的数组内出现单个null */
  size?: MarginOrSizeDesc = [null, null]

  /** 成员宽度
   *  sizeWidth优先级大于 size[0],在sizeWidth,col,marginX都未指定的情况下将和sizeHeight大小一致
   * */
  sizeWidth?: number | null = null

  /** 成员高度
   *  sizeHeight优先级大于 size[1]，sizeHeight,row,marginY都未指定的情况下将和sizeWidth大小一致
   * */
  sizeHeight?: number | null = null

  /** 最小列数 */
  minCol?: number | null = null

  /**
   * @deprecated
   * 弃用，因为设置了baseline必须要有一个方向能让item活动，除了静态布局
   * 最大列数
   * */
  maxCol?: number | null = null

  /** 最小行数 只是容器高度，未和布局算法挂钩*/
  minRow?: number | null = null
  /**
   * @deprecated
   * 弃用，因为设置了baseline必须要有一个方向能让item活动，除了静态布局
   * 最大行数 只是容器高度，未和布局算法挂钩
   * */
  maxRow?: number | null = null

  /**
   * 在没有指定col的情况下， 假设margin和size自动分配margin/size的比例 10:100 ratioCol值为0.1
   *
   * 注意: 必须为container所挂载的元素指定宽高,且col方向没有指定size和margin才能生效
   *
   * @default  0.1
   * */
  ratioCol?: number = 0.1

  /**
   * 在没有指定row的情况下， 假设margin和size自动分配margin/size的比例 10:100 ratioRow值为0.1
   *
   * 注意: 必须为container所挂载的元素指定宽高，,且row方向没有指定size和margin才能生效
   *
   * @default  0.1
   * */
  ratioRow?: number = 0.1

  /**
   * 该容器是否可以参与跨容器交换，和Item的exchange不同的是container的控制整个自身容器
   * @default 0.45
   * */
  exchange?: boolean = false   //  该容器是否可以参与跨容器交换，和Item的exchange不同的是container的控制整个自身容器

  /**
   * 基准线，那个方向作为基底线   TODO left bottom，right
   * */
  baseline?: BaseLineType = 'top'

  /**
   * 触屏下长按多久响应拖拽事件,默认360ms
   * @default 360
   * */
  pressTime?: number = 360   // 触屏下长按多久响应拖拽事件,默认360ms

  /**
   * 当Item移动到容器边缘，等待多久进行自动滚动,默认800ms
   * @default 800
   * */
  scrollWaitTime?: number = 800

  /**
   * 当Item移动到容器边缘，自动滚动每36ms 的X轴速度,单位是px,默认为null
   * @default 36  单位(ms)
   * */
  scrollSpeedX?: number | null = 36

  /**
   * 当Item移动到容器边缘，自动滚动每36ms 的Y轴速度,单位是px,默认为null
   * @default 36  单位(ms)
   * */
  scrollSpeedY?: number | null = 36
}
