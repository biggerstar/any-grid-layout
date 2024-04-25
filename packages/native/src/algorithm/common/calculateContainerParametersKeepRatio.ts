import {ComputedLayoutOptions, ContainerParameters} from "@/types";
import {isNumber} from "is-what";

/**
 * 自动计算 gapX, gapY 和 itemWidth, itemHeight 和 col
 * */
export function calculateContainerParametersKeepRatio(curLayout: Partial<ComputedLayoutOptions>): ContainerParameters {
  let {
    containerWidth = 0,
    ratioCol = 0.1,
    ratioRow = 0.1,
    itemWidth = null,
    itemHeight = null,
    gapX = null,
    gapY = null,
  } = curLayout
  // console.log(containerWidth)
  if (containerWidth <= 0 || !isNumber(containerWidth)) {
    throw new Error(`您必须指定 containerWidth 才能生成布局, 当前值为 ${containerWidth}`)
  }
  if (!gapX && !itemWidth) {
    throw new Error('您必须指定:\ngapX，itemWidth 其中一个才能生成布局')
  }
  if (!gapY && !itemHeight) {
    throw new Error('您必须指定:\ngapY，itemHeight 其中一个才能生成布局')
  }
  //----------------------------------------------------//
  gapX = isNumber(gapX) ? Math.max(gapX, 0) : itemWidth * ratioCol
  itemWidth = isNumber(itemWidth) ? Math.max(itemWidth, 0) : gapX / ratioCol

  gapY = isNumber(gapY) ? Math.max(gapY, 0) : itemHeight * ratioRow
  itemHeight = isNumber(itemHeight) ? Math.max(itemHeight, 0) : gapY / ratioRow

  const col = (containerWidth <= itemWidth ? 1 : Math.floor((containerWidth + gapX) / (gapX + itemWidth))) || 1

  return {
    containerWidth,
    col,
    gapX,
    gapY,
    itemWidth,
    itemHeight,
    ratioCol,
    ratioRow,
  }
}

