import {
  compatible_touchend_mouseup,
  compatible_touchmove_mousemove,
  compatible_touchstart_mousedown,
  crossContainer_mousemove,
  cursor_mousedown,
  cursor_mousemove,
  cursor_mouseup,
  endWork_mouseup,
  itemDrag_mousedown,
  itemResize_mousedown,
  itemResize_mouseup,
  mouseEventEmit_mousedown, mouseEventEmit_mousemove, mouseEventEmit_mouseup
} from "@/events";
import {itemResize_mousemove} from "@/events/item-resize/itemResize_mousemove";
import {itemDrag_mousemove} from "@/events/item-drag/itemDrag_mousemove";
import {startMove_mousemove} from "@/events/other/startMove_mousemove";
import {startWork_mousedown} from "@/events/other/startWork_mousedown";
import {itemDrag_mouseup} from "@/events/item-drag/itemDrag_mouseup";
import {itemClick_mousedown} from "@/events/other/itemClick_mousedown";

export function allMousedown(ev) {
  /* cursor */
  cursor_mousedown(ev)
  /* compatible */
  compatible_touchstart_mousedown(ev)
  /* startWork */
  startWork_mousedown(ev)
  /* ItemResize */
  itemResize_mousedown(ev)
  /* itemDrag */
  itemDrag_mousedown(ev)  // drag必须在后面，前面没有被其他操作方式(handleMethod)接管则默认是drag
  /* click event */
  itemClick_mousedown(ev)

  mouseEventEmit_mousedown(ev)   // 点击时清除克隆元素
}

export function allMousemove(ev) {
  /* compatible */
  compatible_touchmove_mousemove(ev)
  /* start init */
  startMove_mousemove(ev)
  /* cursor */
  cursor_mousemove(ev)
  /* crossContainer */
  crossContainer_mousemove(ev)
  /* ItemResize */
  itemResize_mousemove(ev)
  /* itemDrag */
  itemDrag_mousemove(ev)

  mouseEventEmit_mousemove(ev)  // 必须在前面先创建克隆元素
}

export function allMouseup(ev) {
  /* compatible */
  compatible_touchend_mouseup(ev)
  /*  cursor */
  cursor_mouseup(ev)
  /*  itemResize */
  itemResize_mouseup(ev)
  /*  itemDrag */
  itemDrag_mouseup(ev)

  mouseEventEmit_mouseup(ev)


  /*  endWork */
  endWork_mouseup(ev)
}

let running = false
let containerCount = 0

export function startGlobalEvent(targetWindow?: WindowProxy) {
  containerCount++
  if (running) return
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
  if (containerCount > 1) return
  document.removeEventListener('mousedown', allMousedown)
  document.removeEventListener('touchstart', allMousedown)
  //-------------------------------原来的必须挂dom上的事件-----------------------------//
  document.removeEventListener('mousemove', allMousemove)
  document.removeEventListener('touchmove', allMousemove)
  document.removeEventListener('mouseup', allMouseup)
  document.removeEventListener('touchend', allMouseup)
}
