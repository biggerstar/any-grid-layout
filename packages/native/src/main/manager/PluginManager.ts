import {Container} from "@/main";
import {isFunction, isObject} from 'is-what'
import {EventMap} from '../../plugins-src/event-types'
import {CustomEventOptions, GridPlugin} from "@/types";

/**
 * 插件管理器
 *    外部插件事件:
 *       defaultActionFn     外部插件的事件
 *       every               任何事件都会执行，在用户插件执行之前被调用
 *       everyDone           任何事件都会执行，在用户插件执行之后被调用
 *
 *    内置事件:
 *       $$defaultActionFn   [内置用] 在[事件对象实例化之前]前调用,不可被阻止
 *       $defaultActionFn    [内置用] 在事件对象[所有插件回调前]调用,不可被阻止
 *       defaultActionFn$    [内置用] 在事件对象[所有插件回调之后]调用,不可被阻止
 *       defaultActionFn$$   [内置用] 默认事件被执行后调用,不可被阻止
 * */
export class PluginManager {
  public container: Container
  public plugins: CustomEventOptions[] = []
  constructor(container: Container) {
    this.container = container
    container.bus.on('*', (eventName, options) => this.call(<any>eventName, options))
  }

  /**
   * 调用当前插件列表中的插件回调函数
   * */
  public call(eventName: keyof CustomEventOptions, options: Record<any, any> = {}) {
    const container = this.container
    const targetEvent = EventMap[eventName] || EventMap['*']
    const ev = new targetEvent({
      name: eventName,
      container: container,
    })
    // 合并外部传入配置到ev对象中，
    Object.assign(ev, options)
    // 将ev中的undefined置成null
    Object.keys(ev).forEach(name => ev[name] === void 0 ? ev[name] = null : void 0)
    // 执行用户插件
    this.plugins.forEach((plugin) => isFunction(plugin[eventName]) && plugin[eventName].call(plugin, ev))
  }

  /**
   * 添加一个自定义插件，是一个普通js对象而不是一个类
   * */
  public use(plugin: GridPlugin) {
    if (isFunction(plugin)) {
      plugin.call(null, this.container)
    } else {
      if (isObject(plugin)) {
        if (isFunction(plugin.install)) {
          plugin.install.call(null, this.container)
        }
        this.plugins.push(plugin)
      }
    }
  }
}
