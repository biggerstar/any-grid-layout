import {prevent, windowResize} from "@/events/common";
import {containerEvent} from "@/events/container";


export function startGlobalEvent() {
  //-----------------------------事件委托(debug注销这里可选排查问题出因)------------------------------//
  //mouseenter该事件监听在静态布局模式下必要，解决了拖拽以超慢进入另一个容器mousemove未触发进入事件导致源容器成员未卸载,新容器未挂载问题
  // 这四个事件原本委托在Container上，但是单个Item编辑的时候会造成不生效，所以就挂document上了
  document.addEventListener('mousedown', containerEvent.touchstartOrMousedown)
  document.addEventListener('touchstart', containerEvent.touchstartOrMousedown, {passive: false})

  document.addEventListener('dragstart', prevent.false)
  document.addEventListener('selectstart', prevent.defaultAndFalse, false)
  //
  // //-------------------------------原来的必须挂dom上的事件-----------------------------//
  document.addEventListener('mousemove', containerEvent.touchmoveOrMousemove)
  document.addEventListener('touchmove', containerEvent.touchmoveOrMousemove, {passive: false})
  //
  document.addEventListener('mouseup', containerEvent.touchendOrMouseup)
  document.addEventListener('touchend', containerEvent.touchendOrMouseup, {passive: false})
  //
  document.addEventListener('mouseleave', windowResize.setResizeFlag)
  document.addEventListener('mouseenter', windowResize.removeResizeFlag)
}

function removeGlobalEvent() {
  document.removeEventListener('mousedown', containerEvent.touchstartOrMousedown)
  document.removeEventListener('touchstart', containerEvent.touchstartOrMousedown)

  document.removeEventListener('dragstart', prevent.false)
  document.removeEventListener('selectstart', prevent.defaultAndFalse)

  //-----------------------------------------------------------------------------//
  document.removeEventListener('mousemove', containerEvent.touchmoveOrMousemove)
  document.removeEventListener('touchmove', containerEvent.touchmoveOrMousemove)

  document.removeEventListener('mouseup', containerEvent.touchendOrMouseup)
  document.removeEventListener('touchend', containerEvent.touchendOrMouseup)

  document.removeEventListener('mouseleave', windowResize.setResizeFlag)
  document.removeEventListener('mouseenter', windowResize.removeResizeFlag)
}
