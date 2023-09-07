import {tempStore} from "@/events";

/** 点击关闭按钮 */
export function itemClose_mousedown(ev) {
  const {handleMethod,fromItem} = tempStore
  if (handleMethod || !fromItem) return   // 如果已经是其他操作则退出
  const downTagClassName = ev.target.className
  if (downTagClassName.includes('grid-item-close-btn')) {   //   用于点击close按钮
    tempStore.handleMethod = 'close'
    fromItem.container.bus.emit('itemClosing')
  }
}
