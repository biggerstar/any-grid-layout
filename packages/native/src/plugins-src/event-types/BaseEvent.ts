import {Container, Item} from "@/main";
import {CustomEventOptions} from "@/types";
import {tempStore} from "@/global";

export class BaseEvent {
  public readonly name: keyof CustomEventOptions | null

  constructor(options: any) {
    this.item = tempStore.fromItem
    this.name = null
    Object.assign(<object>this, options || {})   // 合并外部emit发射的参数2对象
  }

  // @ts-ignore
  public readonly container: Container   // 当前操作所在的container
  public item: Item | null = null  // 操作item的时候的目标item
  public prevented: boolean = false   // 是否调用了prevent阻止了默认事件

  /**
   * 阻止内置的默认行为
   * */
  prevent() {
    this.prevented = true
  }

  /**
   * 该事件的默认执行执行函数，在实例化的时候会被管理器赋予执行逻辑函数，开发者也可以通过外部替换该函数更改默认行为，或者通过prevent函数阻止默认行为
   * */
  public default() {
  }
}
