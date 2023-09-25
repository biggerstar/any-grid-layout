import {BaseEvent} from "@/plugins";
import {LayoutItemInfo, PointType} from "@/types";

export class MatrixEvent extends BaseEvent {
  /**
   * 和getConfig获取的键值一致，正常是获取外部用户实例化传入的配置信息
   * */
  public readonly direction: string = ''

  /**
   * 和getConfig获取的键值一致，正常是获取外部用户实例化传入的配置信息
   * */
  public readonly align: string = ''

  /**
   * 和getConfig获取的键值一致，正常是获取外部用户实例化传入的配置信息
   * */
  public readonly autoGrow: boolean

  /**
   * 构成当前要遍历的坐标点，和point2构成一个小矩阵，正常只是一块小区域而非整个大矩阵
   * */
  public readonly point1: PointType | null

  /**
   * 构成当前要遍历的坐标点，和point1构成一个小矩阵，正常只是一块小区域而非整个大矩阵
   * */
  public readonly point2: PointType | null

  /**
   * flip 事件专用:
   * 需要翻转的item，正常只是矩阵中的一个小区域，每个item是独立翻转的
   * */
  public readonly flipInfo: LayoutItemInfo

  /**
   * expandLine 事件专用:
   * 如果当前容器溢出的话需要拓展的行数或列数，需手动实现
   * 可直接调用 layoutManager.addRow  layoutManager.addCol 进行添加
   * */
  public readonly expandLineNumber: number | null

  constructor(opt) {
    super(opt);
    this.direction = <any>this.container.getConfig('direction')
    this.align = <any>this.container.getConfig('align')
    this.autoGrow = this.container.getConfig('autoGrow')
  }

  /**
   * 在emit事件的时候需要对next进行实现
   *
   * @return {boolean} 如果返回true的时候表示可以退出循环，需要在each钩子里面判断返回值并在true的时候使用break退出
   * */
  public next: (x: number, y: number) => true | void
}

