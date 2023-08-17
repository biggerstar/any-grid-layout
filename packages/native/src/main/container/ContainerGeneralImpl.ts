import {CustomItems, MarginOrSizeDesc} from "@/types";

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

  /** responsive:  默认为static静态布局,值等于true为响应式布局
   * @default false
   * */
  responsive?: boolean = false

  /**
   * default(上下左右交换) || exchange(两两交换) || stream(左部压缩排列)
   * @default 'default'
   * */
  responseMode?: 'default' | 'exchange' | 'stream' = 'default'

  /** 当前布局使用的数据*/
  items?: CustomItems = []

  /** 列数 */
  col?: number = 1

  /** 行数， 响应模式下row由引擎管理且row不可固定，用户指定的row永远不会生效 */
  row?: number = 1

  /** 禁止传入的数组内出现单个null */
  margin?: MarginOrSizeDesc = [null, null]

  /** 距离左边，单位px，如果和margin[0]优先级大于 marginX */
  marginX?: any = null

  /** 距离右边，单位px，如果和margin[1]优先级大于 marginY*/
  marginY?: any = null

  /** 容器大小 [width, height]，size[1]如果不传入的话长度将和size[1]一样， 禁止传入的数组内出现单个null */
  size?: MarginOrSizeDesc = [null, null]

  /** 容器宽度
   * 如果和size[0]优先级大于 sizeWidth,在sizeWidth,col,marginX都未指定的情况下将和sizeHeight大小一致
   * */
  sizeWidth?: number | null = null

  /** 容器高度
   *  如果和size[1]优先级大于 sizeHeight，sizeHeight,row,marginY都未指定的情况下将和sizeWidth大小一致
   * */
  sizeHeight?: number | null = null

  /** 最小列数 */
  minCol?: number | null = null

  /** 最大列数 */
  maxCol?: number | null = null

  /** 最小行数 只是容器高度，未和布局算法挂钩,由engine配置，和算法通信同步 */
  minRow?: number | null = null
  /** 最大行数 只是容器高度，未和布局算法挂钩,由engine配置，和算法通信同步 */
  maxRow?: number | null = null

  /**
   * 响应式下resize和drag自动撑开Row，内部暂未进行实现
   * autoGrowRow for vue 外部开发者主动设置自动增长容器大小演示，作用于leaveContainerArea事件，自动缩小内部会自动计算
   * col 自动增长似乎有点问题，能用就用不能就不用。。。。。。。
   * const container = containerAPI.getContainer()
   * container.row =  container.row + 1
   *
   * @default  false
   * */
  autoGrowRow?: boolean = false
  // autoGrowCol = true     // 暂未支持

  /**
   * 是否重新进行Item顺序调整排序，排序后布局和原来位置一致，该情况出现存在有尺寸较大Item的i值较大却被挤压到下一行且i值比大Item大的却在上一行的情况
   *
   * @default  true
   * */
  autoReorder?: boolean = true

  /**
   * (该ratioCol生效能实现铺满col方向)只有col的情况下(margin和size都没有指定),
   * 或者没有col只有margin情况下， 假设margin和size自动分配margin/size的比例 1:1 ratioCol值为1
   *
   * 注意: 必须为container所挂载的元素指定宽高,且col方向没有指定size和margin才能生效
   *
   * @default  0.1
   * */
  ratioCol?: number = 0.1

  /**
   * (该ratioRow生效能实现铺满row方向)只有row的情况下(margin和size都没有指定),
   * 或者没有row只有margin情况下， 假设margin和size自动分配margin/size的比例 1:1 ratioRow值为1
   *
   * 注意: 必须为container所挂载的元素指定宽高，,且row方向没有指定size和margin才能生效
   *
   * @default  0.1
   * */
  ratioRow?: number = 0.1

  /**
   * 拖拽移动的灵敏度，表示每秒移动X像素触发交换检测,这里默认每秒36px   ## 不稳定性高，自用
   * @default 0.45
   * */
  sensitivity?: number = 0.45

  /**
   * 该容器是否可以参与跨容器交换，和Item的exchange不同的是container的控制整个自身容器
   * @default 0.45
   * */
  exchange?: boolean = false   //  该容器是否可以参与跨容器交换，和Item的exchange不同的是container的控制整个自身容器

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

  /**
   * 当Container元素大小改变时检测是否切换其他符合px限制的layout所用的时间间隔
   * @default 50
   * */
  resizeReactionDelay?: number = 50

  /**
   * 点击container的空白处是否能拖拽进行滑动容器
   * @default true
   * */
  autoScrollPage?: boolean = true

  /**
   * 如果是嵌套页面，从嵌套页面里面拖动出来Item是否立即允许该被嵌套的容器参与响应布局,true是允许，false是不允许
   *
   *  @default false
   * */
  nestedOutExchange?: boolean = false

}
