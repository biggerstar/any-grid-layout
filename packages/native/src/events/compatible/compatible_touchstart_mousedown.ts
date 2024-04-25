import {parseContainer, singleTouchToCommonEvent} from "@/utils";
import {Container} from "@/main";
import {tempStore} from "@/global";

/** 做触屏和桌面端兼容 */
export function compatible_touchstart_mousedown(ev: any) {
  ev = ev || window['event']
  tempStore.isLeftMousedown = true
  //----------------------------------------------------
  if (ev.touches) {
    tempStore.deviceEventMode = 'touch'
    ev = singleTouchToCommonEvent(ev)
  } else {
    tempStore.deviceEventMode = 'mouse'
  }
  if (tempStore.deviceEventMode === 'touch') {
    tempStore.allowTouchMoveItem = false
    const container: Container | null = parseContainer(ev)
    document.addEventListener('contextmenu', (ev) => ev.preventDefault())  // 禁止长按弹出菜单
    const pressTime = container ? container.state.pressTime : 300  // 长按多久响应拖动事件，默认360ms
    tempStore.timeOutEvent = setTimeout(() => {
      if (ev.preventDefault) {
        ev.preventDefault()
      }
      tempStore.allowTouchMoveItem = true
      let timer: any = setTimeout(() => {
        document.removeEventListener('contextmenu', (ev) => ev.preventDefault())
        clearTimeout(timer)
        timer = null
      }, 600)
      clearTimeout(tempStore.timeOutEvent)
    }, pressTime)
  }
}
