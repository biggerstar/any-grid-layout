import {CustomItems} from "@/types";

/**
 * Container实例化的时候可以在 Layout 配置中使用的字段
 * 包含默认配置信息，用户配置找不到则会找该类的默认配置
 * */
export class ContainerGeneralImpl {
  //----------------Container实例化传进的的参数---------------------//
  /** 当前布局使用的数据*/
  items?: CustomItems = []

  /** 列数 响应模式下col由引擎管理且col不可固定，用户指定的col永远不会生效 */
  col?: number

  /** 行数， 响应模式下row由引擎管理且row不可固定，用户指定的row永远不会生效 */
  row?: number

  /** 左右间隔距离之和，单位px，如果和gap[0]优先级大于 gapX */
  gapX?: any = null

  /** 上下间隔距离之和，单位px，如果和gap[1]优先级大于 gapY*/
  gapY?: any = null

  /**
   * item成员的宽度
   * */
  itemWidth?: number | null = null

  /**
   * item成员的高度
   * */
  itemHeight?: number | null = null

  /** 最小列数 */
  minCol?: number | null = null

  /**
   * @deprecated
   * 弃用，因为必须要有一个方向能让item活动，除了静态布局
   * 最大列数
   * */
  maxCol?: number | null = null

  /** 最小行数 只是容器高度，未和布局算法挂钩*/
  minRow?: number | null = null
  /**
   * @deprecated
   * 弃用，因为必须要有一个方向能让item活动，除了静态布局
   * 最大行数 只是容器高度，未和布局算法挂钩
   * */
  maxRow?: number | null = null

  /**
   * 在没有指定col的情况下， 假设 gap 和size自动分配 gap/size的比例 10:100 ratioCol值为0.1
   *
   * 注意: 必须为container所挂载的元素指定宽高,且col方向没有指定size和 gap 才能生效
   *
   * @default  0.1
   * */
  ratioCol?: number = 0.1

  /**
   * 在没有指定row的情况下， 假设 gap 和size自动分配 gap/size的比例 10:100 ratioRow值为0.1
   *
   * 注意: 必须为container所挂载的元素指定宽高，,且row方向没有指定size和 gap 才能生效
   *
   * @default  0.1
   * */
  ratioRow?: number = 0.1

  /**
   * 触屏下长按多久响应拖拽事件,默认360ms
   * @default 360
   * */
  pressTime?: number = 360   // 触屏下长按多久响应拖拽事件,默认360ms

  /**
   * 是否在响应布局的交叉轴方向上自动拓展矩阵大小
   * */
  autoGrow?: {
    // 垂直方向,若设置了row将不会自动增长
    vertical?: boolean
    // 水平方向,若设置了col将不会自动增长
    horizontal?: boolean
  } = {
    vertical: false,
    horizontal: false
  }
  /**
   * TODO 后续根据情况决定是否弃用
   * 对拖动或者调整尺寸的元素进行配置
   * */
  cloneElement?: {
    /**
     * [跨容器]  克隆元素拖动到当前container时，将拖动的克隆元素动态转换成符合本容器item大小的尺寸
     * */
    adaption?: boolean,
    /**
     * [跨容器] 是否保持拖动元素最初的大小，如果为false，将会以当前item所在容器的尺寸作为clone元素大小
     * 用途：
     *    用于拖动某个元素可能会经过多个容器时，依然可以保持最初元素大小
     * */
    keepBaseSize?: boolean
  } = {
    adaption: true,
    keepBaseSize: false,
  }
}
