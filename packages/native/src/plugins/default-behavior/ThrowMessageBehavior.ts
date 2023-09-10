// noinspection JSUnusedGlobalSymbols

import {definePlugin} from "@/plugins";
import {ThrowMessageEvent} from "@/plugins/event-type/ThrowMessageEvent";
import {isFunction} from "is-what";

export const ThrowMessageBehavior = definePlugin({
  error(ev: ThrowMessageEvent) {
    const plugins = ev.container.pluginManager.plugins
    const found = plugins.find(plugin => isFunction(plugin.error))
    if (found) return  // 插件中只要有error接住错误则不抛出
    // throw new Error()
    console.error(`[${ev.type}]`, ev.message, ev)
  },
  warn(ev: ThrowMessageEvent) {
    const plugins = ev.container.pluginManager.plugins
    const found = plugins.find(plugin => isFunction(plugin.warn))
    if (found) return  // 插件中只要有warn接住错误则不抛出
    console.warn(`[${ev.type}]`, ev.message, ev)
  }
})
