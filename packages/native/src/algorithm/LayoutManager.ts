import {Item} from "@/main/item/Item";
import {
  AlignEnumType,
  AnalysisResult,
  BasePosType,
  CustomItemPos,
  DirectionEnumType,
  DirectionInfoType,
  EachOptions,
  LayoutItemsInfo,
  PointType
} from "@/types";
import {Container, ItemPos} from "@/main";
import {Finder} from "@/algorithm/interface/Finder";

/**
 * 布局算法管理器,单独工具类，不和container关联
 * 该类提供一些API用于快捷构建自定义布局算法
 * 继承该类的子类算法主要就是实现layout函数，layout函数也可以理解成算法入口
 * */
export class LayoutManager extends Finder {
  public container: Container
  public direction: DirectionEnumType
  public align: AlignEnumType
  public autoGrow: boolean

  public get col(): number {
    return this._layoutMatrix?.[0]?.length || 1
  }

  public get row(): number {
    return this._layoutMatrix.length || 1
  }

  protected _layoutMatrix = []   // 布局矩阵
  protected place = null  // Infinity   // Symbol('place')  // 空位符号，所有非0都是被占位

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
      if (this.isStaticPos(item.pos.getComputedCustomPos())) staticItems.push(item)
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
  public toMatrixPos(pos: CustomItemPos): Record<BasePosType, number> {
    const x = pos.x - 1 <= 0 ? 0 : pos.x - 1
    const y = pos.y - 1 <= 0 ? 0 : pos.y - 1
    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      console.error('[any-grid-layout] 请为x 或 y指定一个正整数', pos)
    }
    return {
      w: pos.w,
      h: pos.h,
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
   * @param {Number} num  添加一行
   * */
  public addRow = (num: number = 1) => {
    for (let i = 0; num && i < num; i++) {
      this._layoutMatrix.push(new Array(this.col).fill(this.place))
    }
  }

  /**
   * @param {Number} num  添加一列
   * */
  public addCol = (num: number = 1) => {
    for (let i = 0; i < this._layoutMatrix.length; i++) {  // 遍历row
      for (let j = 0; num && j < num; j++) {     // 往col添加指定num个默认值
        this._layoutMatrix[i].push(this.place)
      }
    }
  }

  /**
   * @param num   要拓展交叉轴end方向的行数
   * */
  public expandLine(num: number = 1): boolean {
    if (!this.autoGrow) return
    const addRow = ['row', 'row-reverse'].includes(this.direction)
    const addCol = ['column', 'column-reverse'].includes(this.direction)
    for (let i = 0; i < num; i++) {
      if (addRow) this.addRow()
      else if (addCol) this.addCol()
    }
  }

  /**
   * 寻找往交叉轴方向自动增长的合适pos
   * */
  public findGrowBlank(pos: { w: number, h: number }) {
    let cont = 20   // 最多expand添加二十行供于检测
    while (cont--) {
      const found = <boolean>this.findBlank(pos)
      if (found) return found
      this.expandLine()
      // console.log('expandLine')
    }
    return null
  }

  /**
   * 传入一个pos，查看当前矩阵中是否存在适合该pos的空位
   * @param pos
   * @return {CustomItemPos | null} 找到空位返回一个新的pos，找不到返回null
   * */
  public findBlank(pos: { w: number, h: number }): CustomItemPos | null {
    let resPos = null
    this.each((curRow, curCol) => {  // 没有x,y则遍历矩阵找空位
      const tryPos = {
        w: pos.w,
        h: pos.h,
        x: curCol + 1,  // 加1是因为isBlank接受的是CustomItemPos栅格单位,传入的x,y最低的值为1
        y: curRow + 1,
      }
      if (this.isBlank(tryPos)) return resPos = tryPos
    })
    return resPos
  }

  /**
   * 判断一个pos在当前矩阵中能否放置
   * */
  public isBlank(pos: CustomItemPos): boolean {
    const {w, h, x, y} = this.toMatrixPos(pos)
    if ((this.row - h - y) < 0 || (this.col - w - x) < 0) return false // 如果指定的x,y超出矩阵直接返回false
    let isBlank = true
    this.each((curRow, curCol) => {
      const line = this._layoutMatrix[curRow]
      if (!line || line[curCol] !== this.place) {
        isBlank = false
        return true
      }
    }, {
      point1: [x, y],
      point2: [x + w - 1, y + h - 1],
    })
    return isBlank
  }

  /**
   * 在矩阵中标记该pos占位
   * @param pos 标记区域
   * @param markSymbol 标记符号
   * @return {CustomItemPos} 传入的pos原样返回
   * */
  public mark(pos: CustomItemPos | ItemPos, markSymbol: Item): this {
    const {w, h, x, y} = this.toMatrixPos(pos)
    this.each((curRow, curCol) => {
      this._layoutMatrix[curRow][curCol] = markSymbol
    }, {
      point1: [x, y],
      point2: [x + w - 1, y + h - 1],
    })
    return this
  }

  public unmark(pos: CustomItemPos): this {
    this.mark(pos, this.place)
    return this
  }

  /**
   * 分析判断是否能让item移动到指定的`pos`位置
   * @param modifyList 要修改的列表
   *
   * 翻转分析:
   *        row
   *        row end                horizontal
   *        Row-reverse            vertical
   *        Row-reverse end        vertical horizontal
   *
   *        column
   *        column-reverse         horizontal
   *        column end             vertical
   *        column-reverse  end    vertical horizontal
   *       // TODO analysis 移除items
   * */
  public analysis(modifyList: LayoutItemsInfo = []): AnalysisResult {
    const items = this.container.items
    if (!Array.isArray(modifyList)) modifyList = []
    // modifyList.forEach(item => console.log(item.pos))
    const modifyItems = modifyList.map(({item}) => item)
    const remainItem = items.filter((member) => !modifyItems.includes(member))  // 将当前要移动的item过滤出去
    let isSuccess: any = true
    this.reset()
    let confirmedList: LayoutItemsInfo = [] // 已经确定位置的列表

    const failed = []
    const {staticItems, ordinaryItems} = this.sortStatic(remainItem)

    /*---------------------------站位所有静态item----------------------------*/
    const staticList: LayoutItemsInfo = staticItems.map(item => ({
      item,
      nextPos: {...item.pos}
    }))
    staticList.forEach((itemInfo) => {
      const {item, nextPos} = itemInfo
      this.container.bus.emit("flip", {   // （目的为了占位） 翻转静态item，占位成功后在下面统一翻转回来
        flipInfo: itemInfo,
      })
      const scs = this.isBlank(nextPos)
      if (scs) {
        this.mark(nextPos, item)
        confirmedList.push(itemInfo)
      } else {
        failed.push(item)
        isSuccess = false
      }
    })

    /*--------------------------站位所有要修改的item-------------------------*/
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
        this.container.bus.emit("flip", {    // （目的为了占位） 将要修改的item让坐标先翻转目的为了在合适方向占位(方向为row,column无需翻转)，在最后统一翻转回来
          flipInfo: modifyInfo,
        })
        if (this.isBlank(nextPos)) {
          this.mark(nextPos, item)
          confirmedList.push(modifyInfo)
        } else {
          isSuccess = false // toPos没有位置,程序执行到这里此时该位置上有静态item
          failed.push(item)
        }
      }
    }

    /*--------------------------剩余所有未执行x,y的Item----------------------------*/
    const autoLayoutSuccess: LayoutItemsInfo = []
    if (isSuccess) {
      for (let i = 0; i < ordinaryItems.length; i++) {   // 处理其他普通非静态item
        const item = ordinaryItems[i]
        const sizeWH = item.pos.getComputedCustomPos()
        const foundPos = this.findGrowBlank(sizeWH)
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

    const successList: LayoutItemsInfo = confirmedList.concat(autoLayoutSuccess)
    successList.forEach(itemInfo => {
      this.container.bus.emit("flip", {
        flipInfo: itemInfo
      })
    })
    return {
      col: this.col,
      row: this.row,
      isSuccess,
      successInfo: successList,
      get successItems() {
        return successList.map(({item}) => item)
      },
      failedItems: failed,
      patch: (handler?) => this.patch(successList, handler),
    }
  }

  /**
   * 派发位置更新到item的pos上
   * */
  public patch(itemsInfo: LayoutItemsInfo, handler?: Function) {
    /*----获取排序之后(未经过镜像)的正确item顺序，交还到container.items中用于其他操作----*/
    const sortedItems = []
    this.each((x, y) => {
      const item: Item | null = this._layoutMatrix[x][y]
      if (item && !sortedItems.includes(item)) {
        sortedItems.push(item)
      }
    })
    // console.log(sortedItems)
    this.container.items = sortedItems

    /*--------------------将最新的item位置同步到item.pos中并标记矩阵------------------*/
    this.reset()
    itemsInfo.forEach((info) => {
      const {item, nextPos} = info
      Object.assign(item.pos, nextPos)
      this.mark(nextPos, item)
      if (typeof handler === 'function') handler(item)
    })
  }

  /**
   * 垂直镜像翻转某个item或者一组item
   * */
  public verticalMirrorFlip(posList: CustomItemPos[] | CustomItemPos) {
    if (!Array.isArray(posList)) posList = [posList]
    posList.forEach(pos => {
      const x = this.col - pos.x - (pos.w - 1) + 1
      pos.x = x <= 0 ? 1 : x
    })
  }

  /**
   * 水平镜像翻转某个item或者一组item
   * */
  public horizontalMirrorFlip(posList: CustomItemPos[] | CustomItemPos) {
    if (!Array.isArray(posList)) posList = [posList]
    posList.forEach(pos => {
      const y = this.row - pos.y - (pos.h - 1) + 1
      pos.y = y <= 0 ? 1 : y
    })
  }

  /**
   * 获取当前矩阵左上角的坐标点
   * */
  public get leftTopPoint(): [0, 0] {
    return [0, 0]
  }

  /**
   * 获取当前矩阵右上角的坐标点
   * */
  public get rightTopPoint(): [number, 0] {
    return [this.col - 1, 0]
  }

  /**
   * 获取当前矩阵左下角的坐标点
   * */
  public get leftBottomPoint(): [0, number] {
    return [0, this.row - 1]
  }

  /**
   * 获取当前矩阵右下角的坐标点
   * */
  public get rightBottomPoint(): [number, number] {
    return [this.col - 1, this.row - 1]
  }

  /**
   * 参考css flex布局
   * 定义一个主轴一个交叉轴
   * direction为主轴方向
   * align为交叉轴排列的起点
   * 遍历任意方向的矩阵，point1和point2必须是对角点
   * */
  public each(
    fn: (x, y) => any,
    {
      point1 = this.leftTopPoint,
      point2 = this.rightBottomPoint,
    }?: EachOptions = {})
    : void {
    this.container.bus.emit('each', {
      point1,
      point2,
      next: (x: number, y: number) => <any>fn && fn.call(null, x, y)
    })
  }
}

//--------------------------------------------------------------------------------------------------------

/**
 * 控制变量遍历的方向规则
 * point1: [1, 10],
 * point2: [3, 2],
 * Math.abs(1-3) + 1
 * Math.abs(10-3) + 1
 *       ||
 * rect-size  [3, 9]
 * --------------------
 * Math.min(1,3)    1
 * Math.min(10,2)   2
 * Math.max(1,3)    3
 * Math.max(10,2)   10
 * */

export const LayoutDirection: Record<DirectionEnumType, (p1: PointType, p2: PointType) => DirectionInfoType> = {
  /**
   * row 情况下，X轴方向定义col作为主轴，Y轴定义成row作为交叉轴
   * */
  'row': (p1: PointType, p2: PointType): DirectionInfoType => {
    return {
      start: {
        stepCol: 1,
        stepRow: 1,
        startRow: Math.min(p1[1], p2[1]),
        endRow: Math.max(p1[1], p2[1]),
        startCol: Math.min(p1[0], p2[0]),
        endCol: Math.max(p1[0], p2[0]),
      },
      end: {
        stepCol: 1,
        stepRow: -1,
        startRow: Math.max(p1[1], p2[1]),
        endRow: Math.min(p1[1], p2[1]),
        startCol: Math.min(p1[0], p2[0]),
        endCol: Math.max(p1[0], p2[0]),
      }
    }
  },
  'row-reverse': (p1: PointType, p2: PointType): DirectionInfoType => {
    return {
      start: {
        stepCol: -1,
        stepRow: 1,
        startRow: Math.min(p1[1], p2[1]),
        endRow: Math.max(p1[1], p2[1]),
        startCol: Math.max(p1[0], p2[0]),
        endCol: Math.min(p1[0], p2[0]),
      },
      end: {
        stepCol: -1,
        stepRow: -1,
        startRow: Math.max(p1[1], p2[1]),
        endRow: Math.min(p1[1], p2[1]),
        startCol: Math.max(p1[0], p2[0]),
        endCol: Math.min(p1[0], p2[0]),
      }
    }
  },

  /**
   * column 情况下，Y轴方向定义col作为主轴，X轴定义成row作为交叉轴
   * */
  'column': (p1: PointType, p2: PointType): DirectionInfoType => {
    return {
      start: {
        stepCol: 1,
        stepRow: 1,
        startRow: Math.min(p1[0], p2[0]),
        endRow: Math.max(p1[0], p2[0]),
        startCol: Math.min(p1[1], p2[1]),
        endCol: Math.max(p1[1], p2[1]),
      },
      end: {
        stepCol: 1,
        stepRow: -1,
        startRow: Math.max(p1[0], p2[0]),
        endRow: Math.min(p1[0], p2[0]),
        startCol: Math.min(p1[1], p2[1]),
        endCol: Math.max(p1[1], p2[1]),
      }
    }
  },
  'column-reverse': (p1: PointType, p2: PointType): DirectionInfoType => {
    return {
      start: {
        stepCol: -1,
        stepRow: 1,
        startRow: Math.min(p1[0], p2[0]),
        endRow: Math.max(p1[0], p2[0]),
        startCol: Math.max(p1[1], p2[1]),
        endCol: Math.min(p1[1], p2[1]),
      },
      end: {
        stepCol: -1,
        stepRow: -1,
        startRow: Math.max(p1[0], p2[0]),
        endRow: Math.min(p1[0], p2[0]),
        startCol: Math.max(p1[1], p2[1]),
        endCol: Math.min(p1[1], p2[1]),
      }
    }
  }
}

// export const LayoutDirection: Record<DirectionInfoType, (p1, p2) => DirectionInfoType> = {
//   /**
//    * row 情况下，X轴方向定义col作为主轴，Y轴定义成row作为交叉轴
//    * */
//   'row': FlexDirection.row,
//   'row-reverse': FlexDirection.row,
//
//   /**
//    * column 情况下，Y轴方向定义col作为主轴，X轴定义成row作为交叉轴
//    * */
//   'column': FlexDirection.column,
//   'column-reverse': FlexDirection.column
// }

