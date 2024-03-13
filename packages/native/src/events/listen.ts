import {
  compatible_touchend_mouseup,
  compatible_touchmove_mousemove,
  compatible_touchstart_mousedown,
  nativeEventEmit_click,
  nativeEventEmit_mousedown,
  nativeEventEmit_mousemove,
  nativeEventEmit_mouseup,
  start_move,
  start_down,
  end_work
} from "@/events";

export function doMousedown(ev: any) {
  /* compatible */
  compatible_touchstart_mousedown(ev)
  /* startWork */
  start_down(ev)
  /*  native event emit */
  nativeEventEmit_mousedown(ev)   // 点击时清除克隆元素
}

export function doMousemove(ev: any) {
  /* compatible */
  compatible_touchmove_mousemove(ev)
  /* start init */
  start_move(ev)
  /*  native event emit */
  nativeEventEmit_mousemove(ev)  // 必须在前面先创建克隆元素
}

export function doMouseup(ev: any) {
  /* compatible */
  compatible_touchend_mouseup(ev)
  /*  native event emit */
  nativeEventEmit_mouseup(ev)
  /*  endWork */
  end_work(ev)
}

export function doClick(ev: any) {
  nativeEventEmit_click(ev)
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
  document.addEventListener('mousedown', doMousedown, {passive: true})
  document.addEventListener('touchstart', doMousedown, {passive: false})
  //-------------------------------原来的必须挂dom上的事件-----------------------------//
  document.addEventListener('mousemove', doMousemove, {passive: true})
  document.addEventListener('touchmove', doMousemove, {passive: false})
  document.addEventListener('mouseup', doMouseup, {passive: true})
  document.addEventListener('touchend', doMouseup, {passive: false})
  document.addEventListener('click', doClick)
  running = true
}

export function removeGlobalEvent() {
  if (containerCount > 1) {
    return
  }
  document.removeEventListener('mousedown', doMousedown)
  document.removeEventListener('touchstart', doMousedown)
  //-------------------------------原来的必须挂dom上的事件-----------------------------//
  document.removeEventListener('mousemove', doMousemove)
  document.removeEventListener('touchmove', doMousemove)
  document.removeEventListener('mouseup', doMouseup)
  document.removeEventListener('touchend', doMouseup)
}
