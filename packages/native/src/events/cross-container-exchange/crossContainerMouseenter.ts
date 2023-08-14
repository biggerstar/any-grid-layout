import {Item} from "@/main";
import {tempStore} from "@/store";
import {Sync} from "@/utils";

export function crossContainerMouseenter(ev, container = null) {
  if (!container && ev.target._isGridContainer_) {
    ev.preventDefault()
    container = ev.target._gridContainer_
  }
  const moveItem: Item = tempStore.moveItem
  const fromItem: Item = tempStore.fromItem
  const dragItem: Item = tempStore.moveItem ? moveItem : fromItem
  if (tempStore.isLeftMousedown) {  //   事件响应必须在前
    if (dragItem && dragItem.container !== container) {
      // 跨容器进入不同域,异步操作是为了获取到新容器vue创建的新Item
      Sync.run({
        func: () => {
          container.eventManager._callback_('enterContainerArea', container, tempStore.exchangeItems.new)
          tempStore.exchangeItems.new = null
          tempStore.exchangeItems.old = null
        },
        rule: () => tempStore.exchangeItems.new,
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
