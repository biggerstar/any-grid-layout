import {CustomEventOptions} from "@/types";
import {
  OnClick,
  OnContainerMountBefore,
  OnContainerMounted,
  OnContainerResizing,
  OnContainerUnmounted,
  OnEach,
  OnError,
  OnItemMounted,
  OnItemUnmounted,
  OnLayout,
  OnMousedown,
  OnMousemove,
  OnMouseup
} from "@/plugins-src";

export * from './base/InstanceBaseEvent'
export * from './throw-message/OnError'
export * from './container/OnContainerMountBefore'
export * from './container/OnContainerMounted'
export * from './container/OnContainerMounted'
export * from './container/OnContainerUnmounted'
export * from './container/OnContainerResizing'
export * from './item/OnItemMounted'
export * from './item/OnItemUnmounted'
export * from './layout/OnEach'
export * from './mouse/OnClick'
export * from './mouse/OnMousedown'
export * from './mouse/OnMousemove'
export * from './mouse/OnMouseup'
export * from './layout/OnLayout'

export const GridEventMap: Record<keyof CustomEventOptions, any> = {
  //--------------other-------------------
  error: OnError,
  //-----------------container------------------
  containerMountBefore: OnContainerMountBefore,
  containerMounted: OnContainerMounted,
  containerUnmounted: OnContainerUnmounted,
  containerResizing: OnContainerResizing,
  //-------------------item---------------------
  itemMounted: OnItemMounted,
  itemUnmounted: OnItemUnmounted,
  //--------------each------------------
  each: OnEach,
  //--------------click------------------
  click: OnClick,
  mousedown: OnMousedown,
  mousemove: OnMousemove,
  mouseup: OnMouseup,
  layout: OnLayout,
}
