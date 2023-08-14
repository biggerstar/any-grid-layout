import {tempStore} from "@/store";
import {parseContainer, singleTouchToCommonEvent} from "@/utils";
import {Container} from "@/main";
import {prevent} from "@/events";
import {itemDragMousemove} from "@/events/item-drag/itemDragMousemove";
import {itemDragMousedown} from "@/events/item-drag/itemDragMousedown";

export function touchstartOrMousedown(ev) {
  // touch 和 drag效果是一样的
  ev = ev || window['event']
  if (ev.touches) {
    if (ev.stopPropagation) ev.stopPropagation()
    tempStore.deviceEventMode = 'touch'
    ev = singleTouchToCommonEvent(ev)
  } else tempStore.deviceEventMode = 'mouse'
  if (tempStore.deviceEventMode === 'touch') {
    tempStore.allowTouchMoveItem = false
    const container: Container = parseContainer(ev)
    document.addEventListener('contextmenu', prevent.defaultAndFalse)  // 禁止长按弹出菜单
    const pressTime = container ? container.getConfig('pressTime') : 300  // 长按多久响应拖动事件，默认360ms
    tempStore.timeOutEvent = setTimeout(() => {
      if (ev.preventDefault) ev.preventDefault()
      tempStore.allowTouchMoveItem = true
      itemDragMousemove(ev)   // move 触屏模式下只为了触发生成克隆元素
      let timer: any = setTimeout(() => {
        document.removeEventListener('contextmenu', prevent.defaultAndFalse)
        clearTimeout(timer)
        timer = null
      }, 600)
      clearTimeout(tempStore.timeOutEvent)
    }, pressTime)
  }
  itemDragMousedown(ev)
}
