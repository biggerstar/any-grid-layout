import {Container, Item} from "@/main";
import {CustomEventOptions} from "@/types";
import {LayoutManager} from "@/algorithm";
import {PluginManager} from "@/plugins";

export class BaseEvent {
  public name: keyof CustomEventOptions

  constructor(options = {}) {
    Object.assign(<object>this, options)
  }

  public readonly container: Container
  public readonly item: Item | null = null
  public readonly layoutManager: LayoutManager
  public readonly pluginManager: PluginManager
  public isPrevent: boolean = false

  // public shared: object   // 事件组对象流传播共享数据的对象，比如dragging -> dragToXXX -> dragend

  /**
   * 阻止内置的默认行为
   * */
  prevent() {
    this.isPrevent = true
  }

  /**
   * 该事件的默认执行执行函数，在实例化的时候会被管理器赋予执行逻辑函数，开发者也可以通过外部替换该函数更改默认行为，或者通过prevent函数阻止默认行为
   * */
  public default() {
  }
}
