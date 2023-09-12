import {Container, Item, ItemPos} from "@/main";

/**
 * 智能计算当前 已经布局后items中的最大col边界值和最大row边界值
 * */
export function computeSmartRowAndCol(container: Container) {
  let smartCol = 1, smartRow = 1, maxItemW = 1, maxItemH = 1
  const items = container.items
  items.forEach((item: Item) => {
    const {x, y, w, h} = item.pos as Required<ItemPos>
    if ((x + w - 1) > smartCol) smartCol = x + w - 1
    if ((y + h - 1) > smartRow) smartRow = y + h - 1
    if (w > maxItemW) maxItemW = w
    if (h > maxItemH) maxItemH = h
  })
  return {
    smartCol,
    smartRow,
    maxItemW,
    maxItemH,
  }
}
