import {Container, Item} from "@/main";
import {tempStore} from "@/store";

export function crossContainer_mouseleave(ev, container = null) {
  const {fromItem, moveItem, isLeftMousedown} = tempStore
  let dragItem: Item | null = moveItem || fromItem
  container.__ownTemp__.firstEnterUnLock = false
  container.__ownTemp__.nestingEnterBlankUnLock = false
  if (isLeftMousedown && dragItem) {
    //自动增长row
    const growContainer: Container = dragItem.container
    if (growContainer.getConfig('autoGrowRow') && growContainer === container) {
      const curRow = growContainer.getConfig('row')
      if (growContainer.platform === 'vue') {
        const useLayout = growContainer.vue.layout
        if (growContainer.__ownTemp__.preRow === curRow) {
          useLayout.row = curRow + 1
        }
      } else if (growContainer.platform === 'native') {
        growContainer.setConfig("row", curRow + 1)
      }
      tempStore.isCoverRow = true
    }
    container.eventManager._callback_('leaveContainerArea', container, dragItem)
    // container._VueEvents.vueLeaveContainerArea(container, dragItem)
  }

}
