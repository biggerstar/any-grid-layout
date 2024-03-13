import {tempStore} from "@/global";


/**
 * 移除当前鼠标操作的clone元素 (drag,resize)
 * */
export function mouseEventEmit_mouseup(_:any) {
  if (tempStore.fromContainer) {
    tempStore.fromContainer.bus.emit('mouseup')
  }
}
