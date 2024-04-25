// noinspection JSUnusedGlobalSymbols

import {CustomItemPos} from "@/types";
import {Item} from "@/main";
import {getKebabCase} from "@/utils/tool";


/**
 * 获取某个item在container中(默认设定是在空白容器)的安全可移动的范围，该范围不会超出容器
 * */
export function createMovableRange(fromItem: Item, pos: CustomItemPos): CustomItemPos {
  const container = fromItem.container;
  let {x, y, w, h} = pos;
  const maxX = container.state.col - w + 1;
  const maxY = container.state.col - h + 1;
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

