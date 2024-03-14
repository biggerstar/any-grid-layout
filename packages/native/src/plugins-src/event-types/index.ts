import {ItemPosChangeEvent} from "@/plugins-src/event-types/ItemPosChangeEvent";
import {CustomEventOptions} from "@/types";
import {BaseEvent} from "@/plugins-src/event-types/BaseEvent";
import {ItemLayoutEvent} from "@/plugins-src/event-types/ItemLayoutEvent";
import {ThrowMessageEvent} from "@/plugins-src/event-types/ThrowMessageEvent";
import {InitOptionsEvent, MatrixEvent} from "@/plugins-src";
import {ContainerSizeChangeEvent} from "@/plugins-src/event-types/ContainerSizeChangeEvent";

export * from './BaseEvent'
export * from './ItemLayoutEvent'
export * from './ThrowMessageEvent'
export * from './ItemPosChangeEvent'
export * from './ContainerSizeChangeEvent'
export * from './InitOptionsEvent'
export * from './MatrixEvent'

export const EventMap: Record<keyof CustomEventOptions | string, any> = {
  '*': BaseEvent,
  //-------------throw-message-----------
  error: ThrowMessageEvent,
  warn: ThrowMessageEvent,
  //--------------other-------------------
  config: InitOptionsEvent,
  configResolved: InitOptionsEvent,
  updateLayout: ItemLayoutEvent,
  //-----------------container------------------
  containerMountBefore: BaseEvent,
  containerMounted: ItemLayoutEvent,
  containerUnmounted: ItemLayoutEvent,
  containerResizing: ContainerSizeChangeEvent,
  colChanged: ContainerSizeChangeEvent,
  rowChanged: ContainerSizeChangeEvent,
  //-------------------item---------------------
  addItemSuccess: BaseEvent,
  itemMounted: BaseEvent,
  itemUnmounted: BaseEvent,
  itemPosChanged: ItemPosChangeEvent,
  //--------------each------------------
  each: MatrixEvent,
  flip: MatrixEvent,
  //--------------every------------------
  every: BaseEvent,
  everyDone: BaseEvent,
  //--------------click------------------
  click: BaseEvent,

  mousedown: BaseEvent,
  mousemove: BaseEvent,
  mouseup: BaseEvent,
}
