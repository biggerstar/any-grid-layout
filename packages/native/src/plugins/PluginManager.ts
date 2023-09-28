import {Container} from "@/main";
import {isFunction, isObject} from 'is-what'
import * as AllDefaultBehavior from "@/plugins/default-behavior";
import {EventMap} from './event-types'
import {CustomEventOptions, GridPlugin} from "@/types";
import {tempStore} from "@/global";

let DefaultBehavior = {}
for (const name in AllDefaultBehavior) {
  Object.assign(DefaultBehavior, AllDefaultBehavior[name])
}

/**
 * 插件管理器
 *
 * 内置事件:
 *    $$defaultActionFn   [内置用] 在[事件对象实例化之前]前调用,不可被阻止
 *    $defaultActionFn    [内置用] 在事件对象[所有插件回调前]调用,不可被阻止
 *    defaultActionFn$    [内置用] 在事件对象[所有插件回调之后]调用,不可被阻止
 *    defaultActionFn$$   [内置用] 默认事件被执行后调用,不可被阻止
 * */
export class PluginManager {
  public container: Container
  public plugins: CustomEventOptions[] = []
  public DefaultBehavior: Record<any, any>   // 所有的内置事件，给了外部拓展内置事件的可能性
  constructor(container) {
    this.container = container
    this.DefaultBehavior = DefaultBehavior
    container.bus.on('*', (eventName, options) => this.call(<any>eventName, options))
  }

  /**
   * 调用当前插件列表中的插件回调函数
   * */
  public call(eventName: keyof CustomEventOptions, options: Record<any, any> = {}) {
    // if (!['getConfig', 'setConfig', 'dragging', 'updateCloneElementStyle', 'each', 'flip', 'dragToBlank'].includes(eventName)) {
    //   console.log(eventName)
    // }
    const container = this.container
    const GEvent = EventMap[eventName] || EventMap['*']
    const defaultActionFn: Function = DefaultBehavior[eventName]   //  [内置用] 在event$之后执行,可被外部插件阻止
    const $$defaultActionFn: Function = DefaultBehavior[`$$${eventName}`]   // [内置用] 在[事件对象实例化之前]前调用,不可被阻止
    const $defaultActionFn: Function = DefaultBehavior[`$${eventName}`]   // [内置用] 在事件对象[所有插件回调前]调用,不可被阻止
    const defaultActionFn$: Function = DefaultBehavior[`${eventName}$`]   // [内置用] 在事件对象[所有插件回调之后]调用,不可被阻止
    const defaultActionFn$$: Function = DefaultBehavior[`${eventName}$$`]   // [内置用] 默认事件被执行后调用,不可被阻止

    // 事件对象实例化之前的事件，不可被用户插件阻止
    if (isFunction($$defaultActionFn)) $$defaultActionFn.call(null, options)
    const ev = new (<any>GEvent)({
      name: eventName,
      container: container,
      default: (...args) => isFunction(defaultActionFn) && defaultActionFn(...args),   // 默认行为函数，执行该函数可执行默认行为
    })
    const eventCallback: Function = options.callback
    if (eventCallback) delete options.eventCallback

    // 合并外部传入配置到ev对象中，
    Object.assign(ev, options)

    // 将ev中的undefined置成null
    Object.keys(ev).forEach(name => ev[name] === void 0 ? ev[name] = null : void 0)

    // 插件执行之前的内置事件，不可被用户插件阻止
    if (isFunction($defaultActionFn)) $defaultActionFn.call(null, ev)

    // 执行用户插件
    this.plugins.forEach((plugin) => {
      const callFunc: Function = <any>plugin[eventName]
      if (isFunction(callFunc)) callFunc.call(plugin, ev)
    })

    // 插件执行之后的内置事件，不可被用户插件阻止
    if (isFunction(defaultActionFn$)) defaultActionFn$.call(null, ev)

    // 最后执行默认行为函数
    if (!ev.defaultPrevented && isFunction(ev.default)) {
      (ev.default || defaultActionFn)?.call(null, ev)  // 内置的插件没有this
    }

    // 默认函数执行之后的内置事件，不可被用户插件阻止
    if (isFunction(defaultActionFn$$)) defaultActionFn$$.call(null, ev)

    // 如果外部有指定emit的callback函数回调，将最终ev回调的回调函数
    if (isFunction(eventCallback)) eventCallback.call(null, ev)

    if (ev.defaultPrevented) {
      if (eventName === 'dragging') tempStore.preventDragging = true
      if (eventName === 'resizing') tempStore.preventResizing = true
    }
  }

  /**
   * 添加一个自定义插件，是一个普通js对象而不是一个类
   * */
  public use(plugin: GridPlugin) {
    if (isFunction(plugin)) plugin.call(null, this.container)
    else if (isObject(plugin)) {
      if (isFunction(plugin.install)) plugin.install.call(null, this.container)
      this.plugins.push(plugin)
    }
  }

  /**
   * 检测插件中是否存在某个事件
   * */
  public hasEvent(name: keyof CustomEventOptions) {
    return this.plugins.find(plugin => isFunction(plugin[name]))
  }
}
