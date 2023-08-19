import {Item} from "@/main";
import {Sync} from "@/utils";
import {tempStore} from "@/events";

export function crossContainer_mouseenter(ev, container) {
  const {moveItem, fromItem, isLeftMousedown, exchangeItems} = tempStore
  if (!container && ev.target._isGridContainer_) {
    ev.preventDefault()
    container = ev.target._gridContainer_
  }
  const dragItem: Item | null = moveItem || fromItem
  if (isLeftMousedown) {  //   事件响应必须在前
    if (dragItem && dragItem.container !== container) {
      // 跨容器进入不同域,异步操作是为了获取到新容器vue创建的新Item
      Sync.run({
        func: () => {
          container.eventManager._callback_('enterContainerArea', container, exchangeItems.new)
          exchangeItems.new = null
          exchangeItems.old = null
        },
        rule: () => exchangeItems.new,
        intervalTime: 2, // 每2ms查询是否vue的新Item创建成功,
        timeout: 200
      })
    } else {
      // 同容器拖动未进入其他容器
      container.eventManager._callback_('enterContainerArea', container, dragItem)
      if (dragItem && dragItem.container === container) return   // 非常必要，防止嵌套拖动容器互相包含
    }
  }
  container.__ownTemp__.firstEnterUnLock = true
  tempStore.moveContainer = container
}
