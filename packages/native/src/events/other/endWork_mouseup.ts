import {tempStore} from "@/global";

/**
 * 做拖动结束的后续清理工作
 * */
export function endWork_mouseup(_) {
  //-------------------------------重置相关缓存-------------------------------//
  Object.keys(tempStore).forEach(name => tempStore[name] = null)
}
