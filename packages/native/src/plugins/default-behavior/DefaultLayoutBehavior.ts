// noinspection JSUnusedGlobalSymbols

import {autoSetSizeAndMargin} from "@/algorithm/common";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {checkItemPositionHasChanged, checkItemSizeHasChanged, updateContainerSize} from "@/plugins/common";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {updateStyle} from "@/utils";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {definePlugin, tempStore} from "@/global";
import {ContainerSizeChangeEvent} from "@/plugins";
import {GridPlugin} from "@/types";

/**
 * 内置默认布局，外面没有阻止默认行为的时候执行的函数,默认是静态布局，要实现响应式布局需要自行通过插件实现
 * */
export const DefaultLayoutBehavior = definePlugin(<GridPlugin>{
  /**
   * 用于作为主布局算法时，「初次加载」Item到容器时初始化，用于设置容器的大小或其他操作
   * 内置已经实现，支持用户阻止init默认行为自行实现
   * @return {AnalysisResult | void} 返回结果，如果failed长度不为0，表明有item没添加成功则会抛出警告事件
   * */
  containerMounted(ev: ItemDragEvent) {
    const {container} = ev
    const {layoutManager: manager} = container
    autoSetSizeAndMargin(container, true)  // 1.先初始化初始配置
    container.reset()
    const res = manager.analysis()   // 2. 分析当前布局
    res.patch()  // 3. 修改当前item位置
    container.updateContainerSizeStyle(res)  // 4.将当前所有最终items的col,row最终容器大小设置到container
    autoSetSizeAndMargin(container, true)  // 5.根据最终容器大小配置最终margin和size
    container.items = res.successItems
    container.items.forEach(item => item.mount())   // 6. 挂载item到dom上
    ev.patchStyle(res.successItems)  // 7.更新item在容器中的最终位置
    if (!res.isSuccess) {
      container.bus.emit('error', {
        type: 'ContainerOverflowError',
        message: `容器溢出或者Item重叠:
        1.您可以检查一下container挂载点元素是否未设置宽或高
        2.您可以将 autoGrow 设置来自动撑开容器
         `,
        from: res
      })
    }
  },

  /**
   * container盒子大小改变
   * */
  $containerResizing(ev: ContainerSizeChangeEvent) {
    const {isColChanged, isRowChanged, curCol, curRow} = ev
    const container = ev.container
    if (isColChanged || isRowChanged) container.bus.emit('containerSizeChanged')
    if (isColChanged) {
      container.bus.emit('colChanged')
      container.__ownTemp__.preCol = curCol
    }
    if (isRowChanged) {
      container.bus.emit('rowChanged')
      container.__ownTemp__.preRow = curRow
    }
  },

  containerResizing(ev: ContainerSizeChangeEvent) {
    autoSetSizeAndMargin(ev.container, true)
    ev.patchStyle()
    ev.container.updateContainerSizeStyle()
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragging(ev: ItemDragEvent) {
    const {fromContainer, toContainer} = tempStore
    if (toContainer && fromContainer !== toContainer) return   // 如果移动到其他容器上时停止更新源容器位置
    ev.patchDragDirection()
    checkItemPositionHasChanged()
  },

  dragend(_: ItemDragEvent) {
  },

  dragend$(_: ItemDragEvent) {
    updateContainerSize()
  },

  dragToBlank(_: ItemDragEvent) {
  },

  dragToTop(ev: ItemDragEvent) {
    // console.log('dragToTop')
    ev.tryMoveToNearBlank()
  },

  dragToBottom(ev: ItemDragEvent) {
    // console.log('dragToBottom')
    ev.tryMoveToNearBlank()
  },

  dragToLeft(ev: ItemDragEvent) {
    // console.log('dragToLeft')
    ev.tryMoveToNearBlank()
  },

  dragToRight(ev: ItemDragEvent) {
    // console.log('dragToRight')
    ev.tryMoveToNearBlank()
  },

  resizing(ev: ItemResizeEvent) {
    if (!tempStore.fromItem) return
    ev.patchResizeDirection()
    checkItemSizeHasChanged(ev)
  },

  resized(_: ItemResizeEvent) {
  },

  resized$(_: ItemResizeEvent) {
    updateContainerSize()
  },

  resizeToTop(ev: ItemResizeEvent) {
    // console.log('resizeToTop')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      height: `${Math.min(ev.spaceInfo.clampHeight, ev.fromItem.spaceBottom())}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {h: ev.h})
  },

  resizeToBottom(ev: ItemResizeEvent) {
    // console.log('resizeToBottom')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      height: `${Math.min(ev.spaceInfo.clampHeight, ev.fromItem.spaceBottom())}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {h: ev.h})
  },

  resizeToLeft(ev: ItemResizeEvent) {
    // console.log('resizeToLeft')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      width: `${Math.min(ev.spaceInfo.clampWidth, ev.fromItem.spaceRight())}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {w: ev.w})
  },

  resizeToRight(ev: ItemResizeEvent) {
    // console.log('resizeToRight')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      width: `${Math.min(ev.spaceInfo.clampWidth, ev.fromItem.spaceRight())}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {w: ev.w})
  },

  itemSizeChanged() {
    // console.log('itemSizeChanged')
  },

  closing(_: ItemLayoutEvent) {
    const {fromItem, toItem} = tempStore
    if (toItem && toItem === fromItem) {  // 按下和抬起要同一个item才能关闭
      toItem.unmount()
      toItem.container.bus.emit('closed')
    }
  },

  closed(_: ItemLayoutEvent) {
  },

  closed$(_: ItemLayoutEvent) {
    updateContainerSize()
  },

  /**
   * 自动执行响应式布局贴近网格
   * 布局算法自行实现更新逻辑
   * @param ev 如果没有传入customEv的时候默认使用的事件对象
   * ev.event 开发者如果传入customEv则会替代默认ev事件对象，customEv应当包含修改过后的items或者使用addModifyItem添加过要修改的成员
   * */
  updateLayout(ev: ItemDragEvent | ItemResizeEvent) {
  }
})

