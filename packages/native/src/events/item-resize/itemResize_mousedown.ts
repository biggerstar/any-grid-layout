import {grid_item_resizable_handle} from "@/constant";
import {tempStore} from "@/global";

export function itemResize_mousedown(ev) {
  if (tempStore.handleMethod) return   // 如果已经是其他操作则退出
  if (ev.target.className.includes(grid_item_resizable_handle)) {   //   用于resize
    tempStore.handleMethod = 'resize'
  }
}
