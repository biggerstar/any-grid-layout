import {isFunction, isObject} from 'is-what'
import {BaseEmitData, GridPluginEntry} from "@/types";

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
export class PluginManager<Instance extends Record<string, any>, Plugin extends Record<any, Function>> {
  public plugins: Plugin[] = []
  public instance: Instance
  public EventMap: Record<keyof Plugin, BaseEmitData<Plugin>>

  /**
   * @param instance 实例
   * @param bus  事件通道 EventBus
   * @param EventMap 事件对应的 event 类的映射，将会在触发的时候实例化该类, 推荐使用 mitt 库
   * */
  constructor(instance: any, bus: any, EventMap: Record<any, any> = {}) {
    this.EventMap = EventMap
    this.instance = instance
    bus.on('*', (eventName: string, options: Record<any, any>) => {
      if (!this.EventMap[eventName]) {
        throw new Error(`${eventName} 事件未被支持`)
      }
      const eventParam = {
        ...options,
        name: eventName,
        instance: this.instance,
      }
      // @ts-ignore
      const ev = new this.EventMap[eventName](eventParam)
      // 合并外部传入配置到ev对象中，
      Object.assign(ev, eventParam)
      // 将ev中的 undefined 置成 null
      Object.keys(ev).forEach(name => ev[name] === void 0 ? ev[name] = null : void 0)
      this.call(eventName, ev)
    })
  }

  /**
   * 调用当前插件列表中的插件回调函数
   * */
  public call<Name extends keyof Plugin>(eventName: Name, ev: BaseEmitData<Plugin>[Name]) {
    // 执行用户插件
    this.plugins.forEach((plugin) => isFunction(plugin[eventName]) && plugin[eventName].call(plugin, ev))
  }

  /**
   * 添加一个自定义插件，是一个普通js对象而不是一个类
   * */
  public use(plugin: GridPluginEntry<Plugin>) {
    if (isFunction(plugin)) {
      plugin.call(null, this.instance)
    } else {
      if (isObject(plugin)) {
        if (isFunction(plugin.install)) {
          plugin.install.call(null, this.instance)
        }
        this.plugins.push(plugin)
      }
    }
  }
}
