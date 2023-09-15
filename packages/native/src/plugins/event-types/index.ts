
export * from './BaseEvent'
export * from './ItemDragEvent'
export * from './ItemResizeEvent'
export * from './ItemLayoutEvent'
export * from './ThrowMessageEvent'
export * from './ItemExchangeEvent'

import {CustomEventOptions} from "@/types";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ThrowMessageEvent} from "@/plugins/event-types/ThrowMessageEvent";
import {ItemExchangeEvent} from "@/plugins";

type EventMapType = Record<keyof CustomEventOptions, any> & Record<any, any>
export const EventMap: EventMapType = {
  '*': BaseEvent,
  //--------------other-------------------
  init: ItemLayoutEvent,
  updateLayout: ItemLayoutEvent,
  itemSizeChange: BaseEvent,
  //------------container-outer-move------------
  dragOuterLeft: ItemDragEvent,
  dragOuterRight: ItemDragEvent,
  dragOuterTop: ItemDragEvent,
  dragOuterBottom: ItemDragEvent,
  //--------------drag-------------------
  dragging: ItemDragEvent,
  dragend: ItemDragEvent,
  dragToTop: ItemDragEvent,
  dragToBottom: ItemDragEvent,
  dragToLeft: ItemDragEvent,
  dragToRight: ItemDragEvent,
  dragToRightBottom: ItemDragEvent,
  dragToLetBottom: ItemDragEvent,
  dragToLeftTop: ItemDragEvent,
  dragToRightTop: ItemDragEvent,
  //--------------resize-----------------
  containerResizing: ItemLayoutEvent,
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
  //-------------throw-message-----------
  error:ThrowMessageEvent,
  warn:ThrowMessageEvent,
  //-------------cross-container-exchange-----------
  exchange:ItemExchangeEvent,
  exchangeProvide:ItemExchangeEvent,
  exchangeProcess:ItemExchangeEvent,
  exchangeReceive:ItemExchangeEvent,
}
