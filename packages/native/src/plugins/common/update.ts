import {autoSetSizeAndMargin} from "@/algorithm/common";
import {throttle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins";
import {isAnimation} from "@/algorithm/common/tool";
import {tempStore} from "@/global";
import {hasAutoDirection} from "@/plugins/common/method";


/**
 * 检测当前拖动的元素大小和上一次相比是否变化
 * */
export const checkItemSizeHasChanged: Function = (_: ItemResizeEvent) => {
  const {fromItem, lastResizeW, lastResizeH} = tempStore
  if (!fromItem) return
  if (fromItem.pos.w !== tempStore.lastResizeW || fromItem.pos.h !== tempStore.lastResizeH) {
    if (lastResizeW && lastResizeH) fromItem.container.bus.emit('itemSizeChanged', {item: fromItem})
    tempStore.lastResizeW = fromItem.pos.w
    tempStore.lastResizeH = fromItem.pos.h
  }
}

/**
 * 检测当前拖动的元素位置和上一次相比是否变化
 * */
export const checkItemPositionHasChanged: Function = (_: ItemResizeEvent) => {
  const {fromItem, lastDragX, lastDragY} = tempStore
  if (!fromItem) return
  if (fromItem.pos.x !== lastDragX || fromItem.pos.y !== lastDragY) {
    if (lastDragX && lastDragY) fromItem.container.bus.emit('itemPositionChanged', {item: fromItem})
    tempStore.lastDragX = <number>fromItem.pos.x
    tempStore.lastDragY = <number>fromItem.pos.y
  }
}

/**
 * 立即更新布局
 * */
export const directUpdateLayout = (ev: ItemDragEvent | ItemResizeEvent | ItemLayoutEvent, options: { sort?: boolean } = {}): boolean => {
  const {container, items} = ev
  if (!container._mounted) return false
  options = Object.assign({
    sort: true
  }, options)
  const {layoutManager: manager} = container
  autoSetSizeAndMargin(container, true)
  //-------------------------------------------------------------//
  container.reset()
  const baseline = container.getConfig("baseline")
  let res = manager.analysis(items, ev.getModifyItems(), {
    baseline,
    auto: hasAutoDirection(container, baseline)
  })
  if (!res.isSuccess) return false
  res.patch()
  ev.patchStyle()
  if (options.sort) container.items = manager.sortCurrentMatrixItems(ev.items)
  container.updateContainerSizeStyle()
  return true
}

/**
 * 节流更新布局的函数
 * */
export const updateLayout: Function = throttle(directUpdateLayout, 46)

/**
 * 节流更新drag到 +十字线+ 方向的布局
 * */
export const dragToCrossHair: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  const {fromItem} = tempStore
  if (!fromItem) return
  // console.log(111111111111111111)
  // const isSuccess = ev.tryMoveToBlank()
  // console.log(isSuccess)
  // if (isSuccess) {
  //   ev.patchStyle()
  //   ev.container.updateContainerSizeStyle()
  //   return
  // }
  // console.log({
  //   x: ev.startX,
  //   y: ev.startY
  // }, ev)
  ev.prevent()
  ev.addModifyItem(fromItem,
    {
      x: ev.startX,
      y: ev.startY
    })
  if (isFunction(callback)) {
    ev.findDiffCoverItem(null, (item) => {
      const changePos = callback(item)
      // console.log(changePos)
      if (changePos && isObject(changePos)) ev.addModifyItem(item, callback(item))  // 添加被当前cloneEl覆盖item的移动方式
    })
  }
  directUpdateLayout(ev)
}, 30)

/**
 * 节流更新drag到 「对角」 方向的布局
 * */
export const dragToDiagonal: Function = throttle((_: ItemDragEvent) => {
  const {toItem, fromItem} = tempStore
  // const {layoutManager, items} = ev
  if (!toItem || !fromItem) return
  // console.log(222222222222222222)
  // const isSuccess = ev.tryMoveToBlank()
  // if (isSuccess) {
  //   ev.patchStyle()
  //   ev.container.updateContainerSizeStyle()
  //   return;
  // }
  return;

  // ev.prevent()
  // ev.addModifyItem(fromItem,
  //   {
  //     x: ev.startX,
  //     y: ev.startY
  //   })
  // directUpdateLayout(ev)
  //
  //
  // return;
  // ev.prevent()
  // layoutManager.move(items, fromItem, toItem)
  // const isSuccess = directUpdateLayout(ev)
  // if (!isSuccess) {
  //   layoutManager.move(items, toItem, fromItem)
  //   directUpdateLayout(ev)
  // }
}, 200)

/**
 * 更新最新resize后的尺寸
 * */
export const updateResponsiveResizeLayout = (ev: ItemResizeEvent) => {
  const {fromItem} = tempStore
  if (!fromItem) return
  ev.addModifyItem(fromItem, {
    w: ev.restrictedItemW,
    h: ev.restrictedItemH,
  })
  directUpdateLayout(ev)
}

/**
 * 拖动Item到Items列表中的toItem的索引位置
 * */
export const moveToIndexForItems: Function = throttle((ev: ItemDragEvent) => {
  const {fromItem, toItem} = tempStore
  if (!fromItem || !toItem) return
  if (isAnimation(fromItem)) return;
  const manager = ev.layoutManager
  manager.move(ev.items, fromItem, toItem)
  directUpdateLayout(ev, {sort: false})
}, 80)



