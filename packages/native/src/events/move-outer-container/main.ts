import {Container, Item} from "@/main";
import {Sync} from "@/utils";
import {tempStore} from "@/store";


export const moveOuterContainerEvent= {
  //  用于跨容器Item通信，转移的各种处理
  /**用于嵌套情况两个【相邻】Container的直接过渡
   * @param {Container}  fromContainer   从那个Container中来
   * @param {Container}  toContainer      到哪个Container中去
   * 在嵌套容器中假设父容器为A，被嵌套容器为B,  如果A到 B 则fromContainer为A，toContainer为B,此时dragItem属于A，
   * 如果A到 B 此时鼠标不抬起继续从B返回A 则fromContainer为 B，toContainer为A，此时dragItem还是属于A,通过dragItem的归属能确定跨容器时候是否鼠标被抬起
   * */
  leaveToEnter: function (fromContainer: Container, toContainer: Container) {
    if (!fromContainer || !toContainer) return
    let fromItem: Item = tempStore.fromItem
    let moveItem: Item = tempStore.moveItem
    let dragItem: Item = tempStore.moveItem ? moveItem : fromItem
    // console.log(fromContainer,toContainer,dragItem);
    //------------下方代码固定顺序-------------//
    this.mouseleave(null, fromContainer)
    // console.log(dragItem.container,toContainer)

    if (dragItem.container === toContainer) {
      tempStore.fromContainer = toContainer
      return
    }

    if (toContainer.isNesting) {   //  修复快速短距重复拖放情况下概率识别成父容器移动到子容器当Item的情况
      if (toContainer.parentItem === dragItem
        || toContainer.parentItem.element === dragItem.element) {
        return
      }
    }
    toContainer.__ownTemp__.nestingEnterBlankUnLock = true
    this.mouseenter(null, toContainer)
    //  如果现在点击嵌套容器空白部分选择的Item会是父容器的Item,按照mouseenter逻辑对应不可能删除当前Item(和前面一样是fromItem)在插入
    //  接上:因为这样是会直接附加在父级Container最后面，这倒不如什么都不做直接等待后面逻辑执行换位功能
  },
  mouseenter: function (ev, container = null) {
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
  },
  mouseleave: function (ev, container = null) {
    let fromItem: Item = tempStore.fromItem
    let moveItem: Item = tempStore.moveItem
    let dragItem: Item = tempStore.moveItem ? moveItem : fromItem
    container.__ownTemp__.firstEnterUnLock = false
    container.__ownTemp__.nestingEnterBlankUnLock = false
    if (tempStore.isLeftMousedown) {
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
}
