import {Container, Item} from "@/main";
import {CustomEventOptions} from "@/types";

export class BaseEvent {
  public name: keyof CustomEventOptions

  constructor(options) {
    Object.assign(<object>this, options || {})   // 合并外部emit发射的参数2对象
  }

  public readonly container: Container  // 当前操作所在的container
  public readonly item: Item | null = null  // 操作item的时候的目标item
  public defaultPrevented: boolean = false   // 是否调用了prevent阻止了默认事件

  // public shared: object   // 事件组对象流传播共享数据的对象，比如dragging -> dragToXXX -> dragend

  /**
   * 阻止内置的默认行为
   * */
  prevent() {
    this.defaultPrevented = true
  }

  /**
   * 该事件的默认执行执行函数，在实例化的时候会被管理器赋予执行逻辑函数，开发者也可以通过外部替换该函数更改默认行为，或者通过prevent函数阻止默认行为
   * */
  public default() {
  }
}
