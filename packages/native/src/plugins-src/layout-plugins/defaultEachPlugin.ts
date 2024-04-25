import {definePlugin} from "@/global";
import {OnEach} from "@/plugins-src";

/**
 * 默认用于支持遍历矩阵顺序的插件
 * */
export const DefaultEachPlugin = definePlugin({
  each(ev: OnEach): any {
    const {next, layoutManager} = ev
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
