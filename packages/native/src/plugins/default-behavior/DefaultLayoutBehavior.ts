// noinspection JSUnusedGlobalSymbols

import {autoSetSizeAndMargin} from "@/algorithm/common";
import {ItemLayoutEvent} from "@/plugins/event-types/ItemLayoutEvent";
import {checkItemHasChanged, patchDragDirection} from "@/plugins/common";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {updateStyle} from "@/utils";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {definePlugin, tempStore} from "@/global";


/**
 * 内置默认布局，外面没有阻止默认行为的时候执行的函数,默认是静态布局，要实现响应式布局需要自行通过插件实现
 * */
export const DefaultLayoutBehavior = definePlugin({
  /**
   * 用于作为主布局算法时，「初次加载」Item到容器时初始化，用于设置容器的大小或其他操作
   * 内置已经实现，支持用户阻止init默认行为自行实现
   * @return {AnalysisResult | void} 返回结果，如果failed长度不为0，表明有item没添加成功则会抛出警告事件
   * */
  init(ev: ItemDragEvent) {
    const {container} = ev
    const {layoutManager: manager} = container
    container.updateContainerSizeStyle()
    autoSetSizeAndMargin(container, true)
    container.reset()
    const res = manager.analysis(container.items, null, {
      baseLine: container.getConfig("baseLine"),
      auto: ev.hasAutoDirection()
    })
    res.patch()
    container.items = res.successItems
    container.items.forEach(item => item.mount())
    ev.patchStyle(res.successItems)
    if (!res.isSuccess) {
      container.bus.emit('error', <any>{
        type: 'ContainerOverflowError',
        message: "容器溢出或者Item重叠，您设置了固定的col或row且在首次挂载的时候才会出现该错误",
        from: res
      })
    }
  },

  /**
   * container盒子大小改变
   * */
  containerResizing(_: ItemLayoutEvent) {
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragging(ev: ItemDragEvent) {
    const {fromContainer, toContainer} = tempStore
    if (toContainer && fromContainer !== toContainer) return   // 如果移动到其他容器上时停止更新源容器位置
    patchDragDirection(ev)
  },

  dragend(_: ItemDragEvent) {
  },

  dragToTop(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  dragToBottom(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  dragToLeft(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  dragToRight(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  /**
   * 在container外围X轴left方向移动的事件
   * */
  dragOuterLeft(_: ItemDragEvent) {
  },

  /**
   * 在container外围X轴right方向移动的事件
   * */
  dragOuterRight(_: ItemDragEvent) {
  },

  /**
   * 在container外围Y轴top方向移动的事件
   * */
  dragOuterTop(_: ItemDragEvent) {
  },

  /**
   * 在container外围Y轴bootom方向移动的事件
   * */
  dragOuterBottom(_: ItemDragEvent) {
  },

  dragToLeftTop(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  dragToLetBottom(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  dragToRightTop(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  dragToRightBottom(ev: ItemDragEvent) {
    ev.tryMoveToNearBlank()
  },

  resizeOuterTop() {
    // console.log('resizeOuterTop')
  },

  resizeOuterRight() {
    // console.log('resizeOuterRight')
  },

  resizeOuterBottom() {
    // console.log('resizeOuterBottom')
  },

  resizeOuterLeft() {
    // console.log('resizeOuterLeft')
  },

  resizeToTop(ev: ItemResizeEvent) {
    // console.log('resizeToTop')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      height: `${ev.spaceHeight}px`,
      minHeight: `${ev.item.minHeight}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {h: fromItem.pxToH(ev.cloneElHeight)})
  },

  resizeToBottom(ev: ItemResizeEvent) {
    // console.log('resizeToBottom')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      height: `${ev.spaceHeight}px`,
      minHeight: `${ev.item.minHeight}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {h: fromItem.pxToH(ev.cloneElHeight)})
  },

  resizeToLeft(ev: ItemResizeEvent) {
    // console.log('resizeToLeft')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      width: `${ev.spaceWidth}px`,
      minWidth: `${ev.item.minWidth}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {w: fromItem.pxToW(ev.cloneElWidth)})
  },

  resizeToRight(ev: ItemResizeEvent) {
    // console.log('resizeToRight')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    updateStyle({
      width: `${ev.spaceWidth}px`,
      minWidth: `${ev.item.minWidth}px`,
    }, cloneElement)
    ev.tryChangeSize(fromItem, {w: fromItem.pxToW(ev.cloneElWidth)})
  },

  resizing(ev: ItemResizeEvent) {
    const {fromItem} = tempStore
    if (!fromItem) return
    ev.patchResizeDirection()
    checkItemHasChanged(ev)
  },

  resized(_: ItemResizeEvent) {
  },

  itemSizeChange() {
    // console.log('itemSizeChange')
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

  /**
   * 自动执行响应式布局贴近网格
   * 布局算法自行实现更新逻辑
   * @param ev 如果没有传入customEv的时候默认使用的事件对象
   * ev.event 开发者如果传入customEv则会替代默认ev事件对象，customEv应当包含修改过后的items或者使用addModifyItem添加过要修改的成员
   * */
  updateLayout(ev: ItemDragEvent | ItemResizeEvent) {
  }
})








