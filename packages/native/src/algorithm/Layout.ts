import {Item} from "@/main/item/Item";
import {CustomItemPos} from "@/types";
import {ItemPos} from "@/main";

/**
 * 该类提供一些API用于快捷构建自定义布局算法
 * */
export class Layout {
  public get col(): number {
    return this._layoutMatrix?.[0]?.length || 1
  }

  public get row(): number {
    return this._layoutMatrix.length | 1
  }

  protected _layoutMatrix = [[]]   // 布局矩阵
  protected place = 0
  protected placed = 1

  /**
   * @param {Number} num  添加一行
   * */
  public addRow = (num = null) => {
    if (!num) return
    for (let i = 0; i < num; i++) {
      this._layoutMatrix.push(new Array(this.col).fill(this.place))
    }
  }
  /**
   * @param {Number} num  添加一列
   * */
  public addCol = (num = null) => {
    if (!num) return
    for (let i = 0; i < this._layoutMatrix.length; i++) {  // 遍历row
      for (let j = 0; j < num; j++) {     // 往col添加指定num个默认值
        this._layoutMatrix[i].push(this.place)
      }
    }
  }

  /**
   * 判断该pos是否超出当前的矩阵范围,通常用于静态模式
   * @return {Boolean} 超过：true  未超过：false
   * */
  public isOverFlowMatrix(pos: CustomItemPos) {
    return (pos.x + pos.w - 1) > this.col
      || (pos.y + pos.h - 1) > this.row
  }

  /**
   * 为包含static item优先排序
   * 返回一个所有static都在数组前面的新数组
   * */
  public sortStatic(items): Item[] {
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
   * 用于重设,置空布局矩阵
   * */
  public reset(col?: number, row?: number) {
    col = col || this.col
    row = row || this.row
    for (let i = 0; i < row; i++) {
      this._layoutMatrix[i] = []
      for (let j = 0; j < col; j++) {
        this._layoutMatrix[i][j] = this.place
      }
    }
  }

  /**
   * 转成适合矩阵数组操作的pos，外部pos要适配矩阵操作需要使用该函数转换
   * */
  public toLayoutPos(pos: CustomItemPos): CustomItemPos {
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
   * 传入Item列表，分析当前所有Item预添加到矩阵中的情况
   * 该函数只是并没有实际添加
   *
   * @param items 必须是Item，而不能是CustomItem 或者 ItemGeneralImpl
   * @param fn  回调
   * */
  public analysis(items: Item[], fn?: (item: Item, pos: CustomItemPos | null) => any)
    : {
    /** 允许添加的item列表 */
    success: Array<{
      /** item，此时pos可能不是最新位置 */
      item: Item,
      /** 该pos将是当前在矩阵最新位置 */
      pos: CustomItemPos,
    }>,
    /** 不允许添加的item */
    failed: Item[],

    /** 将当前成功的所有列表中的pos信息派发更新到对应的item中
     * @param handler 传入最新pos的item作为参数
     * */
    patch: (handler?: (item: Item) => void) => void
  } {
    this.reset()
    items = this.sortStatic(items)
    const success: Array<{ item: Item, pos: CustomItemPos, }> = []
    const failed = []
    items.forEach((item) => {
      // console.log(item.__ref_use__?.pos)
      const pos = new ItemPos(item.__ref_use__?.pos || item.pos)
      // const {x, y, w, h} = pos
      // console.log({x, y, w, h});
      const finalPos = this.findBlank(pos)
      finalPos
        ? success.push({item, pos: finalPos})
        : failed.push(item)
      if (typeof fn === 'function') fn(item, finalPos)
      if (finalPos) this.mark(<any>finalPos)
    })
    this.reset()
    return {
      success,
      failed,
      patch: (handler?: (item: Item) => void) => {
        success.forEach(({item, pos}) => {
          Object.assign(item.pos, pos)
          if (typeof handler === 'function') handler(item)
        })
      }
    }
  }

  /**
   * 传入一个pos，查看当前矩阵中是否存在适合该pos的空位
   * 有两种情况:
   * - 如果pos指定了x,y则查看当前矩阵该位置是否有空位
   * - 如果pos没有指定x,y，则自动寻找当前矩阵中适合w,h尺寸的空位
   *
   * @return {CustomItemPos | null} 找到空位返回一个新的pos，找不到返回null
   * */
  public findBlank(pos: CustomItemPos): CustomItemPos | null {
    const {w, h, x, y} = pos
    const isStaticPos = (
      typeof x === 'number'
      && typeof y === 'number'
      && x > 0
      && y > 0
      && x !== Infinity
      && y !== Infinity
    )
    let resPos = null
    if (isStaticPos) {  // 已经有x,y直接看是否有空位
      if (this.isBlank(pos)) resPos = {w, h, x, y}
    } else {
      this.each((curRow, curCol) => {  // 没有x,y则遍历矩阵找空位
        const tryPos = {
          w,
          h,
          x: curCol + 1,  // 加1是因为isBlank接受的是CustomItemPos,x,y最低的值为1
          y: curRow + 1,
        }
        if (this.isBlank(tryPos)) return resPos = tryPos
      })
    }
    return resPos
  }

  /**
   * 判断一个pos在当前矩阵中能否放置
   * */
  public isBlank(pos: CustomItemPos): boolean {
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
  public markList(posList: CustomItemPos[] | ItemPos[]): void {
    posList.forEach((pos) => this.mark(pos))
  }

  /**
   * 在矩阵中标记该pos占位
   * @return {CustomItemPos} 传入的pos原样返回
   * */
  public mark(pos: CustomItemPos | ItemPos): CustomItemPos {
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
   * 遍历整个矩阵 (先行后列),内部使用双层for i实现
   * @param {(curRow, curCol) => any} fn  回调函数,返回 !!res === true 将结束each循环, curRow当前行索引，curCol当前列索引
   * @param options
   * @param {number} options.startRow 从第几行开始，起始为0，默认为0
   * @param {number} options.startCol 从第几列开始，起始为0，默认为0
   * @param {number} options.endRow   到第几行结束，起始为0，默认为到当前矩阵的行数
   * @param {number} options.endCol 到第几列结束，起始为0，默认为到当前矩阵的列数
   * */
  public each(fn: (curRow, curCol) => any, options: {
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


