// noinspection JSUnusedGlobalSymbols

import {definePlugin} from "@/global";
import {EachMatrixEvent} from "@/plugins";
import {PointType} from "@/types";

/**
 * row 情况下，X轴方向作为主轴，Y轴作为交叉轴
 * */
function createRowTraverseInfo(p1: PointType, p2: PointType) {
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
function createColumnTraverseInfo(p1: PointType, p2: PointType) {
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
 * */
export const EachMatrixBehavior = definePlugin({
  each(ev: EachMatrixEvent) {
    const isColumn = ['column', 'column-reverse'].includes(ev.direction)
    const alignInfo = isColumn ? createColumnTraverseInfo(ev.point1, ev.point2) : createRowTraverseInfo(ev.point1, ev.point2)
    Label /*statement label*/ :
      for (let curRow = alignInfo.startRow; Math.abs(curRow - alignInfo.endRow - alignInfo.stepRow); curRow += alignInfo.stepRow) {
        for (let curCol = alignInfo.startCol; Math.abs(curCol - alignInfo.endCol - alignInfo.stepCol); curCol += alignInfo.stepCol) {
          const res = isColumn ? ev.next(curCol, curRow) : ev.next(curRow, curCol)
          if (res) break Label
        }
      }
  },
  flip(ev: EachMatrixEvent) {
    if (['row', 'row-reverse'].includes(ev.direction)) {
      if (ev.direction === 'row-reverse') ev.layoutManager.verticalMirrorFlip(ev.flipInfo.nextPos)
      if (ev.align === 'end') ev.layoutManager.horizontalMirrorFlip(ev.flipInfo.nextPos)
    } else if (['column', 'column-reverse'].includes(ev.direction)) {
      if (ev.direction === 'column-reverse') ev.layoutManager.horizontalMirrorFlip(ev.flipInfo.nextPos)
      if (ev.align === 'end') ev.layoutManager.verticalMirrorFlip(ev.flipInfo.nextPos)
    }
  }
})
