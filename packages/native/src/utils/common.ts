import {CustomItemPos} from "@/types";
import {DomFunctionImpl} from "@/utils/DomFunctionImpl";
import {tempStore} from "@/global";
import {Item} from "@/main";


/**
 * 获取某个item在container中(默认设定是在空白容器)的安全可移动的范围，该范围不会超出容器
 * */
export function getMovableRange(fromItem:Item,pos: CustomItemPos) {
  const container = fromItem.container
  let {x,y,w,h} = pos
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
export function updateStyle(styles: Partial<CSSStyleDeclaration> & { [ket: string]: any }, el: HTMLElement) {
  DomFunctionImpl.prototype.updateStyle.call(null,styles, el)
}
