import {CustomEventOptions} from "@/types";

export function definePlugin(plugin: Record<keyof CustomEventOptions, any> & Record<any, any>) {
  return plugin
}
