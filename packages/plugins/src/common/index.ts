import {
  clamp,
  throttle,
  tempStore,
  BaseEvent,
  ItemLayoutEvent,
  Item,
  autoSetSizeAndMargin,
} from "@biggerstar/layout";
import {isFunction, isObject} from "is-what";

/**
 * 更新最新resize后的尺寸
 * */
export const updateResponsiveResizeLayout = (ev: any) => {
  const fromItem = tempStore.fromItem || ev.fromItem
  const toPos = {
    x: ev.startGridX,
    y: ev.startGridY,
    w: Math.min(clamp(Math.max(ev.shadowItemInfo.offsetRelativeW, 0) + 1, fromItem.pos.minW, fromItem.pos.maxW), ev.col - fromItem.pos.x + 1),
    h: Math.min(clamp(Math.max(ev.shadowItemInfo.offsetRelativeH, 0) + 1, fromItem.pos.minH, fromItem.pos.maxH), ev.row - fromItem.pos.y + 1),
  }
  if (fromItem.pos.w !== toPos.w || fromItem.pos.h !== toPos.h) {
    ev.addModifyItem(fromItem, toPos)
    directUpdateLayout(ev)
  }
}

/**
 * @param ev 事件对象
 * @param callback 处理当前影子item覆盖的item
 * */
export const updateResponsiveDragLayout: Function = throttle((ev: any, callback: Function) => {
  const {fromItem} = tempStore
  if (!fromItem || !isFunction(callback)) return
  // console.log(ev.name)
  //--------------------------------------------------------------------
  const manager = ev.container.layoutManager
  const {autoGrowCol, autoGrowRow} = ev.container
  const toPos = {
    ...fromItem.pos,
    x: autoGrowCol ? ev.startRelativeX : ev.startGridX,
    y: autoGrowRow ? ev.startRelativeY : ev.startGridY,
  }
  // console.log(toPos)
  ev.addModifyItem(fromItem, toPos) // 指定修改当前鼠标拖动item的位置
  ev.findDiffCoverItem(null, (item: Item) => {
    const changePos = callback(item)
    if (changePos && isObject(changePos)) ev.addModifyItem(item, changePos)  // 添加被当前cloneEl覆盖item的移动方式
  })
  // console.log(items)

  /*
   * 获取大小到当前所有被覆盖范围内要修改的最大x和y，保证在切换的时候不会因为容器不够大而布局失败
   * 例如在底部边界一个 4x4 item 向上移动，此时toPos位置小于容器大小，
   * 而向上被覆盖的4x4所有的item因为没法拓展往下移动而布局被拒绝
   * */
  const modifyItems = ev.getModifyItems(true)
  let maxX = toPos.x
  let maxY = toPos.y
  modifyItems.forEach(info => {
    maxX = Math.max(<number>info.nextPos.x, maxX)
    maxY = Math.max(<number>info.nextPos.y, maxY)
  })
  toPos.x = maxX
  toPos.y = maxY

  manager.expandLineForPos(toPos, {
    row: {force: true},
    col: {force: true}
  })

  const {offsetRelativeW, offsetRelativeH} = ev.shadowItemInfo
  const isSuccess = directUpdateLayout(ev)
  // console.log(isSuccess)
  if (!isSuccess) {
    if (ev.toItem && !ev.inOuter) {  // 如果是斜角，符合某条件直接移动到该位置
      // console.log(offsetRelativeW, offsetRelativeH)
      if (Math.abs(offsetRelativeW) > 2 && Math.abs(offsetRelativeH) > 2) {
        ev.addModifyItem(fromItem, toPos)
      }
      directUpdateLayout(ev)
    } else if (autoGrowRow || autoGrowCol) {
      ev.setItemPos(fromItem, toPos)
    }
  }

}, 66)


/**
 * [响应式]立即更新布局
 * */
export const directUpdateLayout = (ev: BaseEvent | ItemLayoutEvent): boolean => {
  const {container} = ev
  if (!container._mounted) return false
  const {layoutManager: manager} = container
  autoSetSizeAndMargin(container, true)
  //-------------------------------------------------------------//
  container.reset()
  const getModifyItemsFn: Function = ev['getModifyItems']
  const modifyList = isFunction(getModifyItemsFn) ? getModifyItemsFn.call(ev) : []
  let res = manager.analysis(modifyList)
  // console.log(res.isSuccess)
  if (!res.isSuccess) return false
  res.patch()
  container.items.forEach((item) => item.updateItemLayout())
  container.updateContainerSizeStyle()
  return true
}

/**
 * 节流更新布局的函数
 * */
export const updateLayout: Function = throttle(directUpdateLayout, 46)
