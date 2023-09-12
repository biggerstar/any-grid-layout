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
    container.bus.on('*', (eventName, options) => this.call(<string>eventName, options))
  }

  /**
   * 调用当前插件列表中的插件回调函数
   * */
  public call(eventName: keyof CustomEventOptions, options = {}) {
    const container = this.container
    const GEvent = EventMap[eventName] || EventMap['*']
    const defaultActionFn: Function = DefaultBehavior[eventName]
    const $defaultActionFn: Function = DefaultBehavior[`$${eventName}`]   // 内置用，在事件对象实例化所有插件回调前调用
    const ev = new GEvent({
      name: eventName,
      container: container,
      layoutManager: container.layoutManager,
      pluginManager: container.pluginManager,
      default: (...args) => isFunction(defaultActionFn) && defaultActionFn(...args),   // 默认行为函数，执行该函数可执行默认行为
    })
    Object.assign(ev, options)
    if (isFunction($defaultActionFn)) $defaultActionFn.call(null, ev)
    this.plugins.forEach((plugin) => {
      const callFunc: Function = <any>plugin[eventName]
      if (isFunction(callFunc)) callFunc.call(plugin, ev)
    })
    if (!ev.isPrevent && isFunction(ev.default)) {  // 默认行为函数在最后执行
      (ev.default || defaultActionFn)?.call(null, ev)  // 内置的插件没有this
    }
  }

  /**
   * 添加一个自定义插件，是一个普通js对象而不是一个类
   * */
  public use(plugin: CustomEventOptions) {
    if (isObject(plugin)) this.plugins.push(plugin)
  }
}
