import {Container} from "@/main";
import {isFunction, isObject} from 'is-what'
import * as AllDefaultBehavior from "@/plugins/default-behavior";
import {EventMap} from './event-type'
import {CustomEventOptions} from "@/types";

let DefaultBehavior = {}
for (const name in AllDefaultBehavior) {
  Object.assign(DefaultBehavior, AllDefaultBehavior[name])
}


export class PluginManager {
  public container: Container
  public plugins = []

  constructor(container) {
    this.container = container
    container.bus.on('*', (eventName, ...args) => this.call(<string>eventName, ...args))
  }

  /**
   * 调用当前插件列表中的插件回调函数
   * */
  public call(eventName: keyof CustomEventOptions | string, ...args) {
    const GEvent = EventMap[eventName] || EventMap['*']
    const defaultActionFn: Function = DefaultBehavior[eventName]
    const ev = new GEvent(eventName, {
      target: this.container,
      container: this.container,
      layoutManager: this.container.layoutManager,
      default: (...args) => isFunction(defaultActionFn) && defaultActionFn(ev, ...args),   // 默认行为函数，执行该函数可执行默认行为
    })
    this.plugins.forEach((plugin) => {
      const callFunc: Function = plugin[eventName]
      if (isFunction(callFunc)) callFunc.call(plugin, ev, ...args)
    })
    if (!ev.isPrevent && isFunction(ev.default)) {  // 默认行为函数在最后执行
      (ev.default || defaultActionFn)?.call(null, ev, ...args)
    }
  }

  /**
   * 添加一个自定义插件，是一个普通js对象而不是一个类
   * 如果想开发一个插件，请继承Layout类后进行开发
   * layoutPlugin 接收的是 Layout的实现类的实例
   * 请注意:如果是布局算法，算法名称是必须的，如果指定了算法名称后，你可以在外部container的layoutMode配置中指定使用该算法
   * */
  public use(plugin: CustomEventOptions) {
    if (isObject(plugin)) this.plugins.push(plugin)
  }
}

