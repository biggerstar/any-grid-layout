import {tempStore} from "@/store";
import {singleTouchToCommonEvent} from "@/utils";
import {prevent} from "@/events";
import {itemDragMouseup} from "@/events/item-drag/itemDragMouseup";

/** 做触屏和桌面端兼容 */
export function touchendOrMouseup(ev) {
  ev = ev || window['event']
  if (ev.touches) {
    clearTimeout(tempStore.timeOutEvent)
    tempStore.allowTouchMoveItem = false
    tempStore.deviceEventMode = 'touch'
    ev = singleTouchToCommonEvent(ev)
    document.removeEventListener('contextmenu', prevent.contextmenu)
  } else tempStore.deviceEventMode = 'mouse'
  itemDragMouseup(ev)    // 根据浏览器事件特性，触屏模式下快读点击情况下mouseup和touchend都会执行该函数，所以这里会执行两次但是不影响基本功能
}
