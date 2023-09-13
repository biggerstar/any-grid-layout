import {grid_item_close_btn} from "@/constant";
import {tempStore} from "@/global";

/** 点击关闭按钮 */
export function itemClose_mousedown(ev) {
  const {handleMethod, fromItem} = tempStore
  if (handleMethod || !fromItem) return   // 如果已经是其他操作则退出
  if (ev.target.className.includes(grid_item_close_btn)) {   //   用于点击close按钮
    tempStore.handleMethod = 'close'
  }
}
