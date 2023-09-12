import {Item} from "@/main/item/Item";
import {AnalysisResult, BaseLineType, CustomItemPos} from "@/types";
import {ItemPos} from "@/main";
import {Finder} from "@/algorithm/interface/Finder";

/**
 * 布局算法管理器
 * 该类提供一些API用于快捷构建自定义布局算法
 * 继承该类的子类算法主要就是实现layout函数，layout函数也可以理解成算法入口
 * */
export class LayoutManager extends Finder {
  public get col(): number {
    return this._layoutMatrix?.[0]?.length || 1
  }

  public get row(): number {
    return this._layoutMatrix.length || 1
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
   * 某个Item在this.items列表移动到指定位置
   * @param {Item[]} items 源items
   * @param {Item} fromItem 要移动的item
   * @param {Number} toItem 目标item位置，fromItem插入toItem位置，而fromItem与其后续成员都将索引加1
   * */
  public move(items: Item[], fromItem: Item, toItem: Item) {
    if (!fromItem || !toItem) return
    let fromIndex = items.findIndex((v) => fromItem === v)
    let toIndex = items.findIndex((v) => toItem === v)
    if (fromIndex < 0 || toIndex < 0) return
    items.splice(fromIndex, 1)
    items.splice(toIndex, 0, fromItem)
  }

  /**
   * 交换在items中两个Item的位置
   * */
  public exchange(items: Item[], fromItem: Item, toItem: Item) {
    if (!fromItem || !toItem) return
    const indexA = items.findIndex((item) => fromItem === item)
    const indexB = items.findIndex((item) => toItem === item)
    if (indexA > -1 && indexB > -1) {
      items[indexA] = toItem
      items[indexB] = fromItem
    }
  }

  /**
   * 交换两个Item X轴上的pos位置，交换后两个item不会重叠
   * */
  public exchangePosX(item1: Item, item2: Item) {
    if (item1.pos.x > item2.pos.x) {
      item1.pos.x -= item2.pos.w
      item2.pos.x += item1.pos.w
    } else {
      item2.pos.x -= item1.pos.w
      item1.pos.x += item2.pos.w
    }
  }

  /**
   * 交换两个Item Y轴上的pos位置，交换后两个item不会重叠
   * */
  public exchangePosY(item1: Item, item2: Item) {
    if (item1.pos.y > item2.pos.y) {
      item1.pos.y -= item2.pos.h
      item2.pos.y += item1.pos.h
    } else {
      item2.pos.y -= item1.pos.h
      item1.pos.y += item2.pos.h
    }
  }

  /**
   * 为包含static item优先排序
   * 返回一个所有static都在数组前面的新数组
   * */
  public sortStatic(items): Record<'sortItems' | 'staticItems' | 'ordinaryItems', Item[]> {
    const staticItems = []   // 静态items
    const ordinaryItems = []  // 普通items
    items.forEach((item) => {
      if (this.isStaticPos(item.pos.getCustomPos())) staticItems.push(item)
      else ordinaryItems.push(item)
    })
    return {
      sortItems: [...staticItems, ...ordinaryItems],  // 静态优先排序后的数组
      staticItems,  // 静态items
      ordinaryItems,  // 普通没有x,y值的items
    }
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
    const x = pos.x - 1 <= 0 ? 0 : pos.x - 1
    const y = pos.y - 1 <= 0 ? 0 : pos.y - 1
    if (isNaN(x) || isNaN(y)) {
      console.error('[grid-layout] 请为x 或 y指定一个正整数', pos)
    }
    return {
      ...pos,
      x,
      y,
    }
  }

  /**
   * 判断是否是静态pos，判断的依据是是否定义了x,y
   * */
  public isStaticPos(pos: CustomItemPos): boolean {
    const {x, y} = pos
    return (
      typeof x === 'number'
      && typeof y === 'number'
      && x > 0
      && y > 0
      && isFinite(x)
      && isFinite(y)
    )
  }

  /**
   * 传入一个pos，查看当前矩阵中是否存在适合该pos的空位
   * 有两种情况:
   * - 如果pos指定了x,y则查看当前矩阵该位置是否有空位
   * - 如果pos没有指定x,y，则自动寻找当前矩阵中适合w,h尺寸的空位
   * @param pos
   * @param options
   * @return {CustomItemPos | null} 找到空位返回一个新的pos，找不到返回null
   * */
  public findBlank(
    pos: CustomItemPos,
    options: { baseline?: BaseLineType; auto?: boolean })
    : CustomItemPos | null {
    const {baseline = 'top', auto = false} = options   // 定义默认，在形参定义的话代码太长了
    const {w, h, x, y} = pos
    const isStaticPos = this.isStaticPos(pos)
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
        if (['left', 'right'].includes(baseline) && auto) {
          const offset = this.col - curCol - w - 1
          if (offset < 0) this.addCol(Math.abs(offset))
        }
        if (['top', 'bottom'].includes(baseline) && auto) {
          const offset = this.row - curRow - h - 1
          if (offset < 0) this.addRow(Math.abs(offset))
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

  public unmark(pos: CustomItemPos): this {
    this.mark(pos, this.place)
    return this
  }

  /**
   * 分析判断是否能让item移动到指定的`pos`位置
   * @param items  当前所有的items
   * @param modifyList 要修改的列表
   * @param options
   * */
  public analysis(items: Item[], modifyList: Array<{ item: Item, pos: CustomItemPos }> | null = [], options: {
    baseline?: BaseLineType,
    auto?: boolean
  } = {}): AnalysisResult {
    if (!Array.isArray(modifyList)) modifyList = []
    const modifyItems = modifyList.map(({item}) => item)
    const remainItem = items.filter((member) => !modifyItems.includes(member))  // 将当前要移动的item过滤出去
    let isSuccess: any = true
    this.reset()
    const success: Array<{
      item: Item,
      pos: CustomItemPos,
    }> = []
    const failed = []
    const {staticItems, ordinaryItems} = this.sortStatic(remainItem)
    /*---------------------------站位所有静态item-------------------------*/
    staticItems.forEach(item => {
      const pos = item.pos.getCustomPos()
      const scs = this.isBlank(pos)
      if (scs) {
        this.mark(pos)
        success.push({item: item, pos})
      } else {
        failed.push(item)
        isSuccess = false
      }
    })

    //---------------------------------------------------------------------
    /*--------------------------站位所有要修改的item-------------------------*/
    for (const modifyItem of modifyList) {
      const {pos, item} = modifyItem
      if (this.isBlank(pos)) {
        this.mark(pos)
        success.push(modifyItem)
      } else {
        isSuccess = false // toPos没有位置,程序执行到这里此时该位置上有静态item
        failed.push(item)
      }
    }
    /*--------------------------剩余所有未执行x,y的Item----------------------------*/
    for (let i = 0; i < ordinaryItems.length; i++) {   // 处理其他普通非静态item
      const item = ordinaryItems[i]
      const sizeXY = item.pos.getCustomPos()
      const foundPos = this.findBlank(sizeXY, options)
      if (!foundPos) {
        isSuccess = false
        failed.push(item)
        continue
      }
      this.mark(<any>foundPos)
      success.push({
        item: item,
        pos: foundPos
      })
    }
    return {
      col: this.col,
      row: this.row,
      isSuccess,
      successInfo: success,
      get successItems() {
        return success.map(({item}) => item)
      },
      failedItems: failed,
      patch: (handler?) => this.patch(success, handler)
    }
  }

  /**
   * 派发位置更新到item的pos上
   * */
  public patch(items: { item: Item, pos: CustomItemPos }[], handler?: Function) {
    items.forEach(({item, pos}) => {
      Object.assign(item.pos, pos)
      if (typeof handler === 'function') handler(item)
    })
  }

  /**
   * 在矩阵中标记某个数组的所有pos占位
   * */
  public markList(posList: CustomItemPos[] | ItemPos[]): void {
    posList.forEach((pos) => this.mark(pos))
  }

  /**
   * 在矩阵中标记该pos占位
   * @param pos 标记区域
   * @param markSymbol 标记符号
   * @return {CustomItemPos} 传入的pos原样返回
   * */
  public mark(pos: CustomItemPos | ItemPos, markSymbol?: typeof this.place | typeof this.placed): this {
    const {w, h, x, y} = this.toLayoutPos(pos)
    this.each((curRow, curCol) => {
      this._layoutMatrix[curRow][curCol] = markSymbol !== void 0 ? markSymbol : this.placed
    }, {
      startCol: x,
      startRow: y,
      endCol: x + w,
      endRow: y + h,
    })
    return this
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
    rowLabel /*statement label*/ :
      for (let curRow = startRow; curRow < endRow; curRow++) {
        for (let curCol = startCol; curCol < endCol; curCol++) {
          const res = fn(curRow, curCol)
          if (res) break rowLabel
        }
      }
  }
}


