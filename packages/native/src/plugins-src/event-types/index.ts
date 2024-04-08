import {CustomEventOptions} from "@/types";
import {BaseEvent, EachEvent, MouseGridEvent, ThrowMessageEvent} from "@/plugins-src";

export * from './BaseEvent'
export * from './EachEvent'
export * from './ThrowMessageEvent'
export * from './MouseGridEvent'

export const EventMap: Record<keyof CustomEventOptions | string, any> = {
  '*': BaseEvent,
  //--------------other-------------------
  error: ThrowMessageEvent,
  //-----------------container------------------
  containerMountBefore: BaseEvent,
  containerMounted: BaseEvent,
  containerUnmounted: BaseEvent,
  containerResizing: BaseEvent,
  //-------------------item---------------------
  itemMounted: BaseEvent,
  itemUnmounted: BaseEvent,
  //--------------each------------------
  each: EachEvent,
  //--------------click------------------
  click: MouseGridEvent,
  mousedown: MouseGridEvent,
  mousemove: MouseGridEvent,
  mouseup: MouseGridEvent,
  layout: BaseEvent,
}
