import {BaseEvent} from './BaseEvent'
import {CustomEventOptions} from "@/types";
import {ItemLayoutEvent} from "@/plugin/event-type/ItemLayoutEvent";
import {ItemResizeEvent} from "@/plugin/event-type/ItemResizeEvent";

type EventMapType = Record<keyof CustomEventOptions, any> & Record<any, any>
export const EventMap: EventMapType = {
  '*': BaseEvent,
  //--------------other-------------------
  init: ItemLayoutEvent,
  updateLayout: ItemLayoutEvent,
  //------------container-move-------------------
  dragOutsizeLeft: ItemLayoutEvent,
  dragOutsizeRight: ItemLayoutEvent,
  dragOutsizeTop: ItemLayoutEvent,
  dragOutsizeBottom: ItemLayoutEvent,
  //--------------drag-------------------
  itemMoving: ItemLayoutEvent,
  itemMoved: ItemLayoutEvent,
  dragToBlank: ItemLayoutEvent,
  dragToTop: ItemLayoutEvent,
  dragToBottom: ItemLayoutEvent,
  dragToLeft: ItemLayoutEvent,
  dragToRight: ItemLayoutEvent,
  dragToRightBottom: ItemLayoutEvent,
  dragToLetBottom: ItemLayoutEvent,
  dragToLeftTop: ItemLayoutEvent,
  dragToRightTop: ItemLayoutEvent,
  //--------------resize-----------------
  containerResizing: ItemLayoutEvent,
  itemResizing: ItemResizeEvent,
  itemResized: ItemResizeEvent,
  resizeToTop: ItemResizeEvent,
  resizeToRight: ItemResizeEvent,
  resizeToBottom: ItemResizeEvent,
  resizeToLeft: ItemResizeEvent,
  resizeOutsizeTop: ItemResizeEvent,
  resizeOutsizeRight: ItemResizeEvent,
  resizeOutsizeBottom: ItemResizeEvent,
  resizeOutsizeLeft: ItemResizeEvent,
  //--------------close------------------
  itemClosing: ItemLayoutEvent,
  itemClosed: ItemLayoutEvent,
}
