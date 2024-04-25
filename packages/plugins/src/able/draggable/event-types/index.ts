import {OnDragging, OnDragToBottom, OnDragToLeft, OnDragToRight, OnDragToTop} from "@/able/draggable";

export * from './base/DragBaseEvent'
export * from './drag/OnDragging'
export * from './drag/OnDragToTop'
export * from './drag/OnDragToLeft'
export * from './drag/OnDragToBottom'
export * from './drag/OnDragToRight'

export type DraggableEventBusType = {
  /**
   * mousedown 没有按住  dragging 鼠标按住
   * */
  dragging?(ev: OnDragging): void,
  //-----------------拖动到十字线方向的事件---------------------
  dragToTop?(ev: OnDragToTop): void,
  dragToLeft?(ev: OnDragToLeft): void,
  dragToBottom?(ev: OnDragToBottom): void,
  dragToRight?(ev: OnDragToRight): void,
}

export const DraggableEventMap: Record<keyof DraggableEventBusType, any> = {
  dragging: OnDragging,
  dragToTop: OnDragToTop,
  dragToLeft: OnDragToLeft,
  dragToBottom: OnDragToBottom,
  dragToRight: OnDragToRight,
}
