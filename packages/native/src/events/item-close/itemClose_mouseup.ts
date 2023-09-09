import {tempStore} from "@/events";

/** 点击关闭按钮 */
export function itemClose_mouseup(ev) {
  const {fromItem, isClosing} = tempStore
  if (!isClosing) return
  const target = ev.touchTarget ? ev.touchTarget : ev.target
  if (target.classList.contains('grid-item-close-btn')) {  // 必须鼠标按下在close元素域内，鼠标抬起也是该元素才允许关闭
    fromItem && fromItem.container.bus.emit('itemClosing')
  }
}
