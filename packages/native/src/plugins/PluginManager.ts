import {Container} from "@/main";
import {isFunction, isObject} from 'is-what'
import * as AllDefaultBehavior from "@/plugins/default-behavior";
import {EventMap} from './event-types'
import {CustomEventOptions} from "@/types";
import {tempStore} from "@/global";

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
    container.bus.on('*', (eventName, options) => this.call(<any>eventName, options))
  }

  /**
   * 调用当前插件列表中的插件回调函数
   * */
  public call(eventName: keyof CustomEventOptions, options: Record<any, any> = {}) {
    // if (!['dragging'].includes(eventName)) console.log(eventName)
    const container = this.container
    const GEvent = EventMap[eventName] || EventMap['*']
    const defaultActionFn: Function = DefaultBehavior[eventName]
    const $defaultActionFn: Function = DefaultBehavior[`$${eventName}`]   // 内置用，在事件对象实例化所有插件回调前调用,不可被阻止
    const ev = new (<any>GEvent)({
      name: eventName,
      container: container,
      layoutManager: container.layoutManager,
      pluginManager: container.pluginManager,
      default: (...args) => isFunction(defaultActionFn) && defaultActionFn(...args),   // 默认行为函数，执行该函数可执行默认行为
    })
    const eventCallback: Function = options.callback
    if (eventCallback) delete options.eventCallback
    Object.assign(ev, options)
    Object.keys(ev).forEach(name => ev[name] === void 0 ? ev[name] = null : void 0)  // 将undefined置成null
    if (isFunction($defaultActionFn)) $defaultActionFn.call(null, ev)
    this.plugins.forEach((plugin) => {
      const callFunc: Function = <any>plugin[eventName]
      if (isFunction(callFunc)) callFunc.call(plugin, ev)
    })
    if (!ev.isPrevent && isFunction(ev.default)) {  // 默认行为函数在最后执行
      (ev.default || defaultActionFn)?.call(null, ev)  // 内置的插件没有this
    }
    if (isFunction(eventCallback)) eventCallback.call(null, ev)  // 如果有回调，将最终ev回调给外部传入的回调函数
    if (ev.isPrevent) {
      if (eventName === 'dragging') tempStore.preventDragging = true
      if (eventName === 'resizing') tempStore.preventResizing = true
    }
  }

  /**
   * 添加一个自定义插件，是一个普通js对象而不是一个类
   * */
  public use(plugin: CustomEventOptions) {
    if (isObject(plugin)) this.plugins.push(plugin)
  }

  /**
   * 检测插件中是否存在某个事件
   * */
  public hasEvent(name: keyof CustomEventOptions) {
    return this.plugins.find(plugin => isFunction(plugin[name]))
  }
}
