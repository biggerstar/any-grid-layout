// noinspection JSUnusedGlobalSymbols

/**
 * 判断两个item的大小是否相等
 * */
import {Container, Item} from "@/main";
import {CustomItemPos} from "@/types";
import {tempStore} from "@/global";


/**
 * 检测是否正在动画中,少用，容易回流
 * */
export function isAnimation(item: Item) {
  return Math.abs(
    item.offsetLeft() - item.element.offsetLeft
    || item.offsetTop() - item.element.offsetTop
  ) > 2
}


export function createModifyPosInfo(item: Item, pos: Partial<CustomItemPos>) {
  return {
    item,
    pos: {
      ...item.pos,
      ...pos
    }
  }
}

/**
 *
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
  const {left: containerLeft, top: containerTop} = container.contentElement.getBoundingClientRect()
  const relativeLeftTopX4Container = mousemoveEvent.clientX - containerLeft
  const relativeLeftTopY4Container = mousemoveEvent.clientY - containerTop
  const margin = container.getConfig('margin')
  const size = container.getConfig('size')
  result.relativeX = Math.ceil(Math.abs(relativeLeftTopX4Container) / (margin[0] + size[0])) * Math.sign(relativeLeftTopX4Container)
  result.relativeY = Math.ceil(Math.abs(relativeLeftTopY4Container) / (margin[1] + size[1])) * Math.sign(relativeLeftTopY4Container)
  const contentBoxW = container.contentBoxW
  const contentBoxH = container.contentBoxH
  result.gridX = result.relativeX < 1 ? 1 : (result.relativeX > contentBoxW ? contentBoxW : result.relativeX)
  result.gridY = result.relativeY < 1 ? 1 : (result.relativeY > contentBoxH ? contentBoxH : result.relativeY)
  return result
}
