import {
  compatible_touchend_mouseup,
  compatible_touchmove_mousemove,
  compatible_touchstart_mousedown,
  endWork_mouseup,
  mouseEventEmit_mousedown, mouseEventEmit_mousemove, mouseEventEmit_mouseup
} from "@/events";
import {startMove_mousemove} from "@/events/other/startMove_mousemove";
import {startWork_mousedown} from "@/events/other/startWork_mousedown";
import {itemClick_mousedown} from "@/events/other/itemClick_mousedown";

export function allMousedown(ev) {
  /* compatible */
  compatible_touchstart_mousedown(ev)
  /* startWork */
  startWork_mousedown(ev)
  /* click event */
  itemClick_mousedown(ev)

  mouseEventEmit_mousedown(ev)   // 点击时清除克隆元素
}

export function allMousemove(ev) {
  /* compatible */
  compatible_touchmove_mousemove(ev)
  /* start init */
  startMove_mousemove(ev)

  mouseEventEmit_mousemove(ev)  // 必须在前面先创建克隆元素
}

export function allMouseup(ev) {
  /* compatible */
  compatible_touchend_mouseup(ev)

  mouseEventEmit_mouseup(ev)
  /*  endWork */
  endWork_mouseup(ev)
}

let running = false
let containerCount = 0

export function startGlobalEvent(targetWindow?: WindowProxy) {
  containerCount++
  if (running) {
    return
  }
  const document = (targetWindow || window).document
  //-----------------------------事件委托(debug注销这里可选排查问题出因)------------------------------//
  document.addEventListener('mousedown', allMousedown, {passive: true})
  document.addEventListener('touchstart', allMousedown, {passive: false})
  //-------------------------------原来的必须挂dom上的事件-----------------------------//
  document.addEventListener('mousemove', allMousemove, {passive: true})
  document.addEventListener('touchmove', allMousemove, {passive: false})
  document.addEventListener('mouseup', allMouseup, {passive: true})
  document.addEventListener('touchend', allMouseup, {passive: false})
  running = true
}

export function removeGlobalEvent() {
  if (containerCount > 1) {
    return
  }
  document.removeEventListener('mousedown', allMousedown)
  document.removeEventListener('touchstart', allMousedown)
  //-------------------------------原来的必须挂dom上的事件-----------------------------//
  document.removeEventListener('mousemove', allMousemove)
  document.removeEventListener('touchmove', allMousemove)
  document.removeEventListener('mouseup', allMouseup)
  document.removeEventListener('touchend', allMouseup)
}
