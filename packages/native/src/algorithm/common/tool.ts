// noinspection JSUnusedGlobalSymbols

/**
 * 判断两个item的大小是否相等
 * */
import {Container, Item} from "@/main";
import {CustomItemPos, LayoutItemInfo} from "@/types";
import {tempStore} from "@/global";
import {getContainerConfigs} from "@/utils";


/**
 * 检测是否正在动画中,少用，容易回流
 * */
export function isItemAnimating(item: Item) {
  return Math.abs(
    item.offsetLeft() - item.element.offsetLeft
    || item.offsetTop() - item.element.offsetTop
  ) > 2
}

export function createModifyPosInfo(item: Item, pos: Partial<CustomItemPos>): LayoutItemInfo {
  return {
    item,
    nextPos: {
      ...item.pos,
      ...pos
    }
  }
}

//------------------------------------------------------------------

/**
 * 计算当前鼠标相对container的位置
 * */
export function analysisCurLocationInfo(container: Container): {
  relativeX: number,
  relativeY: number,
  gridX: number,
  gridY: number,
} {
  const {mousemoveEvent} = tempStore
  if (!mousemoveEvent) {
    return void 0
  }
  const result: any = {}
  const {left: containerLeft, top: containerTop} = container.STRect.getCache("containerContent")
  const relativeLeftTopX4Container = mousemoveEvent.clientX - containerLeft - tempStore.lastOffsetM_left * tempStore.mousedownItemOffsetLeftProportion
  const relativeLeftTopY4Container = mousemoveEvent.clientY - containerTop - tempStore.lastOffsetM_left * tempStore.mousedownItemOffsetTopProportion
  const {
    gapX,
    gapY,
    itemWidth,
    itemHeight
  } = getContainerConfigs(this.container, ["gapX", "gapY", "itemWidth", "itemHeight"])

  // console.log(relativeLeftTopX4Container, relativeLeftTopY4Container)
  result.relativeX = Math.ceil(Math.abs(relativeLeftTopX4Container) / (gapX * 2 + itemWidth)) * Math.sign(relativeLeftTopX4Container)
  result.relativeY = Math.ceil(Math.abs(relativeLeftTopY4Container) / (gapY * 2 + itemHeight)) * Math.sign(relativeLeftTopY4Container)
  const contentBoxW = container.contentBoxW
  const contentBoxH = container.contentBoxH
  result.gridX = result.relativeX < 1 ? 1 : (result.relativeX > contentBoxW ? contentBoxW : result.relativeX)
  result.gridY = result.relativeY < 1 ? 1 : (result.relativeY > contentBoxH ? contentBoxH : result.relativeY)
  return result
}
