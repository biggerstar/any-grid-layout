// noinspection JSUnusedGlobalSymbols

import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";
import {ItemLayoutEvent} from "@/plugins/event-type/ItemLayoutEvent";
import {definePlugin} from "@/plugins/global";
import {directUpdateLayout, patchDragDirection, patchResizeNewSize} from "@/plugins/common";
import {ItemResizeEvent} from "@/plugins/event-type/ItemResizeEvent";
import {updateStyle} from "@/utils";
import {ItemDragEvent} from "@/plugins/event-type/ItemDragEvent";


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
    const {layoutManager: manager, engine} = container
    autoSetSizeAndMargin(container, true)
    engine.reset()
    const res = manager.analysis(engine.items, null, {
      baseLine: container.getConfig("baseLine"),
      auto: ev.hasAutoDirection()
    })
    res.patch()
    engine.items = res.successItems
    engine.items.forEach(item => item.mount())
    ev.patchStyle(res.successItems)
    if (!res.isSuccess) {
      console.log(res.failedItems)
      container.bus.emit('error', <any>{
        name: 'ContainerOverflowError',
        msg: "容器溢出或者Item重叠，只有item明确指定了x,y或者容器col,row情况下会出现此错误",
        data: res
      })
    }
  },

  /**
   * container盒子大小改变
   * */
  containerResizing(_: ItemLayoutEvent) {
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterLeft(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterRight(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterTop(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOuterBottom(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragging(ev: ItemDragEvent) {
    patchDragDirection(ev)
  },

  dragend(_: ItemDragEvent) {
  },

  /**
   * 在container内且鼠标位置正下方没有toItem，如果移动到Item间空隙也会触发
   * moveToBlank函数能自动过滤静态布局下已经占位的Item不会移动过去，且只会移动到当前容器空白位置处
   * */
  dragToBlank(ev: ItemDragEvent) {
    ev.tryMoveToBlank()
  },


  dragToLeftTop(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  dragToLetBottom(ev: ItemDragEvent) {
    const {dragItem} = tempStore
    if (!dragItem) return
    // console.log('dragToLetBottom')
    ev.tryMoveToNearestBlank()

  },

  dragToRightTop(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  dragToRightBottom(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },


  dragToTop(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  dragToBottom(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  dragToLeft(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
  },

  dragToRight(ev: ItemDragEvent) {
    ev.tryMoveToNearestBlank()
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
    const itemMinHeight = fromItem.minHeight()
    const nextHeight = ev.mousePointY < itemMinHeight ? itemMinHeight : ev.mousePointY
    updateStyle({
      height: `${nextHeight}px`,
    }, cloneElement)
  },

  resizeToBottom(ev: ItemResizeEvent) {
    // console.log('resizeToBottom')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    const spaceBottom = ev.spaceBottom
    const nextHeight = ev.mousePointY > spaceBottom ? spaceBottom : ev.mousePointY
    updateStyle({
      height: `${nextHeight}px`,
      maxHeight: `${ev.offsetBottom}px`
    }, cloneElement)
  },

  resizeToLeft(ev: ItemResizeEvent) {
    // console.log('resizeToLeft')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    const itemMinWidth = fromItem.minWidth()
    const nextWidth = ev.mousePointX < itemMinWidth ? itemMinWidth : ev.mousePointX
    updateStyle({
      width: `${nextWidth}px`
    }, cloneElement)
  },

  resizeToRight(ev: ItemResizeEvent) {
    // console.log('resizeToRight')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    const spaceRight = ev.spaceRight
    const nextWidth = ev.mousePointX > spaceRight ? spaceRight : ev.mousePointX
    updateStyle({
      width: `${nextWidth}px`,
      maxWidth: `${ev.offsetRight}px`
    }, cloneElement)
  },

  resizing(ev: ItemResizeEvent) {
    const {fromItem} = tempStore
    if (!fromItem) return
    ev.patchResizeDirection()
    patchResizeNewSize(ev)
  },

  resized(_: ItemResizeEvent) {
  },

  itemSizeChange() {
    // console.log('itemSizeChange')
  },

  closing(ev: ItemLayoutEvent) {
    const {fromItem, toItem} = tempStore
    if (toItem && toItem === fromItem) {  // 按下和抬起要同一个item才能关闭
      toItem.remove(true)
      ev.layoutManager.unmark(fromItem.pos)
      toItem.container.bus.emit('closed')
    }
  },

  closed(_: ItemLayoutEvent) {
  },

  /**
   * 自动执行响应式布局贴近网格
   * @param ev 如果没有传入customEv的时候默认使用的事件对象
   * @param customEv 开发者如果传入customEv则会替代默认ev事件对象，customEv应当包含修改过后的items或者使用addModifyItems添加过要修改的成员
   * */
  updateLayout(ev: ItemDragEvent | ItemResizeEvent, customEv: ItemDragEvent | ItemResizeEvent) {
    directUpdateLayout(<any>customEv || ev)
  }
})


