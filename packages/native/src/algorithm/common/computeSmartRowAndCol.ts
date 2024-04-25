import {Item, ItemPos} from "@/main";
import {SmartRowAndColType} from "@/types";

/**
 * 智能计算当前 已经布局后items中的最大col边界值和最大row边界值
 * */
export function computeSmartRowAndCol(items: Item[]): SmartRowAndColType {
  let smartCol = 1, smartRow = 1, maxItemW = 1, maxItemH = 1
  items.forEach((item: Item) => {
    const {x, y, w, h} = item.pos as Required<ItemPos>
    // console.log({x, y, w, h})
    if ((x + w - 1) > smartCol) {
      smartCol = x + w - 1
    }
    if ((y + h - 1) > smartRow) {
      smartRow = y + h - 1
    }
    if (w > maxItemW) {
      maxItemW = w
    }
    if (h > maxItemH) {
      maxItemH = h
    }
  })
  return {
    smartCol,
    smartRow,
    maxItemW,
    maxItemH,
  }
}
