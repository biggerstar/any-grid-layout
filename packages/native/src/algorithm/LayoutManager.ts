/**
 * 布局算法,非响应式 true表示栅格中该位置已经被占用，false表示未占用
 *  @param {Object} options
 *  pos 是ItemPos类成员
 * */
import {Layout} from "@/algorithm/Layout";
import {Item, ItemPos} from "@/main";
import {CustomItemPos} from "@/types";

export class LayoutManager extends Layout {
  //-----------很有用的用户参数----------//
  isAutoRow = false
  iNameHash = ''   // 具名矩阵随机hash,如果没有这个跨容器时同iName会在isStaticBlank检测存在空位，导致Item重叠
  constructor() {
    super()
    for (let i = 0; i < 4; i++) {
      this.iNameHash = this.iNameHash + String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0))
    }
  }

  /** 简易生成一个item专属hash */
  _toINameHash(i: number) {
    return this.iNameHash + i
  }

  /** 添加item的时候如果函数不够是否row自动增长 */
  autoRow(isAutoRow: boolean = true) {
    this.isAutoRow = isAutoRow
  }


  /**
   * ItemPos转成用于算法布局计算的ItemLayout
   * */
  itemPosToItemLayout(posOption) {
    return {
      w: posOption.w,
      h: posOption.h,
      x: posOption.x,
      y: posOption.y,
      xStart: posOption.x,
      yStart: posOption.y,
      xEnd: posOption.x + posOption.w - 1,
      yEnd: posOption.y + posOption.h - 1,
      iName: this._toINameHash(posOption.i),  // iName外部传入加本类hash为做具名矩阵
    }
  }

  /**
   * 传入Item列表，分析当前所有Item预添加到矩阵中的情况
   * 该函数只是并没有实际添加
   * @param items 必须是Item，而不能是CustomItem 或者 ItemGeneralImpl
   * @param fn  回调
   *
   * */
  analysis(items: Item[], fn?: (item: Item, pos: CustomItemPos | null) => any)
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
   * @return {CustomItemPos | null} 找到空位返回一个新的pos，找不到返回null
   *
   * */
  findBlank(pos: CustomItemPos): CustomItemPos | null {
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
   * 该函数为了优化： 只判断某个item位置变化而不是所有item
   * 静态布局情况下根据x,y,w,h判断是否在布局矩阵中有空位，[该函数不适用于静态跨容器检测]
   * 如果要静态检测可以用 engine.findCoverItemFromPosition找范围内的Item，没啥太大区别
   *  @param {ItemPos} nextStaticPos 主要是决定判断结果的只有 x,y,w,h
   *  @return {Boolean} isBlank
   * */
  isStaticBlank111(nextStaticPos) {
    if (nextStaticPos === null) return false
    const {xStart, yStart, xEnd, yEnd} = this.itemPosToItemLayout(nextStaticPos)
    let isBlank = true
    const iName = this._toINameHash(nextStaticPos.i)
    const maxStartX = nextStaticPos.x + nextStaticPos.w - 1
    const maxStartY = nextStaticPos.y + nextStaticPos.h - 1
    if (maxStartX > this.col || maxStartY > this.row) return false  // isBlank

    for (let rowIndex = yStart - 1; rowIndex <= yEnd - 1; rowIndex++) {
      for (let colIndex = xStart - 1; colIndex <= xEnd - 1; colIndex++) {
        const point = this._layoutMatrix[rowIndex][colIndex]
        // 静态外部跨容器同iName会检测失效，存在该表达式作用时静态resize能允许忽略同iName下检测结果为有空格，该函数不适用于静态跨容器
        if (iName.toString() === point) continue
        if (point === this.placed) {
          isBlank = false
          break
        }
      }
    }
    return isBlank
  }


  /**
   * 为item找到当前矩阵中适合放置的位置
   * @param { Number } w 宽度
   * @param { Number } h 高度
   * @return { Object } anonymous 一个新成员可插入的 itemPos 对象，该函数是单纯查询可插入位置，不会影响布局矩阵也不会对其记录
   * */
  _findBlankPosition(w: number, h: number) {
    let xPointStart = 0
    let xPointEnd = this.col - 1
    let yPointStart = 0
    let rowData = []
    let counter = 0

    while (counter++ < this._layoutMatrix.length - 1) {  // 列数
      let foundSuccess = true
      let rowFindDone = false

      for (let j = 0; j < h; j++) { // 假设高度足够，计算整个组件占用区域是否被占用，不够addRow函数自动添加
        rowData = this._layoutMatrix[yPointStart + j]
        let rowBlankInfo = this._findRowBlank(rowData, w, xPointStart, xPointEnd)
        // console.log(rowBlankInfo);
        // console.log('w:', w, 'x:', xPointStart, 'y:', yPointStart);
        if (!rowBlankInfo.success) {
          // 该行没空间了，跳出到while层换下一行检测
          foundSuccess = false
          if (!rowFindDone) {
            j = -1
            xPointStart = xPointEnd + 1
            xPointEnd = this.col - 1
          }
          if (xPointStart > xPointEnd) {
            rowFindDone = true
            break
          }
        } else if (rowBlankInfo.success) {
          foundSuccess = true
          if (j === 0) {
            xPointStart = rowBlankInfo['xStart']
            xPointEnd = rowBlankInfo['xEnd']
          }
        }
      }
      // console.log(findSuccess)
      if (foundSuccess) {
        return {
          w, h,
          xStart: xPointStart + 1,
          yStart: yPointStart + 1,
          xEnd: xPointEnd + 1,
          yEnd: yPointStart + h - 1 + 1,
          x: xPointStart + 1,     // 和 xStart值永远相等
          y: yPointStart + 1,     // 和 yStart值永远相等
          // 四个都加1是因为数组构成的矩阵索引是0,变成普通容易理解的网格几行几列的方式需要索引都加上一
        }
      } else {
        xPointStart = 0;
        yPointStart++
      }
    }
  }

  /** 设置指定矩阵区域内的占位符，true表示矩阵中该位置已经使用，false表示该点可用
   *  传进来的对象数据理解成几行几列，比如
   *  { xStart:1 , yStart : 2, xEnd: 5, yEnd : 6  }
   *  上面这参数值可以理解成普通网格类型的第一行第二列开始,第五行第六列结束, 矩形大小为 5(xEnd-xStart) X 5(yEnd-yStart)
   *  该网格和二维数组只差在index索引的值,变成数组只需要几个索引都减一即可
   *  iName: 外部传入加上本类中hash组成为了做具名矩阵
   *  助记： 第五行其实在矩阵的索引为 4 , 自用助记,没啥大意义
   * reName: 覆盖iName的值
   * */
  _updateSeatLayout({xStart, yStart, xEnd, yEnd, iName}, reName = null) {
    // if (iName === undefined) iName = 'true'
    // let setName = reName !== null ? reName : iName.toString()
    // if (this._layoutMatrix.length < yEnd) this.addRow(yEnd - this._layoutMatrix.length + 1)
    // console.log(xStart,yStart,xEnd,yEnd,iName);
    for (let rowIndex = yStart - 1; rowIndex <= yEnd - 1; rowIndex++) {
      for (let colIndex = xStart - 1; colIndex <= xEnd - 1; colIndex++) {
        try {
          // this._layoutMatrix[rowIndex][colIndex] = setName
          this._layoutMatrix[rowIndex][colIndex] = this.placed
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
}

