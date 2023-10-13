import {getClientRect} from "@/utils";
import {tempStore} from "@/global/TempStore";
import {SingleThrottle} from "@/utils/SingleThrottle";

export const singleThrottleCrossContainerRule = () => {  // 用于跨容器后获取到及时更新新容器缓存
  const {fromContainer, toContainer} = tempStore
  return fromContainer && toContainer && fromContainer === toContainer
}


export function createSTRect(container) {
  const STRect = new SingleThrottle<{
    containerIns: DOMRect,
    containerContent: DOMRect,
    shadow: DOMRect,
    fromItem: DOMRect,
  }>()
  STRect.addRules(singleThrottleCrossContainerRule)
    /**  container 实例挂载的元素rect */
    .addUpdateMethod("containerIns", (el: any) => { // 节流获取rect减少回流的可能，itemRect，containerRect是比较固定的元素，变化不大
      if (!el) el = container.element
      return getClientRect(el, true)
    }, 1024)

    /**  container内容区域 实例挂载的元素rect  */
    .addUpdateMethod("containerContent", (el: any) => {
      if (!el) el = container.contentElement
      return getClientRect(el, true)
    }, 1024)

    /** 影子元素挂载的元素rect  */
    .addUpdateMethod("shadow", (el: any) => {
      if (!el) el = tempStore.cloneElement
      return getClientRect(el, true)
    }, 67)

    /**  fromItem挂载的元素rect  */
    .addUpdateMethod("fromItem", (el: any) => {
      if (!el) el = tempStore.fromItem?.element
      return getClientRect(el, true)
    }, 1024)

  return STRect
}



