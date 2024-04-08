import {BaseEvent} from "@/plugins-src";

export class EachEvent extends BaseEvent {
  /**
   * 在emit事件的时候需要对next进行实现
   *
   * @return {boolean} 如果返回true的时候表示可以退出循环，需要在each钩子里面判断返回值并在true的时候使用break退出
   * */
  public declare next: (x: number, y: number) => true | void
}

