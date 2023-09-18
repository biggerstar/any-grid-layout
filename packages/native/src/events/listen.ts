import {prevent} from "@/events/common";
import {
  compatible_touchend_mouseup,
  compatible_touchmove_mousemove,
  compatible_touchstart_mousedown,
  crossContainer_mousemove,
  cursor_mousedown,
  cursor_mousemove,
  cursor_mouseup,
  endWork_mouseup,
  itemClose_mouseup,
  itemDrag_mousedown,
  itemResize_mousedown,
  itemResize_mouseup
} from "@/events";
import {itemResize_mousemove} from "@/events/item-resize/itemResize_mousemove";
import {itemDrag_mousemove} from "@/events/item-drag/itemDrag_mousemove";
import {itemCloneElRemove_mouseup} from "@/events/item-clone-el/itemCloneElRemove_mouseup";
import {itemClose_mousedown} from "@/events/item-close/itemClose_mousedown";
import {startMove_mousemove} from "@/events/other/startMove_mousemove";
import {startWork_mousedown} from "@/events/other/startWork_mousedown";
import {itemDrag_mouseup} from "@/events/item-drag/itemDrag_mouseup";

export function allMousedown(ev) {
  /* cursor */
  cursor_mousedown(ev)
  /* compatible */
  compatible_touchstart_mousedown(ev)
  /* startWork */
  startWork_mousedown(ev)
  /* ItemResize */
  itemResize_mousedown(ev)
  /* close */
  itemClose_mousedown(ev)
  /* itemDrag */
  itemDrag_mousedown(ev)  // drag必须在后面，前面没有被其他操作方式(handleMethod)接管则默认是drag
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
}

export function allMouseup(ev) {
  /* compatible */
  compatible_touchend_mouseup(ev)
  /*  cursor */
  cursor_mouseup(ev)
  /*  itemResize */
  itemResize_mouseup(ev)
  /*  itemClose */
  itemClose_mouseup(ev)
  /*  itemDrag */
  itemDrag_mouseup(ev)
  /* remove clone */
  itemCloneElRemove_mouseup(ev)   // 必须在倒数，保证item.pos更新到最终位置后clone恢复动画才能正确回归
  /*  endWork */
  endWork_mouseup(ev)
}

let running = false

export function startGlobalEvent() {
  if (running) return
  //-----------------------------事件委托(debug注销这里可选排查问题出因)------------------------------//
  //mouseenter该事件监听在静态布局模式下必要，解决了拖拽以超慢进入另一个容器mousemove未触发进入事件导致源容器成员未卸载,新容器未挂载问题
  // 这四个事件原本委托在Container上，但是单个Item编辑的时候会造成不生效，所以就挂document上了
  document.addEventListener('mousedown', allMousedown)
  document.addEventListener('touchstart', allMousedown, {passive: false})

  document.addEventListener('dragstart', prevent.false)
  document.addEventListener('selectstart', prevent.defaultAndFalse, false)
  //
  // //-------------------------------原来的必须挂dom上的事件-----------------------------//
  document.addEventListener('mousemove', allMousemove)
  document.addEventListener('touchmove', allMousemove, {passive: false})
  //
  document.addEventListener('mouseup', allMouseup)
  document.addEventListener('touchend', allMouseup, {passive: false})
  running = true
}


// function removeGlobalEvent() {
//   document.removeEventListener('mousedown', touchstartOrMousedown)
//   document.removeEventListener('touchstart', touchstartOrMousedown)
//
//   document.removeEventListener('dragstart', prevent.false)
//   document.removeEventListener('selectstart', prevent.defaultAndFalse)
//
//   //-----------------------------------------------------------------------------//
//   document.removeEventListener('mousemove', touchmoveOrMousemove)
//   document.removeEventListener('touchmove', touchmoveOrMousemove)
//
//   document.removeEventListener('mouseup', touchendOrMouseup)
//   document.removeEventListener('touchend', touchendOrMouseup)
//
// }
