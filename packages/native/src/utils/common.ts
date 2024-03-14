// noinspection JSUnusedGlobalSymbols

import {CustomItemPos, CustomLayoutOption} from "@/types";
import {Container, Item} from "@/main";
import {cloneDeep, getKebabCase} from "@/utils/tool";


/**
 * 获取某个item在container中(默认设定是在空白容器)的安全可移动的范围，该范围不会超出容器
 * */
export function createMovableRange(fromItem: Item, pos: CustomItemPos): CustomItemPos {
  const container = fromItem.container;
  let {x, y, w, h} = pos;
  const maxX = container.getConfig('col') - w + 1;
  const maxY = container.getConfig('row') - h + 1;
  if (x < 1) {
    x = 1;
  }
  if (y < 1) {
    y = 1;
  }
  if (x > maxX) {
    x = maxX;
  }
  if (y > maxY) {
    y = maxY;
  }
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
  if (0 === Object.keys(style).length || !element) {
    return
  }
  if (cssTextMode) {
    let cssText = '';
    Object.keys(style).forEach((key) => cssText = `${cssText} ${getKebabCase(key)}:${style[key]}; `);
    element.style.cssText = element.style.cssText + ';' + cssText
  } else {
    for (const cssName in style) {
      element.style[cssName] = style[cssName]
    }
  }
}

/**
 * 获取container中的配置
 * */
export const _getConfig = (container: Container, name: string) => {
  const has = (obj: object, name: string) => obj.hasOwnProperty(name);
  if (has(container.useLayout, name)) {
    return container.useLayout[name]
  }
  if (has(container.layout, name)) {
    return container.layout[name]
  }
  if (has(container._default, name)) {
    return container._default[name]
  }
  return void 0
};

/**
 * 批量获取container的配置信息，不会发起getContainer事件
 * */
export function getContainerConfigs<Name extends keyof CustomLayoutOption>(container: Container, nameInfo: Name)
  : Exclude<CustomLayoutOption[Name], undefined>
export function getContainerConfigs<Name extends keyof CustomLayoutOption>(container: Container, nameInfo: Name[])
  : { [Key in Name]: CustomLayoutOption[Key] }
export function getContainerConfigs<Name extends keyof CustomLayoutOption>(
  container: Container,
  nameInfo: Name[] | Name
): any {
  let result: any;
  //@ts-ignore
  if (Array.isArray(nameInfo)) {
    result = {};
    (nameInfo as []).forEach(name => result[name] = _getConfig(container, name))
  } else {
    result = _getConfig(container, nameInfo)
  }
  return result
}


