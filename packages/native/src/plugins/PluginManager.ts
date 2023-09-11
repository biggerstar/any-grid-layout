import {Container} from "@/main";
import {isFunction, isObject} from 'is-what'
import * as AllDefaultBehavior from "@/plugins/default-behavior";
import {EventMap} from './event-type'
import {CustomEventOptions} from "@/types";

let DefaultBehavior = {}
for (const name in AllDefaultBehavior) {
  Object.assign(DefaultBehavior, AllDefaultBehavior[name])
}
/**
 * 插件管理器
 * */
export class PluginManager {
  public container: Container
  public plugins: CustomEventOptions[] = []

  constructor(container) {
    this.container = container
    container.bus.on('*', (eventName, ...args) => this.call(<string>eventName, ...args))
  }

  /**
   * 调用当前插件列表中的插件回调函数
   * */
  public call(eventName: keyof CustomEventOptions, ...args) {
    const GEvent = EventMap[eventName] || EventMap['*']
    const defaultActionFn: Function = DefaultBehavior[eventName]
    const ev = new GEvent(eventName, {
      args,
      container: this.container,
      layoutManager: this.container.layoutManager,
      default: (...args) => isFunction(defaultActionFn) && defaultActionFn(...args),   // 默认行为函数，执行该函数可执行默认行为
    })
    this.plugins.forEach((plugin) => {
      const callFunc: Function = <any>plugin[eventName]
      if (isFunction(callFunc)) callFunc.call(plugin, ev, ...args)
    })
    if (!ev.isPrevent && isFunction(ev.default)) {  // 默认行为函数在最后执行
      (ev.default || defaultActionFn)?.call(null, ev, ...args)  // 内置的插件没有this
    }
  }

  /**
   * 添加一个自定义插件，是一个普通js对象而不是一个类
   * */
  public use(plugin: CustomEventOptions) {
    if (isObject(plugin)) this.plugins.push(plugin)
  }
}
