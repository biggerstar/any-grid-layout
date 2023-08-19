import {singleTouchToCommonEvent} from "@/utils";
import {prevent, tempStore} from "@/events";

/** 做触屏和桌面端兼容 */
export function compatible_touchend_mouseup(ev) {
  ev = ev || window['event']
  if (ev.touches) {
    clearTimeout(tempStore.timeOutEvent)
    tempStore.allowTouchMoveItem = false
    tempStore.deviceEventMode = 'touch'
    singleTouchToCommonEvent(ev)
    document.removeEventListener('contextmenu', prevent.contextmenu)
  } else tempStore.deviceEventMode = 'mouse'
}
