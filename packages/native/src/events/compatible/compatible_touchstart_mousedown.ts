import {parseContainer, singleTouchToCommonEvent} from "@/utils";
import {Container} from "@/main";
import {tempStore} from "@/global";
import {prevent} from "@/events";

/** 做触屏和桌面端兼容 */
export function compatible_touchstart_mousedown(ev: any) {
  // touch 和 drag效果是一样的
  ev = ev || window['event']
  tempStore.isLeftMousedown = true
  tempStore.mousedownEvent = ev
  //----------------------------------------------------
  if (ev.touches) {
    tempStore.deviceEventMode = 'touch'
    ev = singleTouchToCommonEvent(ev)
  } else tempStore.deviceEventMode = 'mouse'
  if (tempStore.deviceEventMode === 'touch') {
    tempStore.allowTouchMoveItem = false
    const container: Container | null = parseContainer(ev)
    document.addEventListener('contextmenu', prevent.defaultAndFalse)  // 禁止长按弹出菜单
    const pressTime = container ? container.getConfig('pressTime') : 300  // 长按多久响应拖动事件，默认360ms
    tempStore.timeOutEvent = setTimeout(() => {
      if (ev.preventDefault) ev.preventDefault()
      tempStore.allowTouchMoveItem = true
      // if(container)container.bus.emit("dragging")   // move 触屏模式下只为了触发生成克隆元素 TODO 可能resize也需要触发
      let timer: any = setTimeout(() => {
        document.removeEventListener('contextmenu', prevent.defaultAndFalse)
        clearTimeout(timer)
        timer = null
      }, 600)
      clearTimeout(tempStore.timeOutEvent)
    }, pressTime)
  }
}
