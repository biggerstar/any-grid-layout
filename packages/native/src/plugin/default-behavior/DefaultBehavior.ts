import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";
import {ItemLayoutEvent} from "@/plugin/event-type/ItemLayoutEvent";
import {definePlugin} from "@/plugin/global";
import {directUpdateLayout, updateLayout} from "@/plugin/default-behavior/common";
import {ItemResizeEvent} from "@/plugin/event-type/ItemResizeEvent";
import {updateStyle} from "@/utils";


/**
 * 内置默认布局，外面没有阻止默认行为的时候执行的函数,默认是静态布局，要实现响应式布局需要自行通过插件实现
 * */
export const DefaultLayout = definePlugin({
  /**
   * 用于作为主布局算法时，「初次加载」Item到容器时初始化，用于设置容器的大小或其他操作
   * 内置已经实现，支持用户阻止init默认行为自行实现
   * @return {AnalysisResult | void} 返回结果，如果failed长度不为0，表明有item没添加成功则会抛出警告事件
   * */
  init(ev: ItemLayoutEvent) {
    const {container} = ev
    const {layoutManager: manager, eventManager, engine} = container
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
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeLeft(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeRight(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeTop(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeBottom(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  itemMoving(ev: ItemLayoutEvent) {
    if (!tempStore.dragItem) return
    ev.patchDragDirection()
  },

  itemMoved(_: ItemLayoutEvent) {
  },

  /**
   * 在container内且鼠标位置正下方没有toItem，如果移动到Item间空隙也会触发
   * moveToBlank函数能自动过滤静态布局下已经占位的Item不会移动过去，且只会移动到当前容器空白位置处
   * */
  dragToBlank(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToLeftTop(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToLetBottom(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToRightTop(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToRightBottom(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToTop(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToBottom(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToLeft(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  dragToRight(ev: ItemLayoutEvent) {
    ev.tryMoveToBlank()
  },

  containerResizing(ev: ItemLayoutEvent) {
    updateLayout(ev)
  },

  resizeOutsizeTop() {
    console.log('resizeOutsizeTop')
  },

  resizeOutsizeRight() {
    console.log('resizeOutsizeRight')
  },

  resizeOutsizeBottom() {
    console.log('resizeOutsizeBottom')
  },

  resizeOutsizeLeft() {
    console.log('resizeOutsizeLeft')
  },

  resizeToTop(ev: ItemResizeEvent) {
    console.log('resizeToTop')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    const itemMinHeight = fromItem.minHeight()
    const nextHeight = ev.mousePointY < itemMinHeight ? itemMinHeight : ev.mousePointY
    updateStyle({
      height: `${nextHeight}px`,
    }, cloneElement)
  },

  resizeToBottom(ev: ItemResizeEvent) {
    console.log('resizeToBottom')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    const spaceBottom = ev.spaceBottom
    const nextHeight = ev.mousePointY > spaceBottom ? spaceBottom : ev.mousePointY
    console.log(nextHeight, spaceBottom)
    updateStyle({
      height: `${nextHeight}px`,
      maxHeight: `${ev.offsetBottom}px`
    }, cloneElement)
  },

  resizeToLeft(ev: ItemResizeEvent) {
    console.log('resizeToLeft')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    const itemMinWidth = fromItem.minWidth()
    const nextWidth = ev.mousePointX < itemMinWidth ? itemMinWidth : ev.mousePointX
    updateStyle({
      width: `${nextWidth}px`
    }, cloneElement)
  },

  resizeToRight(ev: ItemResizeEvent) {
    console.log('resizeToRight')
    const {fromItem, cloneElement} = tempStore
    if (!fromItem || !cloneElement) return
    const spaceRight = ev.spaceRight
    const nextWidth = ev.mousePointX > spaceRight ? spaceRight : ev.mousePointX

    updateStyle({
      width: `${nextWidth}px`,
      maxWidth: `${ev.offsetRight}px`
    }, cloneElement)
  },

  itemResizing(ev: ItemResizeEvent) {
    const {fromItem} = tempStore
    if (!fromItem) return
    ev.patchResizeDirection()
    // console.log(ev.mousePointX, ev.mousePointY);

  },

  itemResized(_: ItemResizeEvent) {
  },

  itemClosing(ev: ItemLayoutEvent) {
    const {fromItem, toItem} = tempStore
    if (toItem && toItem === fromItem) {  // 按下和抬起要同一个item才能关闭
      toItem.remove(true)
      ev.layoutManager.unmark(fromItem.pos)
      toItem.container.bus.emit('itemClosed')
    }
  },

  itemClosed(_: ItemLayoutEvent) {
  },

  /**
   * 自动执行响应式布局贴近网格
   * @param ev 如果没有传入customEv的时候默认使用的事件对象
   * @param customEv 开发者如果传入customEv则会替代默认ev事件对象，customEv应当包含修改过后的items或者使用addModifyItems添加过要修改的成员
   * */
  updateLayout(ev: ItemLayoutEvent, customEv: ItemLayoutEvent) {
    directUpdateLayout(ev || customEv)
  }
})


