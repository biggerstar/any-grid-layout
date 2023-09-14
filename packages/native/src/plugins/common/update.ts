import {autoSetSizeAndMargin} from "@/algorithm/common";
import {throttle, updateStyle} from "@/utils";
import {isFunction, isObject} from "is-what";
import {ItemDragEvent} from "@/plugins/event-types/ItemDragEvent";
import {ItemResizeEvent} from "@/plugins/event-types/ItemResizeEvent";
import {ItemLayoutEvent} from "@/plugins";
import {isAnimation} from "@/algorithm/common/tool";
import {Item} from "@/main";
import {tempStore} from "@/global";

/**
 * 节流后的patchDragDirection
 * */
export const patchDragDirection: Function = throttle((ev: ItemDragEvent) => {
  ev.patchDragDirection()
}, 46)

/**
 * 检测item resize的时候是否改变了大小
 * 节流后的patchResizeNewSize
 * */
export const checkItemHasChanged: Function = (_: ItemResizeEvent) => {
  const {fromItem, lastResizeW, lastResizeH} = tempStore
  if (!fromItem) return
  // console.log(fromItem.pos.w, fromItem.pos.h, tempStore.lastResizeW, tempStore.lastResizeH)
  if (fromItem.pos.w !== tempStore.lastResizeW || fromItem.pos.h !== tempStore.lastResizeH) {
    tempStore.lastResizeW = fromItem.pos.w
    tempStore.lastResizeH = fromItem.pos.h
    if (lastResizeW && lastResizeH) fromItem.container.bus.emit('itemSizeChange')
  }
}

/**
 * 立即更新布局
 * */
export const directUpdateLayout = (ev: ItemDragEvent | ItemResizeEvent | ItemLayoutEvent, options: { sort?: boolean } = {}) => {
  const {container, items, toContainer} = ev
  if (toContainer && !ev['allowLayout']?.()) return
  options = Object.assign({
    sort: true
  }, options)
  const {layoutManager: manager} = container
  autoSetSizeAndMargin(container, true)
  //-------------------------------------------------------------//
  container.reset()
  let res = manager.analysis(items, ev.getModifyItems(), {
    baseline: container.getConfig("baseLine"),
    auto: ev.hasAutoDirection()
  })
  if (!res.isSuccess) return
  res.patch()
  ev.patchStyle()
  if (options.sort) container.items = manager.sortCurrentMatrixItems(ev.items)
  container.updateContainerSizeStyle()
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
  ev.prevent()
  ev.addModifyItem(fromItem, {x: ev.gridX, y: ev.gridY})
  if (isFunction(callback)) {
    ev.findDiffCoverItem(null, (item) => {
      const changePos = callback(item)
      if (changePos && isObject(changePos)) ev.addModifyItem(item, callback(item))
    })
  }
  directUpdateLayout(ev)
}, 30)

/**
 * 节流更新drag到 「对角」 方向的布局
 * */
export const dragToDiagonal: Function = throttle((ev: ItemDragEvent) => {
  const {toItem, fromItem} = tempStore
  const {layoutManager, items} = ev
  if (!toItem || !fromItem) return
  ev.prevent()
  layoutManager.move(items, fromItem, toItem)
  directUpdateLayout(ev)
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

/**
 * 将cloneElement的大小更新为某个Item的一样的尺寸
 * */
export function updateCloneElementSize4Item(newItem: Item) {
  const {cloneElement, fromItem} = tempStore
  if (!cloneElement || !fromItem) return
  // const {left, top} = cloneElement.getBoundingClientRect()
  const {clientWidth, clientHeight} = newItem.element
  const nextWidth = newItem.nowWidth()
  const nextHeight = newItem.nowHeight()
  const fromWidth = fromItem.nowWidth()
  const fromHeight = fromItem.nowHeight()
  updateStyle({
    width: `${clientWidth}px`,
    height: `${clientHeight}px`,
    transitionDuration: '0.3s',
    transitionProperty: 'width,height',
  }, cloneElement)
  // 移动到新容器中改变cloneEl的大小和鼠标拖动位置，按比例缩放
  tempStore.mousedownItemOffsetLeft = tempStore.mousedownItemOffsetLeft * nextWidth / fromWidth
  tempStore.mousedownItemOffsetTop = tempStore.mousedownItemOffsetTop * nextHeight / fromHeight
}






