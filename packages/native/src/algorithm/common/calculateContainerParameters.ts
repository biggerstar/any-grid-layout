import {autoComputeSizeInfo} from "@/algorithm/common";
import {ComputedLayoutOptions, ContainerParameters} from "@/types";

/**
 * 自动计算 size 和 gap  和 某方向的 行列数(col | row)
 * */
export function calculateContainerParameters(curLayout: Partial<ComputedLayoutOptions>): ContainerParameters {
  let {
    containerWidth = 0,
    containerHeight = 0,
    col = null,   //  缺省值必须为null才能触发自动计算col
    row = null,
    ratioCol = 0.1,
    ratioRow = 0.1,
    itemWidth = null,
    itemHeight = null,
    gapX = null,
    gapY = null,
  } = curLayout
  // console.log(containerWidth,containerHeight)
  if (containerWidth === 0) {
    throw new Error("请为Container设置一个宽度")
  }
  if (!gapX && !itemWidth && !col) {
    throw new Error('您必须指定:\ngapX，itemWidth, col\n其中一个才能生成布局')
  }
  if (!gapY && !itemHeight && !row) {
    throw new Error('您必须指定:\ngapY，itemHeight，row\n其中一个才能生成布局')
  }
  //----------------------------------------------------//
  const colInfo = autoComputeSizeInfo(col, containerWidth, itemWidth, gapX, ratioCol)
  gapX = colInfo.gap
  itemWidth = colInfo.size
  col = colInfo.direction

  const rowInfo = autoComputeSizeInfo(row, containerHeight, itemHeight, gapY, ratioRow)
  gapY = rowInfo.gap
  itemHeight = rowInfo.size
  row = rowInfo.direction

  return {
    gapX,
    gapY,
    itemWidth,
    itemHeight,
    col,
    row,
  }
}

