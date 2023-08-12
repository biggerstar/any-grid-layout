import {Item} from "@/main/item/Item";
import {CustomItemPos} from "@/types";
import {ItemPos} from "@/main";

export class Layout {
  get col(): number {
    return this._layoutMatrix?.[0]?.length || 1
  }

  get row(): number {
    return this._layoutMatrix.length | 1
  }

  _layoutMatrix = [[]]   // 布局矩阵

  place = 0
  placed = 1

  /**
   * @param {Number} num  添加一行
   * */
  addRow = (num = null) => {
    if (!num) return
    for (let i = 0; i < num; i++) {
      this._layoutMatrix.push(new Array(this.col).fill(this.place))
    }
  }
  /**
   * @param {Number} num  添加一列
   * */
  addCol = (num = null) => {
    if (!num) return
    for (let i = 0; i < this._layoutMatrix.length; i++) {  // 遍历row
      for (let j = 0; j < num; j++) {     // 往col添加指定num个默认值
        this._layoutMatrix[i].push(this.place)
      }
    }
  }


  /**
   * 删除空白的最后一行,若已被占用不进行删除
   * TODO 弃用
   * */
  removeOneRow = () => {
    if (this._layoutMatrix.length === 0) {
      console.log('栅格内行数已经为空')
      return false
    }
    if (!this._layoutMatrix[this._layoutMatrix.length - 1].includes(this.placed)) {
      this._layoutMatrix.pop()
      return true
    } else {
      console.log('计划删除的栅格内存在组件,未删除包含组件的栅格')
      return false
    }
  }

  /**
   * 删除尾部(下方)所有空白的行
   * */
  removeBlankRow = (num) => {
    for (let i = 0; i < num; i++) {
      if (!this.removeOneRow()) return
    }
  }

  /**
   * 判断该pos是否超出当前的矩阵范围,通常用于静态模式
   * @return {Boolean} 超过：true  未超过：false
   * */
  isOverFlowMatrix(nextStaticPos) {
    return (nextStaticPos.x + nextStaticPos.w - 1) > this.col
      || (nextStaticPos.y + nextStaticPos.h - 1) > this.row
  }

  /**
   * 以w宽度为准，找到该行可供item放置的空白位置
   * 如果没有空白位置，则返回失败对象
   *
   * @param rowData 某行的当前矩阵中占位的数据
   * @param w 打算占位的宽度
   * @param x 执行x起点
   * */
  _findRowBlank(rowData = [], w, x, xEnd) {
    let blankCount = 0
    if (w <= 0) new Error('宽度不能为0或负数，请使用正整数')
    for (let i = x; i <= xEnd; i++) { //  因为块矩阵start和end指向同个索引所以取值要加一偏移计算
      if (rowData[i] !== this.place) blankCount = 0  // 如果该行该位置被占用清空预放置行的空格计数
      else if ((rowData[i] === this.place)) blankCount++
      if (blankCount === w) {  //  如果该行能放置符合w的新组件
        return {
          success: true,
          xStart: i + 1 - w,   // 加1是起始索引假设1-6, w为2 ，所占空间只有index0,index1
          xEnd: i,
          xWidth: w
        }
      }
    }
    return {success: false}
  }

  /** 返回一个新的重新排序为包含static的Item的数组,优先排在前面 */
  sortStatic(items): Item[] {
    const staticItems = []
    const ordinaryItems = []
    items.forEach((item) => {
      if (item.static) {
        staticItems.push(item)
      } else ordinaryItems.push(item)
    })
    // console.log(items);
    return staticItems.concat(ordinaryItems)
  }

  /**
   * 用于重设布局矩阵
   * */
  reset(col?: number, row?: number) {
    col = col || this.col
    row = row || this.row
    for (let i = 0; i < row; i++) {
      this._layoutMatrix[i] = []
      for (let j = 0; j < col; j++) {
        this._layoutMatrix[i][j] = this.place
      }
    }
  }


  /** 转成适合矩阵数组操作的pos，外部pos要适配矩阵操作需要使用该函数转换 */
  toLayoutPos(pos: CustomItemPos): CustomItemPos {
    const x = pos.x - 1
    const y = pos.y - 1
    if (isNaN(x) || isNaN(y)) console.error('[grid-layout] 请为x 或 y指定一个正整数', pos)
    return {
      ...pos,
      x,
      y
    }
  }

  /**
   * 判断一个pos在当前矩阵中能否放置
   * */
  isBlank(pos: CustomItemPos): boolean {
    const {w, h, x, y} = this.toLayoutPos(pos)
    if ((this.row - h - y) < 0 || (this.col - w - x) < 0) return false // 如果指定的x,y超出矩阵直接返回false
    let isBlank = true
    this.each((curRow, curCol) => {
      if (this._layoutMatrix[curRow][curCol] === this.placed) {
        isBlank = false
        return true
      }
    }, {
      startCol: x,
      startRow: y,
      endCol: x + w,
      endRow: y + h,
    })
    return isBlank
  }


  /**
   * 在矩阵中标记某个数组的所有pos占位
   * */
  markList(posList: CustomItemPos[] | ItemPos[]): void {
    posList.forEach((pos) => this.mark(pos))
  }

  /**
   * 在矩阵中标记该pos占位
   * @return {CustomItemPos} 传入的pos原样返回
   * */
  mark(pos: CustomItemPos | ItemPos): CustomItemPos {
    const {w, h, x, y} = this.toLayoutPos(pos)
    this.each((curRow, curCol) => {
      // console.log(curRow, curCol,this._layoutMatrix[curRow][curCol])
      this._layoutMatrix[curRow][curCol] = this.placed
    }, {
      startCol: x,
      startRow: y,
      endCol: x + w,
      endRow: y + h,
    })
    return pos
  }

  /**
   * 遍历整个矩阵 (先行后列)
   * @param {(curRow, curCol) => any} fn  回调函数,返回 !!res === true 将结束each循环, curRow当前行索引，curCol当前列索引
   * @param options
   * @param {number} options.startRow 从第几行开始，起始为0，默认为0
   * @param {number} options.startCol 从第几列开始，起始为0，默认为0
   * @param {number} options.endRow   到第几行结束，起始为0，默认为到当前矩阵的行数
   * @param {number} options.endCol 到第几列结束，起始为0，默认为到当前矩阵的列数
   * */
  each(fn: (curRow, curCol) => any, options: {
    startRow?: number
    startCol?: number
    endRow?: number
    endCol?: number
  } = {}): void {
    const {
      startRow = 0,
      startCol = 0,
      endRow = this.row,
      endCol = this.col
    } = options
    // console.log(endRow, endCol)
    rowLabel /*statement label*/ :
      for (let curRow = startRow; curRow < endRow; curRow++) {
        for (let curCol = startCol; curCol < endCol; curCol++) {
          const res = fn(curRow, curCol)
          if (res) break rowLabel
        }
      }
  }

}


