import {CustomItem} from "@/types";

/**
 * Container实例化的时候可以在 Layout 配置中使用的字段
 * 包含默认配置信息，用户配置找不到则会找该类的默认配置
 * */
export class ContainerGeneralImpl {
  //----------------Container实例化传进的的参数---------------------//
  /**
   * 当前布局使用的数据
   * */
  items: CustomItem[] = []

  /**
   * container 的宽度， 未指定的话默认挂载点容器宽度
   * 注意: 框架不可指定 container的高度， 因为item成员可能会溢出， 高度将会由 item 的多少自动决定
   * */
  containerWidth: number = null

  /**
   * item成员的宽度
   * */
  itemWidth: number = null

  /**
   * item成员的高度
   * */
  itemHeight: number = null

  /**
   * 左右间隔距离之和，单位px，如果和gap[0]优先级大于 gapX
   * */
  gapX: number = null

  /**
   * 上下间隔距离之和，单位px，如果和gap[1]优先级大于 gapY
   * */
  gapY: number = null

  /**
   * 在没有指定col的情况下， 假设 gap 和size自动分配 gap/size的比例 10:100 ratioCol值为0.1
   *
   * 注意: 必须为container所挂载的元素指定宽高,且col方向没有指定size和 gap 才能生效
   *
   * @default  0.1
   * */
  ratioCol: number = 0.1

  /**
   * 在没有指定row的情况下， 假设 gap 和size自动分配 gap/size的比例 10:100 ratioRow值为0.1
   *
   * 注意: 必须为container所挂载的元素指定宽高，,且row方向没有指定size和 gap 才能生效
   *
   * @default  0.1
   * */
  ratioRow: number = 0.1

  /**
   * 触屏下长按多久响应拖拽事件,默认360ms
   * @default 360
   * */
  pressTime: number = 360   // 触屏下长按多久响应拖拽事件,默认360ms
}
