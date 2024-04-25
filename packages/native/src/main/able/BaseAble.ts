// noinspection JSUnusedGlobalSymbols

import {OnClick, OnMousedown, OnMousemove, OnMouseup, PluginManager} from "@/plugins-src";
import {Container} from "@/main";
import Bus, {Emitter} from "mitt";
import {BaseEmitData, GridPluginEntry} from "@/types";

export type BaseAbleEventBusType = {
  /**
   * 点击容器或者item触发的事件
   * */
  click?(ev: OnClick): void;
  mousedown?(ev: OnMousedown): void;
  mousemove?(ev: OnMousemove): void;
  mouseup?(ev: OnMouseup): void;
}

class State {
}

export abstract class BaseAble<BusEmitter, State> {
  public abstract setState(state: State): void

  public state: State
  public readonly container: Container
  public readonly bus: Emitter<BaseEmitData<BusEmitter>> = Bus()
  public readonly pluginManager: PluginManager<this, BusEmitter & BaseAbleEventBusType>

  protected constructor(container: Container, EventMap: BaseEmitData<BusEmitter>) {
    this.pluginManager = new PluginManager(this, this.bus, EventMap)
    this.container = container
    this.state = new State() as any
    const _this = this
    container.use({
        click: (ev) => _this.pluginManager.call('click', ev),
        mousedown: (ev) => _this.pluginManager.call('mousedown', ev),
        mousemove: (ev) => _this.pluginManager.call('mousemove', ev),
        mouseup: (ev) => _this.pluginManager.call('mouseup', ev),
      }, {
        hotSwappable: true
      }
    )
  }

  /**
   *  添加 Able 小插件
   * */
  public use(plugin: GridPluginEntry<BusEmitter & BaseAbleEventBusType>): this {
    this.pluginManager.use(plugin as any)
    return this
  }
}
