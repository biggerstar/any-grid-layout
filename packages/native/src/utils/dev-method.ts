// noinspection JSUnusedGlobalSymbols

/**
 * 本模块用于存放开发中测试的工具函数，不会打包到生产环境中
 * 后面看情况再从主框架源码中独立出来放到其他地方
 * */

import {getOffsetClientRect} from "@/utils/tool";

/**
 * 为某个元素生成边框用于显示位置变化
 * @param element
 * @param opt
 * @param opt.keepChildren 默认为 false, 是否保持元素内部的内容, 只有在 isRect 为 false 时生效
 * @param opt.isRect  默认为 false, 是否 使用getBoundingClientRect 获取到的矩形描边， 否则将直接应用 transform 后的 3d 形态
 * @param opt.isOrigin  默认为 true, 是否显示 transformOrigin 位置
 * */
export function generateBorderShadow(element: HTMLElement, opt?: {
  keepChildren?: boolean,
  isRect?: boolean,
  isOrigin?: boolean,
  style?: Partial<CSSStyleDeclaration>,
}): HTMLElement {
  const {keepChildren = false, isRect = false, isOrigin = true, style} = opt || {}
  let shadowElement: HTMLElement
  const rect = element.getBoundingClientRect()
  if (isRect) {
    shadowElement = document.createElement('div')
    shadowElement.style.position = 'fixed'
    shadowElement.style.left = `${rect.left}px`
    shadowElement.style.top = `${rect.top}px`
    shadowElement.style.width = `${rect.width}px`
    shadowElement.style.height = `${rect.height}px`
  } else {
    const offsetRect = getOffsetClientRect(element)
    shadowElement = <HTMLElement>element.cloneNode(true)
    if (!keepChildren) {
      Array.from(shadowElement.children).forEach(node => node.remove())
    }
    shadowElement.style.position = 'fixed'
    shadowElement.style.left = `${offsetRect.left}px`
    shadowElement.style.top = `${offsetRect.top}px`
  }
  shadowElement.style.background = 'transparent'
  shadowElement.style.border = '#e1dede solid 1px'
  shadowElement.style.pointerEvents = 'none'
  if (style) {
    Object.assign(shadowElement.style, style || {})
  }
  document.body.appendChild(shadowElement)
  if (isOrigin) {
    generateTransformOriginPointElement(shadowElement)
  }
  return shadowElement
}

/**
 * 为某个元素生成 transformOrigin 的显式元素辅助点
 * */
export function generateTransformOriginPointElement(element: HTMLElement): HTMLDivElement {
  const elementStyleSheet = getComputedStyle(element)
  const transformOrigin = elementStyleSheet.transformOrigin.split(' ').map((str: string) => Number(parseFloat(str).toFixed(0)))
  const divEl = document.createElement("div")
  // console.log(transformOrigin)
  const pointSize = 10
  const borderSize = 1
  divEl.style.marginLeft = `${transformOrigin[0] - (pointSize / 2) - borderSize}px`
  divEl.style.marginTop = `${transformOrigin[1] - (pointSize / 2) - borderSize}px`
  divEl.style.width = `${pointSize}px`
  divEl.style.height = `${pointSize}px`
  divEl.style.background = `rgba(245, 107, 107, 1)`
  divEl.style.borderRadius = '50%'
  divEl.style.border = `#efe6f6 solid ${borderSize}px`
  element.appendChild(divEl)
  return divEl
}
