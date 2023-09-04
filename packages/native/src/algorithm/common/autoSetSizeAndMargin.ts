import {autoComputeSizeInfo} from "@/algorithm/common";
import {MarginOrSizeDesc} from "@/types";

/**
 * 自动计算size和margin并设置到container上
 * */
export function autoSetSizeAndMargin(container, isSetConfig: boolean = false): {
  margin: MarginOrSizeDesc,
  size: MarginOrSizeDesc,
} {
  const {clientWidth: containerWidth, clientHeight: containerHeight} = container.element || {}
  if (containerWidth === 0) throw new Error("请为Container设置一个宽高")
  const curLayout = container.layout
  let {
    col = null,   //  缺省值必须为null才能触发自动计算col
    row = null,
    ratioCol = container.getConfig('ratioCol'),
    ratioRow = container.getConfig('ratioRow'),
    size = [null, null],
    margin = [null, null],
    sizeWidth,
    sizeHeight,
    marginX,
    marginY,
  } = curLayout

  margin[0] = marginX || margin[0] || marginY   // 优先获取 marginX，没定义的话再获取margin[0]，如果还没定义的话直接看marginY是否定义并获取
  margin[1] = marginY || margin[1] || marginX
  size[0] = sizeWidth || size[0] || sizeHeight
  size[1] = sizeHeight || size[1] || sizeWidth
  if (!margin[0] && !margin[1] && !size[0] && !size[1] && !col && !row) {
    throw new Error('您必须指定:\nmargin，size，col，row\n其中一个才能生成布局')
  }
//----------------------------------------------------//
//   const smartInfo = computeSmartRowAndCol(container)
//   if (!col && !margin[0] && !size[0]) col = smartInfo.smartCol
//   if (!row || responsive) row = smartInfo.smartRow
  // const nowCol = container.getConfig("col")
  // if (!responsive && !col && nowCol && nowCol !== 1) col = nowCol // 静态直接使用指定的col值,不等于1是define getter默认值就是1
  const sizeColInfo = autoComputeSizeInfo(col, containerWidth, size[0], margin[0], ratioCol)
  margin[0] = sizeColInfo.margin
  size[0] = sizeColInfo.size

  // const nowRow = container.getConfig("row")
  // if (!responsive && !row && nowRow && nowRow !== 1) row = nowRow // 静态直接使用指定的row值,不等于1是define getter默认值就是1
  const sizeRowInfo = autoComputeSizeInfo(row, containerHeight, size[1], margin[1], ratioRow)
  margin[1] = sizeRowInfo.margin
  size[1] = sizeRowInfo.size

  if (margin[0] === null) margin[0] = margin[1] || 10   // ||后面的默认值是防御性编程，在理想模型下是永远不会执行到，但是还是需要防止可能的千奇百怪的可能
  if (margin[1] === null) margin[1] = margin[0] || 10
  if (size[0] === null) size[0] = size[1] || 50
  if (size[1] === null) size[1] = size[0] || 50

  if (isSetConfig) {
    container.setConfig('margin', margin)
    container.setConfig('size', size)
  }
  return {
    margin,
    size
  }
}

