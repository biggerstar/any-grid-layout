import {parseContainerAreaElement, parseContainerFromPrototypeChain, throttle} from "@/utils";
import {Container} from "@/main";
import {crossContainer_mouseenter, crossContainer_mouseleave, crossContainerLeaveEnter, tempStore,} from "@/events";

/**
 *  判断当前移动过程中从哪个container出来或者进去了哪个container
 *  */
export const crossContainer_mousemove: Function = throttle((ev) => {
  const {
    isLeftMousedown,
    currentContainerArea,
    currentContainer,
  } = tempStore
  const containerArea: HTMLElement | null= parseContainerAreaElement(ev)
  const container: Container | null = parseContainerFromPrototypeChain(containerArea)
  if (isLeftMousedown) {
    tempStore.beforeContainerArea = currentContainerArea
    tempStore.currentContainerArea = <any>containerArea
    tempStore.beforeContainer = currentContainer
    tempStore.currentContainer = container
    if (containerArea && currentContainerArea) {   // 表示进去了某个Container内
      if (containerArea !== currentContainerArea) {
        // 从相邻容器移动过去，旧容器 ==>  新容器
        crossContainerLeaveEnter(<any>currentContainer, <any>container)
      }
    } else {
      if (containerArea || currentContainerArea) {
        // 非相邻容器中的网页其他空白元素移进来某个容器中
        if (!currentContainerArea) crossContainer_mouseenter(null, container)
        if (!containerArea) crossContainer_mouseleave(null, currentContainer)
      }
    }
  }
}, 12)
