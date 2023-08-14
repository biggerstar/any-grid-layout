import {tempStore} from "@/store";
import {singleTouchToCommonEvent} from "@/utils";
import {containerEvent, index} from "@/events";

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
    ev = singleTouchToCommonEvent(ev)
  } else tempStore.deviceEventMode = 'mouse'
  // console.log(ev);
  index.mousemoveFromItemChange(ev)
  containerEvent.mousemove(ev)
}
