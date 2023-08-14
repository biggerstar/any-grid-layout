import {tempStore} from "@/store";
import {singleTouchToCommonEvent} from "@/utils";

/** 做触屏和桌面端兼容 */
export function touchmoveOrMousemove(ev) {
  ev = ev || window['event']
  if (ev.stopPropagation) ev.stopPropagation()
  if (ev.touches) {
    tempStore.deviceEventMode = 'touch'
    if (tempStore.allowTouchMoveItem) {
      if (ev.preventDefault) ev.preventDefault()
    } else {
      clearTimeout(tempStore.timeOutEvent)
      return
    }
    singleTouchToCommonEvent(ev)
  } else tempStore.deviceEventMode = 'mouse'
}
