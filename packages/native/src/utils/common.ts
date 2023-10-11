// noinspection JSUnusedGlobalSymbols

import {CustomItemPos, CustomLayoutsOption} from "@/types";
import {Container, Item} from "@/main";
import {cloneDeep, getKebabCase} from "@/utils/tool";
import {tempStore} from "@/global";


/**
 * 获取某个item在container中(默认设定是在空白容器)的安全可移动的范围，该范围不会超出容器
 * */
export function createMovableRange(fromItem: Item, pos: CustomItemPos): CustomItemPos {
  const container = fromItem.container
  let {x, y, w, h} = pos
  const maxX = container.getConfig('col') - w + 1
  const maxY = container.getConfig('row') - h + 1
  if (x < 1) x = 1
  if (y < 1) y = 1
  if (x > maxX) x = maxX
  if (y > maxY) y = maxY
  return {
    w,
    h,
    x,
    y
  }
}

/**
 * 通过cssText的方式更新某个dom元素的样式
 * */
export function updateStyle<EL extends HTMLElement>(
  style: Partial<CSSStyleDeclaration> & { [ket: string]: any } = {},
  element: EL,
  cssTextMode: boolean = true
) {
  if (Object.keys(style).length === 0 || !element) return
  if (cssTextMode) {
    let cssText = ''
    Object.keys(style).forEach((key) => cssText = `${cssText} ${getKebabCase(key)}:${style[key]}; `)
    element.style.cssText = element.style.cssText + ';' + cssText
  } else {
    for (const cssName in style) {
      element.style[cssName] = style[cssName]
    }
  }
}

/**
 * 判断当前操作行为是否允许跨容器移动
 * */
export function canExchange() {
  const {fromContainer, fromItem, toContainer} = tempStore
  if (!fromContainer || !fromItem || !toContainer) return false
  return fromItem.exchange                      /* 要求item和容器都允许交换才能继续 */
    && toContainer.getConfig('exchange')
    && fromContainer.getConfig('exchange')
}

/**
 * 获取container中的配置
 * */
export const _getConfig = (container, name) => {
  const has = (obj: object, name: string) => obj.hasOwnProperty(name)
  if (has(container.useLayout, name)) return container.useLayout[name]
  if (has(container.layout, name)) return container.layout[name]
  if (has(container.global, name)) return container.global[name]
  if (has(container._default, name)) return cloneDeep(container._default[name])
  return void 0
}

/**
 * 批量获取container的配置信息，不会发起getContainer事件
 * */
export declare function getContainerConfigs<Name extends keyof CustomLayoutsOption>(container: Container, nameInfo: Name)
  : Exclude<CustomLayoutsOption[Name], undefined>
export declare function getContainerConfigs<Name extends keyof CustomLayoutsOption>(container: Container, nameInfo: Name[])
  : { [Key in Name]: CustomLayoutsOption[Key] }
export function getContainerConfigs<Name extends keyof CustomLayoutsOption>(
  container: Container,
  nameInfo: Name[] | Name
): any {
  let result
  //@ts-ignore
  if (!Array.isArray(nameInfo)) {
    result = _getConfig(container, nameInfo)
  } else {
    result = {};
    (nameInfo as []).forEach(name => result[name] = _getConfig(container, name))
  }
  return result
}


