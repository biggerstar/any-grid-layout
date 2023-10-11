import {ItemPosChangeEvent} from "@/plugins/event-types/ItemPosChangeEvent";
import {CustomEventOptions, EventMapType} from "@/types";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ThrowMessageEvent} from "@/plugins/event-types/ThrowMessageEvent";
import {CloneElementStyleEvent, GridClickEvent, InitOptionsEvent, ItemExchangeEvent, MatrixEvent} from "@/plugins";
import {ContainerSizeChangeEvent} from "@/plugins/event-types/ContainerSizeChangeEvent";
import {ConfigurationEvent} from "@/plugins/event-types/ConfigurationEvent";

export * from './BaseEvent'
export * from './ItemDragEvent'
export * from './ItemResizeEvent'
export * from './ItemLayoutEvent'
export * from './ThrowMessageEvent'
export * from './ItemExchangeEvent'
export * from './ItemPosChangeEvent'
export * from './ContainerSizeChangeEvent'
export * from './ConfigurationEvent'
export * from './CloneElementStyleEvent'
export * from './InitOptionsEvent'
export * from './MatrixEvent'
export * from './GridClickEvent'


export const EventMap: EventMapType<CustomEventOptions> = {
  '*': BaseEvent,
  //-------------throw-message-----------
  error: ThrowMessageEvent,
  warn: ThrowMessageEvent,
  //--------------other-------------------
  config: InitOptionsEvent,
  configResolved: InitOptionsEvent,
  updateLayout: ItemLayoutEvent,
  updateCloneElementStyle: CloneElementStyleEvent,
  getConfig: ConfigurationEvent,
  setConfig: ConfigurationEvent,
  //-----------------container------------------
  containerMountBefore: BaseEvent,
  containerMounted: ItemLayoutEvent,
  containerUnmounted: BaseEvent,
  containerResizing: ContainerSizeChangeEvent,
  containerSizeChanged: ContainerSizeChangeEvent,
  colChanged: ContainerSizeChangeEvent,
  rowChanged: ContainerSizeChangeEvent,
  //-------------------item---------------------
  addItemSuccess: BaseEvent,
  itemMounted: BaseEvent,
  itemUnmounted: BaseEvent,
  itemSizeChanged: ItemPosChangeEvent,
  itemPositionChanged: ItemPosChangeEvent,
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
  //--------------close------------------
  closing: ItemLayoutEvent,
  closed: ItemLayoutEvent,
  //-------------cross-container-exchange-----------
  exchangeVerification: ItemExchangeEvent,
  exchangeProvide: ItemExchangeEvent,
  exchangeProcess: ItemExchangeEvent,
  exchangeReceive: ItemExchangeEvent,
  //--------------each------------------
  each: MatrixEvent,
  flip: MatrixEvent,
  //--------------every------------------
  every:BaseEvent,
  everyDone:BaseEvent,
  //--------------click------------------
  click:GridClickEvent,
}
