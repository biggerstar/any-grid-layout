import {definePlugin} from "@/global";
import {LayoutManager} from "@/main";

/**
 * 默认用于支持遍历矩阵顺序的插件
 * */
export const DefaultEachPlugin = definePlugin({
  each(next: Function, layoutManager: LayoutManager) {
    let {col, row} = layoutManager
    Label /*statement label*/ :
      for (let curRow = 0; curRow < row; curRow++) {
        for (let curCol = 0; curCol < col; curCol++) {
          const isBreak = next(curRow, curCol)
          if (isBreak) {
            break Label
          }
        }
      }
  }
})
