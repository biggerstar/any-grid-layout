import {prevent} from "@/events/common";
import {
  compatible_touchend_mouseup,
  compatible_touchmove_mousemove,
  compatible_touchstart_mousedown
} from "@/events/compatible";
import {itemDrag_mousedown} from "@/events/item-drag/itemDrag_mousedown";
import {slidePage_mousemove} from "@/events/slide-page";
import {itemResize_mouseup} from "@/events/item-resize";
import {itemDrag_mouseup} from "@/events/item-drag/itemDrag_mouseup";
import {itemCloneCreateAndUpdate_mousemove, itemCloneRemove_mouseup} from "@/events/item-clone";
import {fromItemChange_mousemove} from "@/events/item-exchange";
import {cursor_mousemove} from "@/events/cursor";
import {crossContainer_mousemove} from "@/events/cross-container-exchange/crossContainer_mousemove";


function allMousedown(ev) {
  compatible_touchstart_mousedown(ev)
  //------------------------------
  itemDrag_mousedown(ev)
}

function allMousemove(ev) {
  compatible_touchmove_mousemove(ev)
  itemCloneCreateAndUpdate_mousemove(ev)
  cursor_mousemove(ev)
  crossContainer_mousemove(ev)
  //------------------------------
  fromItemChange_mousemove(ev)
  slidePage_mousemove(ev)
}


function allMouseup(ev) {
  compatible_touchend_mouseup(ev)
  //------------------------------
  itemCloneRemove_mouseup(ev)
  itemResize_mouseup(ev)
  itemDrag_mouseup(ev)
}

export function startGlobalEvent() {
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
