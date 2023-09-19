import {CustomItemPos} from "@/types";
import {Item} from "@/main";
import {getKebabCase} from "@/utils/tool";
import {tempStore} from "@/global";


/**
 * 获取某个item在container中(默认设定是在空白容器)的安全可移动的范围，该范围不会超出容器
 * */
export function createMovableRange(fromItem: Item, pos: CustomItemPos) {
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
export function updateStyle(
  style: Partial<CSSStyleDeclaration> & { [ket: string]: any },
  element: HTMLElement,
) {
  if (Object.keys(style).length === 0 || !element) return
  let cssText = ''
  Object.keys(style).forEach((key) => cssText = `${cssText} ${getKebabCase(key)}:${style[key]}; `)
  element.style.cssText = element.style.cssText + ';' + cssText
}

/**
 * 判断当前操作行为是否允许跨容器移动
 * */
export function canExchange() {
  const {fromContainer, fromItem, toContainer} = tempStore
  if (!fromContainer || !fromItem || !toContainer) return false
  return !(!fromItem.exchange   /* 要求item和容器都允许交换才能继续 */
    || !toContainer.getConfig('exchange')
    || !fromContainer.getConfig('exchange'));

}
