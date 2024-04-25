import {LayoutManager} from "@/main";

export class OnEach {
  /**
   * 在emit事件的时候需要对next进行实现
   *
   * @return {boolean} 如果返回true的时候表示可以退出循环，需要在each钩子里面判断返回值并在true的时候使用break退出
   * */
  public declare next: (curRow: number, curCol: number) => true | void
  public declare layoutManager: LayoutManager
}
