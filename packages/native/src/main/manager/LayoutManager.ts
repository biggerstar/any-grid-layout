// noinspection JSUnusedGlobalSymbols

import {Item} from "@/main/item/Item";
import {
  AnalysisResult,
  BasePosType,
  CustomItem,
  CustomItemPos,
  CustomLayoutOptions,
  LayoutItemsInfo,
  LayoutManagerSetStateOptions
} from "@/types";
import {ItemPos} from "@/main";
import {isFunction, isNumber} from "is-what";
import {findDuplicates, hasDuplicateArray, isStaticPos} from "@/utils";
import {computeSmartRowAndCol} from "@/algorithm/common";
import {OnEach, OnError} from "@/plugins-src";

/**
 * 布局算法管理器,单独工具类
 * 该类提供一些API用于快捷构建自定义布局算法
 * 继承该类的子类算法主要就是实现layout函数，layout函数也可以理解成算法入口
 * */
export class LayoutManager {
  protected layoutMatrix: Array<Array<Item | null>> = []   // 布局矩阵
  protected place = null  // Infinity   // Symbol('place')  // 空位符号，所有非 undefined 都是被占位
  public limitLines: number = 100
  private items: Item[] = []
  private _col: number = 1
  public each: (ev: OnEach) => void

  public get col(): number {
    return this._col
  }

  public set col(v: number) {
    this._col = v
  }

  public get row(): number {
    return Math.max(this.layoutMatrix.length, 1)
  }

  /**
   * [最小边界范围] 当前的 items 可能占用的最小行数
   * */
  public get minimumRowRange(): number {
    const totalItemsArea = this.items.reduce((pre, cur) => pre + (cur.pos.w * cur.pos.h), 0)
    return Math.max(1, Math.ceil(totalItemsArea / this.col))
  }

  /**
   * [最大边界范围] 当前的 items 可能占用的最大行数
   * */
  public get maximumRowRange(): number {
    return Math.max(1, this.items.reduce((pre, cur) => pre + cur.pos.h, 0))   // 最大
  }

  /**
   * 验证 options 是否符合管理器规则
   * 如果出现错误， 返回错误信息
   * 如果没有错误，返回 null
   * 外部可以使用类似下面处理方式:
   * ```js
   *    const err = layoutManager.validate({})
   *    if (err){
   *      // do something
   *    }else{
   *
   *    }
   * ```
   * */
  public validate(col: number, customLayout: Partial<LayoutManagerSetStateOptions>): Partial<OnError> | null {
    return LayoutManager.validate(col, customLayout)
  }

  /**
   * 设置 options 参数指定在管理器中的的唯一状态
   * */
  public setState(options: Partial<LayoutManagerSetStateOptions>) {
    const setKeys: Array<keyof LayoutManagerSetStateOptions> = ['col', 'items', 'each']
    for (const name of setKeys) {
      if (Object.hasOwn(options, name)) {
        this[name] = options[name] as any
      }
    }
  }

  /**
   * 重置矩阵
   * 建议重置只设定 col, 不懂的话 row 交由程序自行控制
   * */
  private reset() {
    const col = this.col
    const row = Math.max(this.minimumRowRange, this.row)
    this.layoutMatrix = []
    for (let i = 0; i < row; i++) {
      this.layoutMatrix[i] = []
      for (let j = 0; j < col; j++) {
        this.layoutMatrix[i][j] = this.place
      }
    }
  }

  /**
   * 转成适合矩阵数组操作的pos，外部pos要适配矩阵操作需要使用该函数转换
   * */
  public toMatrixPos(pos: CustomItemPos): Record<BasePosType, number> {
    const x = pos.x - 1 <= 0 ? 0 : pos.x - 1
    const y = pos.y - 1 <= 0 ? 0 : pos.y - 1
    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      throw console.error('[LayoutManager.toMatrixPos] 请先为x 或 y指定一个正整数', pos)
    }
    return {
      w: pos.w,
      h: pos.h,
      x,
      y,
    }
  }

  /**
   * @param {Number|'auto'} num  添加或删除num行,设置成 'auto' 的情况下会删除col方向所有空白行,默认不传参数为 'auto'
   * */
  public addLine = (num: number = 1) => {
    if (this.row + num > this.limitLines) {
      throw new Error('超过矩阵最大行数限制, 你可以修改 limitLines 自定义最大行数.')
    }
    for (let i = 0; num && i < Math.abs(<number>num); i++) {
      this.layoutMatrix.push(new Array(this.col).fill(this.place))
    }
  }
  /**
   * 删除一整行
   * @param {number} index 删除的row index，默认最后一行
   * */
  public removeLine = (index?: number) => {
    const lastLineIndex = this.row - 1
    this.layoutMatrix.splice(isNumber(index) ? Math.min(index, lastLineIndex) : lastLineIndex, 1)
  }

  /**
   * 裁剪矩阵空白行
   * @param {number} num 指定删除行数量
   * @param opt
   * @param opt.head  是否只删除矩阵头部
   * */
  public trimLine(num: number = this.row - 1, opt: { head?: boolean } = {}) {
    for (let i = 0; num > 0 && i < num; i++) {
      let lastIndex = this.row - 1
      if (opt.head && this.hasEmptyLine(0)) {
        this.removeLine(0)
      } else if (this.hasEmptyLine(lastIndex)) {
        this.removeLine(lastIndex)
      } else {
        break
      }
    }
  }

  /**
   * 检查某一行是否无任何占位
   * */
  public hasEmptyLine(index: number) {
    const line = this.layoutMatrix[index]
    if (!Array.isArray(line)) {
      return false
    }
    return line.every(node => node === this.place)
  }

  /**
   * 判断该pos是否超出当前的矩阵范围
   * @return {Boolean} 超过：true  未超过：false
   * */
  public isOverflow(pos: CustomItemPos): boolean {
    return (pos.x + pos.w - 1) > this.col || (pos.y + pos.h - 1) > this.row
  }

  /**
   * 传入一个pos，尝试找到当前矩阵中是否存在适合该pos的空位
   * @param pos
   * @return {CustomItemPos | null} 找到空位返回一个新的pos，找不到返回null
   * */
  public findBlank(pos: CustomItemPos): CustomItemPos | null {
    let resPos = null
    if (isStaticPos(pos)) {
      return this.isBlank(pos) ? pos : null
    }
    this.eachMatrix((curRow: number, curCol: number): any => {  // 没有x,y则遍历矩阵找空位
      const tryPos = {
        w: pos.w,
        h: pos.h,
        x: curCol + 1,  // 加1是因为isBlank接受的是CustomItemPos栅格单位,传入的x,y最低的值为1
        y: curRow + 1,
      }
      if (this.isBlank(tryPos)) {
        return resPos = tryPos
      }
    })
    return resPos
  }

  /**
   * 判断一个pos在当前矩阵中能否放置
   * */
  public isBlank(pos: CustomItemPos): boolean {
    const {w, h, x, y} = this.toMatrixPos(pos)
    if ((this.row - h - y) < 0 || (this.col - w - x) < 0) { // 如果指定的x,y超出矩阵直接返回false
      return false
    }
    // console.log({w, h, x, y})
    let isBlank = true
    for (let curRow = y; curRow < y + h; curRow++) {
      for (let curCol = x; curCol < x + w; curCol++) {
        const line = this.layoutMatrix[curRow]
        if (!line || line[curCol] !== this.place) {
          isBlank = false
        }
      }
    }
    return isBlank
  }

  /**
   * 在矩阵中标记该pos占位
   * @param pos 标记区域
   * @param markSymbol 标记符号
   * @return {CustomItemPos} 传入的pos原样返回
   * */
  public mark(pos: CustomItemPos | ItemPos, markSymbol: Item): this {
    if (pos.x + pos.w - 1 > this.col || pos.y + pos.h - 1 > this.row) {
      return this
    }
    const {w, h, x, y} = this.toMatrixPos(pos)
    for (let curRow = y; curRow < y + h; curRow++) {
      for (let curCol = x; curCol < x + w; curCol++) {
        this.layoutMatrix[curRow][curCol] = markSymbol
      }
    }
    return this
  }

  public unmark(pos: CustomItemPos): this {
    if (pos.x + pos.w - 1 <= this.col && pos.y + pos.h - 1 <= this.row) {
      this.mark(pos, this.place)
    }
    return this
  }

  /**
   * 自动分析当前能在矩阵最终成功放置所有 items 的信息
   * */
  public autoAnalysis(): AnalysisResult {
    let res: AnalysisResult
    let cont: number = this.maximumRowRange  // 最大拓展行数的边界
    do {
      if (!cont--) {
        break
      }
      this.addLine()
      res = this.analysis()
      // console.log(res)
      // console.log(res.isSuccess)
    } while (!res.isSuccess)
    // console.log(res)
    return res
  }

  /**
   * 分析判断是否能让item移动到指定的`pos`位置
   * @param modifyList 要修改的列表
   * */
  public analysis(modifyList: LayoutItemsInfo = []): AnalysisResult {
    const items = this.items
    let isSuccess: any = true
    if (!Array.isArray(modifyList)) {
      modifyList = []
    }
    const modifyItems = modifyList.map(({item}) => item)
    const remainItem = items.filter((member) => !modifyItems.includes(member))  // 将当前要移动的item过滤出去
    this.reset()
    let confirmedList: LayoutItemsInfo = [] // 已经确定位置的列表
    const failed = []
    const {staticItems, ordinaryItems} = LayoutManager.sortStatic(remainItem)

    /*---------------------------站位所有包含x, y的静态item----------------------------*/
    const staticList: LayoutItemsInfo = staticItems.map(item => ({
      item,
      nextPos: {
        w: item.pos.w,
        h: item.pos.h,
        x: item.pos.x,
        y: item.pos.y,
      }
    }))
    staticList.forEach((itemInfo) => {
      const {item, nextPos} = itemInfo
      const scs = this.isBlank(nextPos)
      if (scs) {
        this.mark(nextPos, item)
        confirmedList.push(itemInfo)
      } else {
        failed.push(item)
        isSuccess = false
      }
    })

    /*--------------------------站位所有要修改的item( 包含x, y )-------------------------*/
    if (isSuccess) {
      modifyList = modifyList.map((itemInfo) => {
        const {item, nextPos} = itemInfo
        return {
          item,
          nextPos: {
            w: nextPos.w,
            h: nextPos.h,
            x: nextPos.x,
            y: nextPos.y,
          }
        }
      })
      for (const modifyInfo of modifyList) {
        const {nextPos, item} = modifyInfo
        if (this.isBlank(nextPos)) {
          this.mark(nextPos, item)
          confirmedList.push(modifyInfo)
        } else {
          isSuccess = false // toPos没有位置,程序执行到这里此时该位置上有静态item
          failed.push(item)
        }
      }
    }

    /*--------------------------剩余所有没有指定x,y 需要自动排列的Item----------------------------*/
    const autoLayoutSuccess: LayoutItemsInfo = []
    if (isSuccess) {
      for (let i = 0; i < ordinaryItems.length; i++) {   // 处理其他普通非静态item
        const item = ordinaryItems[i]
        const sizeWH = item.pos.getComputedCustomPos()
        const foundPos = this.findBlank(sizeWH)
        // console.log(foundPos)
        if (!foundPos) {
          isSuccess = false
          failed.push(item)
          continue
        }
        this.mark(<any>foundPos, item)
        autoLayoutSuccess.push({
          item: item,
          nextPos: foundPos
        })
      }
    }
    isSuccess && this.trimLine() // 如果成功了，裁剪成最小构成矩阵
    const successList: LayoutItemsInfo = confirmedList.concat(autoLayoutSuccess)
    return {
      col: this.col,
      row: this.row,
      isSuccess,
      successInfo: successList,
      failedItems: failed,
      get successItems() {
        return successList.map(({item}) => item)
      },
      get nextCustomsLayoutOptions(): Partial<CustomLayoutOptions> {
        return {
          items: successList.map(({item, nextPos}) => {
            const customKeys = Object.keys(item.pos.getComputedCustomPos())
            const nextCustomPos = {}
            for (const name of customKeys) {
              nextCustomPos[name] = nextPos[name]
            }
            return {
              ...item.customOptions,
              pos: nextCustomPos
            }
          })
        } as any
      },
      get nextLayoutOptions(): Partial<CustomLayoutOptions> {
        return {
          items: successList.map(({item, nextPos}) => ({
            ...item.customOptions,
            pos: {
              ...item.pos.getComputedCustomPos(),
              w: nextPos.w,
              h: nextPos.h,
              x: nextPos.x,
              y: nextPos.y,
            }
          }))
        }
      },
    }
  }

  /**
   * 遍历整个矩阵， 遍历顺序由外部的 each 钩子决定
   * */
  public eachMatrix(fn: (x: number, y: number) => any): void {
    let contNextCallNumber = 0
    if (isFunction(this.each)) {
      this.each({
        next: (curRow: number, curCol: number) => {
          contNextCallNumber++
          return fn && fn.call(null, curRow, curCol)
        },
        layoutManager: this
      })
    }
    if (contNextCallNumber === 0) {
      throw new Error('请先实现矩阵遍历算法 each 函数， 并通过 event.next( pointNumber1, pointNumber2 ) 进行设置')
    }
  }

  public static validate(col: number, customLayout: Partial<LayoutManagerSetStateOptions>): Partial<OnError> | null {
    if (!isNumber(col)) {
      throw new Error('[LayoutManager.validate] 您必须明确传入 col 值')
    }
    const validateOptions = {...customLayout}
    const items = validateOptions.items || []
    let errorMessage: Partial<OnError | Record<any, any>> | null = null
    const {staticItems} = LayoutManager.sortStatic(items)
    const nextItemKeys = items.map(item => item.key)
    const smartStaticSizeInfo = computeSmartRowAndCol(staticItems)
    const repeatedItems = findDuplicates(nextItemKeys).map(key => items.find(item => key === item.key))
    const exceedsContainerSizeItems = items.filter(item => item.pos.w > col)
    let overlapItems: Item[] = LayoutManager.getOverlapItems(staticItems)
    /*---------------------------------------------------------------------*/
    if (hasDuplicateArray(nextItemKeys)) {
      errorMessage = {
        type: 'ItemKeysRepeated',
        message: '传入的键值 key 重复, 请为 Item 成员明确指定一个唯一的 key 值',
        from: repeatedItems,
        errorState: validateOptions,
      }
    } else if (overlapItems.length) {
      errorMessage = {
        type: 'ItemsPositionsOverlap',
        message: '传入的 Items 中存在位置重叠.',
        from: overlapItems,
        errorState: validateOptions,
      }
    } else if (exceedsContainerSizeItems.length) {
      errorMessage = {
        type: 'ItemSizeExceedsContainerSize',
        message: 'Item 的 pos.w 尺寸超过容器的 col 尺寸.',
        from: exceedsContainerSizeItems,
        errorState: validateOptions,
      }
    } else if (smartStaticSizeInfo.smartCol > col) {
      const overflowItems = staticItems.filter(item => (item.pos.x + item.pos.w - 1) > col)
      errorMessage = {
        type: 'ItemOverflow',
        message: 'Item 成员溢出容器, 当前存在 item 的静态位置 pos.x + pos.w 的值大于容器的 col `',
        from: overflowItems,
        errorState: validateOptions,
      }
    }
    return errorMessage
  }

  /**
   * 为包含static item优先排序
   * 返回一个所有static都在数组前面的新数组
   * */
  public static sortStatic(items: Item[] | CustomItem[]): Record<'sortedItems' | 'staticItems' | 'ordinaryItems', Item[]> {
    const staticItems = []   // 静态items
    const ordinaryItems = []  // 普通items
    items.forEach((item) => {
      const pos = item.pos.getComputedCustomPos ? item.pos.getComputedCustomPos() : item.pos
      isStaticPos(pos) ? staticItems.push(item) : ordinaryItems.push(item)
    })
    return {
      sortedItems: [...staticItems, ...ordinaryItems],  // 静态优先排序后的数组
      staticItems,  // 静态items
      ordinaryItems,  // 普通没有x,y值的items
    }
  }

  /**
   * 获取矩阵中重叠的 Items成员
   * */
  public static getOverlapItems(items: Item[]): Item[] {
    const overlapItems = []
    for (const item1 of items) {
      const {x, y, w, h} = item1.pos
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item === item1) {
          continue
        }
        //------------------------要找的域----------------------------//
        const xBoundaryStart = x       // 左边界
        const yBoundaryStart = y       // 上边界
        const xBoundaryEnd = x + w - 1  //  右边界
        const yBoundaryEnd = y + h - 1  // 下边界
        //----------------------遍历item的域--------------------------//
        const xItemStart = item.pos.x          // Item左边界
        const yItemStart = item.pos.y           // Item上边界
        const xItemEnd = item.pos.x + item.pos.w - 1    // Item右边界
        const yItemEnd = item.pos.y + item.pos.h - 1    // Item下边界
        //------------------------碰撞检测---------------------------//
        if ((xItemEnd >= xBoundaryStart && xItemEnd <= xBoundaryEnd      // 左边界碰撞
            || xItemStart >= xBoundaryStart && xItemStart <= xBoundaryEnd  // X轴中间部分碰撞
            || xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd)    // 右边界碰撞
          && (yItemEnd >= yBoundaryStart && yItemEnd <= yBoundaryEnd      // 左边界碰撞
            || yItemStart >= yBoundaryStart && yItemStart <= yBoundaryEnd  // Y轴中间部分碰撞
            || yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)      // 下边界碰撞
          || (xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd     // 全包含,目标区域只被某个超大Item包裹住的情况(必须需要)
            && yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)
        ) {
          if (!overlapItems.includes(item1)) {
            overlapItems.push(item1)
          }
        }
      }
    }
    return overlapItems
  }
}

