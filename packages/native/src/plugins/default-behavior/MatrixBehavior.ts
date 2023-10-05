// noinspection JSUnusedGlobalSymbols

import {definePlugin} from "@/global";
import {EachMiddlewareType, PointType} from "@/types";
import {MatrixEvent} from "@/plugins";

/**
 * row 情况下，X轴方向作为主轴，Y轴作为交叉轴
 * */
function createRowTraverseInfo(p1: PointType, p2: PointType): EachMiddlewareType {
  return {
    stepCol: 1,
    stepRow: 1,
    startRow: Math.min(p1[1], p2[1]),
    endRow: Math.max(p1[1], p2[1]),
    startCol: Math.min(p1[0], p2[0]),
    endCol: Math.max(p1[0], p2[0]),
  }
}

/**
 * column 情况下，Y轴方向作为主轴，X轴作为交叉轴
 * */
function createColumnTraverseInfo(p1: PointType, p2: PointType): EachMiddlewareType {
  return {
    stepCol: 1,
    stepRow: 1,
    startRow: Math.min(p1[0], p2[0]),
    endRow: Math.max(p1[0], p2[0]),
    startCol: Math.min(p1[1], p2[1]),
    endCol: Math.max(p1[1], p2[1]),
  }
}

/**
 * 原理:
 *    1.先通过某一种算法算出基础布局
 *    2.通过 horizontalMirrorFlip，verticalMirrorFlip函数翻转矩阵
 *
 * 翻转分析:
 *        row
 *        row end                horizontal
 *        Row-reverse            vertical
 *        Row-reverse end        vertical horizontal
 *        column
 *        column-reverse         horizontal
 *        column end             vertical
 *        column-reverse  end    vertical horizontal
 * */
export const MatrixBehavior = definePlugin({
  each(ev: MatrixEvent) {
    const isColumn = ['column', 'column-reverse'].includes(ev.direction)
    // @ts-ignore
    const alignInfo = isColumn ? createColumnTraverseInfo(ev.point1, ev.point2) : createRowTraverseInfo(ev.point1, ev.point2)
    Label /*statement label*/ :
      for (let curRow = alignInfo.startRow; Math.abs(curRow - alignInfo.endRow - alignInfo.stepRow); curRow += alignInfo.stepRow) {
        for (let curCol = alignInfo.startCol; Math.abs(curCol - alignInfo.endCol - alignInfo.stepCol); curCol += alignInfo.stepCol) {
          const res = isColumn ? ev.next(curCol, curRow) : ev.next(curRow, curCol)
          if (res) break Label
        }
      }
  },
  flip(ev: MatrixEvent) {
    const layoutManager = ev.container.layoutManager
    if (['row', 'row-reverse'].includes(ev.direction)) {
      if (ev.direction === 'row-reverse') layoutManager.verticalMirrorFlip(ev.flipInfo.nextPos)
      if (ev.align === 'end') layoutManager.horizontalMirrorFlip(ev.flipInfo.nextPos)
    } else if (['column', 'column-reverse'].includes(ev.direction)) {
      if (ev.direction === 'column-reverse') layoutManager.horizontalMirrorFlip(ev.flipInfo.nextPos)
      if (ev.align === 'end') layoutManager.verticalMirrorFlip(ev.flipInfo.nextPos)
    }
  },
  changeColBefore(ev: MatrixEvent) {
    // console.log('changeColBefore', ev.changeLen)
    const container = ev.container
    if (container.autoGrowCol && ev.changeLen) container.layoutManager.changeCol(ev.changeLen)
  },
  changeRowBefore(ev: MatrixEvent) {
    // console.log('changeRowBefore', ev.changeLen)
    const container = ev.container
    if (container.autoGrowRow && ev.changeLen) container.layoutManager.changeRow(ev.changeLen)
  },
  changeCol(_: MatrixEvent) {
  },
  changeRow(_: MatrixEvent) {
  }
})






