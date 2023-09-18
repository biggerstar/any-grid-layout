import {ItemPosChangeEvent} from "@/plugins/event-types/ItemPosChangeEvent";
import {CustomEventOptions, EventMapType} from "@/types";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ThrowMessageEvent} from "@/plugins/event-types/ThrowMessageEvent";
import {ItemExchangeEvent} from "@/plugins";
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


export const EventMap: EventMapType<CustomEventOptions> = {
  '*': BaseEvent,
  //-------------throw-message-----------
  error: ThrowMessageEvent,
  warn: ThrowMessageEvent,
  //--------------other-------------------
  init: ItemLayoutEvent,
  updateLayout: ItemLayoutEvent,
  getConfig: ConfigurationEvent,
  setConfig: ConfigurationEvent,
  //-----------------container------------------
  containerMounted: BaseEvent,
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
  dragToLeftTop: ItemDragEvent,
  dragToRightTop: ItemDragEvent,
  dragToRightBottom: ItemDragEvent,
  dragToLeftBottom: ItemDragEvent,
  dragOuterTop: ItemDragEvent,
  dragOuterRight: ItemDragEvent,
  dragOuterBottom: ItemDragEvent,
  dragOuterLeft: ItemDragEvent,
  //--------------resize-----------------
  resizing: ItemResizeEvent,
  resized: ItemResizeEvent,
  resizeToTop: ItemResizeEvent,
  resizeToRight: ItemResizeEvent,
  resizeToBottom: ItemResizeEvent,
  resizeToLeft: ItemResizeEvent,
  resizeOuterTop: ItemResizeEvent,
  resizeOuterRight: ItemResizeEvent,
  resizeOuterBottom: ItemResizeEvent,
  resizeOuterLeft: ItemResizeEvent,
  //--------------close------------------
  closing: ItemLayoutEvent,
  closed: ItemLayoutEvent,
  //-------------cross-container-exchange-----------
  exchange: ItemExchangeEvent,
  exchangeProvide: ItemExchangeEvent,
  exchangeProcess: ItemExchangeEvent,
  exchangeReceive: ItemExchangeEvent,
}
