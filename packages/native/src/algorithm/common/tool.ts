// noinspection JSUnusedGlobalSymbols

/**
 * 判断两个item的大小是否相等
 * */
import {Item} from "@/main";
import {CustomItemPos} from "@/types";


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

// this.manager = manager
// let old = 0;
// this.throttle = (func) => {
//   let now = new Date().valueOf();
//   let res
//   if (now - old > this.wait) {
//     res = func.apply(<object>this);
//     old = now;
//   }
//   return res
// }
