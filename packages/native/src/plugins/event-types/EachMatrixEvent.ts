import {BaseEvent} from "@/plugins";
import {LayoutItemInfo, PointType} from "@/types";

export class EachMatrixEvent extends BaseEvent {
  public direction: string = ''
  public align: string = ''
  public autoGrow: boolean
  public point1: PointType
  public point2: PointType
  public flipInfo: LayoutItemInfo

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

