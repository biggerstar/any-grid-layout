import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";
import {ItemLayoutEvent} from "@/plugin/event-type/ItemLayoutEvent";
import {definePlugin} from "@/plugin/global";
import {throttle} from "@/utils";
import {isFunction, isObject} from "is-what";

/**
 * 立即更新布局
 * */
const directUpdateLayout = (ev: ItemLayoutEvent) => {
  const {container, items, toContainer} = ev
  if (toContainer && !ev.allowLayout()) return
  const {layoutManager: manager, engine} = container
  autoSetSizeAndMargin(container, true)
  //-------------------------------------------------------------//
  engine.reset()
  let res = manager.analysis(items, ev.getModifyItems(), {
    baseline: container.getConfig("baseLine"),
    auto: ev.hasAutoDirection()
  })
  // const {newResizeW,newResizeH} = tempStore
  // console.log( {newResizeW,newResizeH},res.isSuccess)
  // console.log(res.isSuccess)
  tempStore.isBlockResize = !res.isSuccess
  if (!res.isSuccess) return
  res.patch()
  ev.patchStyle()
  engine.items = manager.sortCurrentMatrixItems(ev.items)
  container.updateContainerStyleSize()
}

/**
 * 节流更新布局的函数
 * */
const updateLayout: Function = throttle(directUpdateLayout, 66)

/**
 * 节流更新drag到十字线方向的布局
 * */
const dragMoveToCrossHair: Function = throttle((ev: ItemLayoutEvent, callback: Function) => {
  const {dragItem, gridX: x, gridY: y} = tempStore
  if (!dragItem) return
  ev.addModifyItems(dragItem, {x, y})
  if (isFunction(callback)) {
    ev.findDiffCoverItem(null, (item) => {
      const changePos = callback(item)
      if (changePos && isObject(changePos)) ev.addModifyItems(item, callback(item))
    })
  }
  updateLayout(ev)
}, 66)

/**
 * 节流更新drag到对角方向的布局
 * */
const dragMoveToDiagonal: Function = throttle((ev: ItemLayoutEvent) => {
  const {toItem, dragItem} = tempStore
  const {layoutManager, items} = ev
  if (!toItem || !dragItem) return
  layoutManager.move(items, dragItem, toItem)
  updateLayout(ev)
}, 200)

// const containerOutsizeMoving: Function = throttle((ev: ItemLayoutEvent, callback: (item: Item) => void) => {
//   const {dragItem} = tempStore
//   if (!dragItem) return
//   ev.findDiffCoverItem((item) => {
//     if (isFunction(callback)) callback(item)
//     ev.addModifyItems(dragItem)
//     ev.addModifyItems(item)
//     updateLayout(ev)
//   })
// }, 100)


/**
 * 内置默认布局，外面没有阻止默认行为的时候执行的函数
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
      eventManager._error_(
        'ContainerOverflowError',
        "容器溢出或者Item重叠，只有item明确指定了x,y或者容器col,row情况下会出现此错误"
        , res
      )
    }
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeLeft(ev: ItemLayoutEvent) {
    const {dragItem,toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({x: item.pos.x + dragItem.pos.w}) : null)
  },

  /**
   * 在container外围X轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeRight(ev: ItemLayoutEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({x: item.pos.x - dragItem.pos.w}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeTop(ev: ItemLayoutEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({y: item.pos.y + dragItem.pos.h}) : null)
  },

  /**
   * 在container外围Y轴移动的事件，移动方向钩子不会触发，但是itemMoving照样会触发
   * */
  dragOutsizeBottom(ev: ItemLayoutEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem) return
    dragMoveToCrossHair(ev, (item) => toItem ? ({y: item.pos.y - dragItem.pos.h}) : null)
  },

  itemMoving(ev: ItemLayoutEvent) {
    if (!tempStore.dragItem) return
    ev.patchDragDirection()
  },

  itemMoved(ev: ItemLayoutEvent) {
    directUpdateLayout(ev)
  },

  dragToLeftTop(ev: ItemLayoutEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToLetBottom(ev: ItemLayoutEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToRightTop(ev: ItemLayoutEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToRightBottom(ev: ItemLayoutEvent) {
    dragMoveToDiagonal(ev)
  },

  dragToTop(ev: ItemLayoutEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(dragItem.pos.y - toItem.pos.y > toItem.pos.h)
      ? (item) => ({y: item.pos.y + dragItem.pos.h})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToBottom(ev: ItemLayoutEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(toItem.pos.y - dragItem.pos.y > dragItem.pos.h)
      ? (item) => ({y: item.pos.y - dragItem.pos.h})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToLeft(ev: ItemLayoutEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(dragItem.pos.x - toItem.pos.x > toItem.pos.w)
      ? (item) => ({x: item.pos.x + dragItem.pos.w})
      : null
    dragMoveToCrossHair(ev, call)
  },

  dragToRight(ev: ItemLayoutEvent) {
    const {dragItem, toItem} = tempStore
    if (!dragItem || !toItem) return
    let call = !(toItem.pos.x - dragItem.pos.x > dragItem.pos.w)
      ? (item) => ({x: item.pos.x - dragItem.pos.w})
      : null
    dragMoveToCrossHair(ev, call)
  },

  containerResizing(ev: ItemLayoutEvent) {
    updateLayout(ev)
  },

  itemResizing(ev: ItemLayoutEvent) {
    console.log('itemResizing');
    const {fromItem, newResizeW, newResizeH} = tempStore
    if (!fromItem) return
    ev.addModifyItems(fromItem, {
      w: newResizeW,
      h: newResizeH,
    })
    directUpdateLayout(ev)
  },

  itemResized(ev: ItemLayoutEvent) {
    directUpdateLayout(ev)
  },

  itemClosing(_: ItemLayoutEvent) {
    // 无任何默认操作
    console.log('itemClosing');
  },

  itemClosed(ev: ItemLayoutEvent) {
    directUpdateLayout(ev)
    console.log('itemClosed')
  },

  updateLayout(ev: ItemLayoutEvent) {
    console.log(111111111111111111)
    directUpdateLayout(ev)
  }
})
