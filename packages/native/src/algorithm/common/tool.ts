// noinspection JSUnusedGlobalSymbols

/**
 * 判断两个item的大小是否相等
 * */
import {Container, Item} from "@/main";
import {CustomItemPos, LayoutItemInfo} from "@/types";
import {tempStore} from "@/global";
import {getClientRect, SingleThrottle, singleThrottleCrossContainerRule} from "@/utils";


/**
 * 检测是否正在动画中,少用，容易回流
 * */
export function isAnimation(item: Item) {
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
const singleRectThrottle = new SingleThrottle<{ rect: DOMRect }>()
singleRectThrottle.addRules(singleThrottleCrossContainerRule)

/**
 * 计算当前鼠标相对container的位置
 * */
export function analysisCurPositionInfo(container: Container): {
  relativeX: number,
  relativeY: number,
  gridX: number,
  gridY: number,
} {
  const {mousemoveEvent} = tempStore
  if (!mousemoveEvent) return
  const result: any = {}
  singleRectThrottle.do(() => singleRectThrottle.setCache("rect", getClientRect(container.contentElement, true)), 0)
  const {left: containerLeft, top: containerTop} = singleRectThrottle.getCache("rect")
  const relativeLeftTopX4Container = mousemoveEvent.clientX - containerLeft
  const relativeLeftTopY4Container = mousemoveEvent.clientY - containerTop
  const margin = container.getConfig('margin')
  const size = container.getConfig('size')
  result.relativeX = Math.ceil(Math.abs(relativeLeftTopX4Container) / (margin[0] * 2 + size[0])) * Math.sign(relativeLeftTopX4Container)
  result.relativeY = Math.ceil(Math.abs(relativeLeftTopY4Container) / (margin[1] * 2 + size[1])) * Math.sign(relativeLeftTopY4Container)
  const contentBoxW = container.contentBoxW
  const contentBoxH = container.contentBoxH
  result.gridX = result.relativeX < 1 ? 1 : (result.relativeX > contentBoxW ? contentBoxW : result.relativeX)
  result.gridY = result.relativeY < 1 ? 1 : (result.relativeY > contentBoxH ? contentBoxH : result.relativeY)
  return result
}

//------------------------------------------------------------------
