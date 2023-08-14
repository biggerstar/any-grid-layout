import {prevent, windowResize} from "@/events/common";
import {mousemoveFromClone, mousemoveFromItemChange} from "@/events/item-drag";
import {touchendOrMouseup, touchmoveOrMousemove, touchstartOrMousedown} from "@/events/compatible";
import {itemDragMousemove} from "@/events/item-drag/itemDragMousemove";
import {itemDragMousedown} from "@/events/item-drag/itemDragMousedown";


function allMousedown(ev) {
  touchstartOrMousedown(ev)
  itemDragMousedown(ev)
  mousemoveFromClone(ev)
}

function allMousemove(ev) {
  touchmoveOrMousemove(ev)
  mousemoveFromItemChange(ev)
  itemDragMousemove(ev)
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
  document.addEventListener('mouseup', touchendOrMouseup)
  document.addEventListener('touchend', touchendOrMouseup, {passive: false})
  //
  document.addEventListener('mouseleave', windowResize.setResizeFlag)
  document.addEventListener('mouseenter', windowResize.removeResizeFlag)
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
//   document.removeEventListener('mouseleave', windowResize.setResizeFlag)
//   document.removeEventListener('mouseenter', windowResize.removeResizeFlag)
// }
