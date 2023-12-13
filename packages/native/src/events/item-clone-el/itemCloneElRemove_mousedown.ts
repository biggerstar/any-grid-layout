import {itemCloneElRemove_mouseup} from "@/events";

/**
 * 移除当前鼠标操作的clone元素 (drag,resize)
 * */
export function clearCloneEl_mousedown(ev: MouseEvent) {
  itemCloneElRemove_mouseup(void 0)
}
