import {grid_item_mask} from "@/constant";
import {tempStore} from "@/global";

/**
 * 做拖动结束的后续清理工作
 * */
export function endWork_mouseup(_) {
  //  清除Item限制操作的遮罩层
  const maskList = document.querySelectorAll(`.${grid_item_mask}`)
  for (let i = 0; i < maskList.length; i++) {
    const maskEl = maskList[i]
    maskEl.parentElement.removeChild(maskEl)
  }
  //-------------------------------重置相关缓存-------------------------------//
  Object.keys(tempStore).forEach(name => tempStore[name] = null)
}
