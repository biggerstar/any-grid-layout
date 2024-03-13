import {ItemPosChangeEvent} from "@/plugins-src/event-types/ItemPosChangeEvent";
import {CustomEventOptions} from "@/types";
import {BaseEvent} from "@/plugins-src/event-types/BaseEvent";
import {ItemLayoutEvent} from "@/plugins-src/event-types/ItemLayoutEvent";
import {ItemResizeEvent} from "@/plugins-src/event-types/ItemResizeEvent";
import {ItemDragEvent} from "@/plugins-src/event-types/ItemDragEvent";
import {ThrowMessageEvent} from "@/plugins-src/event-types/ThrowMessageEvent";
import {GridClickEvent, InitOptionsEvent, ItemExchangeEvent, MatrixEvent} from "@/plugins-src";
import {ContainerSizeChangeEvent} from "@/plugins-src/event-types/ContainerSizeChangeEvent";
import {ConfigurationEvent} from "@/plugins-src/event-types/ConfigurationEvent";

export * from './BaseEvent'
export * from './ItemDragEvent'
export * from './ItemResizeEvent'
export * from './ItemLayoutEvent'
export * from './ThrowMessageEvent'
export * from './ItemExchangeEvent'
export * from './ItemPosChangeEvent'
export * from './ContainerSizeChangeEvent'
export * from './ConfigurationEvent'
export * from './InitOptionsEvent'
export * from './MatrixEvent'
export * from './GridClickEvent'

export const EventMap: Record<keyof CustomEventOptions | string, any> = {
  '*': BaseEvent,
  //-------------throw-message-----------
  error: ThrowMessageEvent,
  warn: ThrowMessageEvent,
  //--------------other-------------------
  config: InitOptionsEvent,
  configResolved: InitOptionsEvent,
  updateLayout: ItemLayoutEvent,
  getConfig: ConfigurationEvent,
  setConfig: ConfigurationEvent,
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
  //--------------drag-------------------
  dragging: ItemDragEvent,
  dragend: ItemDragEvent,
  dragToTop: ItemDragEvent,
  dragToRight: ItemDragEvent,
  dragToBottom: ItemDragEvent,
  dragToLeft: ItemDragEvent,
  dragToBlank: ItemDragEvent,
  //--------------resize-----------------
  resizing: ItemResizeEvent,
  resized: ItemResizeEvent,
  resizeToTop: ItemResizeEvent,
  resizeToRight: ItemResizeEvent,
  resizeToBottom: ItemResizeEvent,
  resizeToLeft: ItemResizeEvent,
  //-------------cross-container-exchange-----------
  exchangeVerification: ItemExchangeEvent,
  exchangeProvide: ItemExchangeEvent,
  exchangeProcess: ItemExchangeEvent,
  exchangeReceive: ItemExchangeEvent,
  //--------------each------------------
  each: MatrixEvent,
  flip: MatrixEvent,
  //--------------every------------------
  every: BaseEvent,
  everyDone: BaseEvent,
  //--------------click------------------
  click: GridClickEvent,

  mousedown: BaseEvent,
  mousemove: BaseEvent,
  mouseup: BaseEvent,
}
