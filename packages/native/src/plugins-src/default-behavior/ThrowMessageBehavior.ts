// noinspection JSUnusedGlobalSymbols

import {ThrowMessageEvent} from "@/plugins-src/event-types/ThrowMessageEvent";
import {definePlugin} from "@/global";

export const ThrowMessageBehavior = definePlugin({
  /**
   * 抛出错误，若插件中有定义error函数接住错误则不抛出
   * */
  error(ev: ThrowMessageEvent) {
    console.error(ev.type ? `[${ev.type}]` : '', ev.message, ev)
  },
  warn(ev: ThrowMessageEvent) {
    console.warn(ev.type ? `[${ev.type}]` : '', ev.message, ev)
  }
})
