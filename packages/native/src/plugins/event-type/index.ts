
export * from './BaseEvent'
export * from './ItemDragEvent'
export * from './ItemResizeEvent'
export * from './ItemLayoutEvent'
export * from './ThrowMessageEvent'
export * from './CrossContainerExchangeEvent'

import {CustomEventOptions} from "@/types";
import {BaseEvent} from "@/plugins/event-type/BaseEvent";
import {ItemLayoutEvent} from "@/plugins/event-type/ItemLayoutEvent";
import {ItemResizeEvent} from "@/plugins/event-type/ItemResizeEvent";
import {ItemDragEvent} from "@/plugins/event-type/ItemDragEvent";
import {ThrowMessageEvent} from "@/plugins/event-type/ThrowMessageEvent";
import {CrossContainerExchangeEvent} from "@/plugins/event-type/CrossContainerExchangeEvent";

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
  dragToBlank: ItemDragEvent,
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
  crossSource:CrossContainerExchangeEvent,
  crossTarget:CrossContainerExchangeEvent,
}
