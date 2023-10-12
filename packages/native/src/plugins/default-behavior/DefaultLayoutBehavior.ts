// noinspection JSUnusedGlobalSymbols

import {autoSetSizeAndMargin} from "@/algorithm/common";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {updateContainerSize, updateHorizontalResize, updateVerticalResize} from "@/plugins/common";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {definePlugin, tempStore} from "@/global";
import {BaseEvent} from "@/plugins";
import {GridPlugin} from "@/types";

/**
 * TODO refactor 弃用flip翻转， 布局方向由 position的 left top right bottom控制，可以紧贴边界更符合直观
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
    container.reset(container.getConfig('col'), container.getConfig('row'))
    const res = manager.analysis()   // 2. 分析当前布局
    res.patch()                      // 3. 修改当前item位置
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
        2.您可以配置 autoGrow 来自动撑开容器
         `,
        from: res
      })
    }
  },

  containerResizing(ev: ItemLayoutEvent) {
    ev.container.bus.emit("updateLayout")
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragging(ev: ItemDragEvent) {
    const {fromContainer, toContainer} = tempStore
    if (toContainer && fromContainer !== toContainer) return   // 如果移动到其他容器上时停止更新源容器位置
    ev.patchDragDirection()
  },

  $dragend(ev: ItemDragEvent) {
    ev.container.layoutManager.trim()
  },

  dragend(_: ItemDragEvent) {
  },

  dragend$(ev: ItemDragEvent) {
    updateContainerSize(ev.container)
  },

  dragToBlank(_: ItemDragEvent) {
  },

  dragToTop(ev: ItemDragEvent) {
    // console.log('dragToTop')
    ev.autoMoveToNearBlank()
  },

  dragToBottom(ev: ItemDragEvent) {
    // console.log('dragToBottom')
    ev.autoMoveToNearBlank()
  },

  dragToLeft(ev: ItemDragEvent) {
    // console.log('dragToLeft')
    ev.autoMoveToNearBlank()
  },

  dragToRight(ev: ItemDragEvent) {
    // console.log('dragToRight')
    ev.autoMoveToNearBlank()
  },

  resizing(ev: ItemResizeEvent) {
    if (!tempStore.fromItem) return
    ev.patchResizeDirection()
  },

  $resized(ev: ItemResizeEvent) {
    ev.container.layoutManager.trim()
    updateContainerSize(ev.container)
  },

  resized(_: ItemResizeEvent) {
  },

  resized$(_: ItemResizeEvent) {
  },

  resizeToTop(ev: ItemResizeEvent) {
    // console.log('resizeToTop')
    updateVerticalResize(ev)
  },

  resizeToBottom(ev: ItemResizeEvent) {
    // console.log('resizeToBottom')
    updateVerticalResize(ev)
  },

  resizeToLeft(ev: ItemResizeEvent) {
    // console.log('resizeToLeft')
    updateHorizontalResize(ev)
  },

  resizeToRight(ev: ItemResizeEvent) {
    // console.log('resizeToRight')
    updateHorizontalResize(ev)
  },

  itemPosChanged() {
    // console.log('itemPosChanged')
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

  closed$(ev: ItemLayoutEvent) {
    ev.container.layoutManager.trim()
  },

  /**
   * 自动执行响应式布局贴近网格
   * 布局算法自行实现更新逻辑
   * @param ev 如果没有传入customEv的时候默认使用的事件对象
   * ev.event 开发者如果传入customEv则会替代默认ev事件对象，customEv应当包含修改过后的items或者使用addModifyItem添加过要修改的成员
   * */
  updateLayout(ev: ItemDragEvent | ItemResizeEvent) {
    const container = ev.container
    autoSetSizeAndMargin(container,true)
    updateContainerSize(container)
    container.items.forEach(item => item.updateItemLayout())
  }
})

