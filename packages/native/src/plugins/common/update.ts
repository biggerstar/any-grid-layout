import {autoSetSizeAndMargin} from "@/algorithm/common";
import {throttle} from "@/utils";
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
 * 节流后的patchResizeNewSize
 * */
export const patchNewSize4Resize: Function = throttle((ev: ItemResizeEvent) => {
  const {fromItem} = tempStore
  if (!fromItem) return
  if (fromItem.pos.w !== ev.w || fromItem.pos.h !== ev.h) {
    fromItem.container.bus.emit('itemSizeChange')
  }
}, 162)

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
export const dragMoveToCrossHair: Function = throttle((ev: ItemDragEvent, callback: Function) => {
  const {fromItem} = tempStore
  if (!fromItem) return
  ev.prevent()
  ev.addModifyItems(fromItem, {x: ev.gridX, y: ev.gridY})
  if (isFunction(callback)) {
    ev.findDiffCoverItem(null, (item) => {
      const changePos = callback(item)
      if (changePos && isObject(changePos)) ev.addModifyItems(item, callback(item))
    })
  }
  directUpdateLayout(ev)
}, 30)

/**
 * 节流更新drag到 「对角」 方向的布局
 * */
export const dragMoveToDiagonal: Function = throttle((ev: ItemDragEvent) => {
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
  ev.addModifyItems(fromItem, {
    w: ev.gridW,
    h: ev.gridH,
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
export function updateCloneElementSize(newItem: Item) {
  const {cloneElement} = tempStore
  if (!cloneElement) return
  newItem.domImpl.updateStyle({
    width: `${newItem.element.clientWidth}px`,
    height: `${newItem.element.clientHeight}px`,
    transitionDuration: '0.3s',
    transitionProperty: 'width,height'
  }, cloneElement)

}
