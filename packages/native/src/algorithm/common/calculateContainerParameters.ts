import {autoComputeSizeInfo} from "@/algorithm/common";
import {Container} from "@/main";

/**
 * 自动计算 size 和 gap  和 某方向的 行列数(col | row)
 * */
export function calculateContainerParameters(container: Container): {
  gapX: number,
  gapY: number,
  itemWidth: number,
  itemHeight: number,
  col: number,
  row: number,
} {
  const {clientWidth: containerWidth, clientHeight: containerHeight} = container.element || {}
  // console.log(containerWidth,containerHeight)
  if (containerWidth === 0) {
    throw new Error("请为Container设置一个宽高")
  }
  const curLayout = container.layout
  let {
    col = null,   //  缺省值必须为null才能触发自动计算col
    row = null,
    ratioCol = container.getConfig('ratioCol'),
    ratioRow = container.getConfig('ratioRow'),
    itemWidth,
    itemHeight,
    gapX,
    gapY,
  } = curLayout

  if (!gapX && !itemWidth && !col) {
    throw new Error('您必须指定:\ngapX，itemWidth, col\n其中一个才能生成布局')
  }
  if (!gapY && !itemHeight && !row) {
    throw new Error('您必须指定:\ngapY，itemHeight，row\n其中一个才能生成布局')
  }
  //----------------------------------------------------//
  const sizeColInfo = autoComputeSizeInfo(col, containerWidth, itemWidth, gapX, ratioCol)
  gapX = sizeColInfo.gap
  itemWidth = sizeColInfo.size
  col = sizeColInfo.direction

  const sizeRowInfo = autoComputeSizeInfo(row, containerHeight, itemHeight, gapY, ratioRow)
  gapY = sizeRowInfo.gap
  itemHeight = sizeRowInfo.size
  row = sizeRowInfo.direction

  return {
    gapX,
    gapY,
    itemWidth,
    itemHeight,
    col,
    row,
  }
}

