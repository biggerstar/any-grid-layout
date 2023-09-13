// noinspection JSUnusedGlobalSymbols

import {ThrowMessageEvent} from "@/plugins/event-types/ThrowMessageEvent";
import {isFunction} from "is-what";
import {definePlugin} from "@/global";

export const ThrowMessageBehavior = definePlugin({
  /**
   * 抛出错误，若插件中有定义error函数接住错误则不抛出
   * */
  error(ev: ThrowMessageEvent) {
    const plugins = ev.pluginManager.plugins
    const found = plugins.find(plugin => isFunction(plugin.error))
    if (found) console.error(ev.type ? `[${ev.type}]` : '', ev.message, ev)
  },
  warn(ev: ThrowMessageEvent) {
    const plugins = ev.pluginManager.plugins
    const found = plugins.find(plugin => isFunction(plugin.warn))
    if (!found) console.warn(ev.type ? `[${ev.type}]` : '', ev.message, ev)
  }
})
