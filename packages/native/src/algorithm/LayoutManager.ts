/**
 * 布局算法,非响应式 true表示栅格中该位置已经被占用，false表示未占用
 *  @param {Object} options
 *  pos 是ItemPos类成员
 * */
import {Layout} from "@/algorithm/Layout";
import {Item, ItemPos} from "@/main";
import {CustomItem} from "@/types";

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


  /** 用于重设清空矩阵信息和当前组件们的布局信息  */
  reset() {
    this._layoutMatrix = [[]]
  }

  /** ItemPos转用于算法布局计算的ItemLayout */
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


  analysis(items: Item[] | CustomItem[]) {
    items = this.sortStatic(items)
    console.log(items)

    items.forEach((item) => {
      const realPos = this.findBlank(<ItemPos>item.pos, true)
      console.log(realPos)

    })


    return ''
  }

  addItem(itemLayout) {
    this._updateSeatLayout(itemLayout)
  }

  /**
   * 找到当前布局矩阵中的空位
   * @param posOption {ItemPos} XXX
   * @param auto {boolean} 是否自动排列
   * @return ItemPos | null 布局对象
   * */
  findBlank = (posOption: ItemPos, auto: boolean = false): ItemPos | null => {
    if (posOption.w <= 0 || posOption.h <= 0) throw new Error(' w 或 h 是一个正整数')
    let findItemLayout
    // console.log(posOption);
    // 如果是静态布局直接赋值后占位，外部最好所有的static成员先加载后再加载非静态成员,这样不会照成重叠
    findItemLayout = this._findBlankPosition(posOption.w, posOption.h)
    if (!findItemLayout) return null
    if (posOption.i) findItemLayout.iName = this._toINameHash(posOption.i)

    if (auto) {
    } else {
      if (this.isStaticBlank(posOption)) {
        findItemLayout = this.itemPosToItemLayout(posOption)
        return findItemLayout
      } else return null
    }
    // console.log(findItemLayout);
    if (!auto && this.isOverFlowMatrix(posOption)) return null   // 静态模式下超过边界返回null
    else return findItemLayout
  }


  /** 静态布局情况下根据x,y,w,h判断是否在布局矩阵中有空位，[该函数不适用于静态跨容器检测]
   * 如果要静态检测可以用 engine.findCoverItemFromPosition找范围内的Item，没啥太大区别
   *  @param {ItemPos} nextStaticPos 主要是决定判断结果的只有 x,y,w,h
   *  @return {Boolean} isBlank
   * */
  isStaticBlank(nextStaticPos) {
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
        if (point !== false) {
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
    let rowPointData = []
    let counter = 0
    while (counter++ < 500) {  // counter 加一次索引行数加1,500表示最大500行,正常这够用了吧？
      if (this._layoutMatrix.length < (h + yPointStart)) {
        if (this.isAutoRow) {
          this.addRow((h + yPointStart) - this._layoutMatrix.length)  // 缺几行添加几行,响应式模式用到静态布局没用到
        }
      }
      let findSuccess = true
      let rowFindDone = false

      for (let j = 0; j < h; j++) { // 假设高度足够，计算整个组件占用区域是否被占用，不够addRow函数自动添加
        // if (xPointEnd === 0 && j === 0) xPointEnd = rowPointData.length
        rowPointData = this._layoutMatrix[yPointStart + j]
        let rowBlankInfo = this._findRowBlank(rowPointData, w, xPointStart, xPointEnd)
        // console.log(rowBlankInfo);
        // console.log('w:', w, 'x:', xPointStart, 'y:', yPointStart);
        // console.log('rowBlankInfo', rowBlankInfo);

        if (!rowBlankInfo.success) {
          // console.log('失败了');  // 该行没空间了，跳出到while层换下一行检测
          findSuccess = false
          if (!rowFindDone) {
            j = -1
            xPointStart = xPointEnd + 1
            xPointEnd = this.col - 1
          }
          // console.log(xPointStart,xPointEnd)
          if (xPointStart > xPointEnd) {
            rowFindDone = true
            break
          }

        } else if (rowBlankInfo.success) {
          // console.log(yPointStart,'成功',rowBlankInfo)
          findSuccess = true
          if (j === 0) {
            // console.log('----------------------------');
            // console.log('第一次');  //  第一层找到空白行xIndex了,后面检测的h根据xStart，和 xEnd = xStart + w 来形成该item计划所处矩阵
            xPointStart = rowBlankInfo['xStart']
            xPointEnd = rowBlankInfo['xEnd']
          }
        }
      }
      // console.log(findSuccess)
      if (findSuccess) {
        const res = {
          w, h,
          xStart: xPointStart + 1,
          yStart: yPointStart + 1,
          xEnd: xPointEnd + 1,
          yEnd: yPointStart + h - 1 + 1,
          x: xPointStart + 1,     // 和 xStart值永远相等
          y: yPointStart + 1,     // 和 yStart值永远相等
          // 四个都加1是因为数组构成的矩阵索引是0,变成普通容易理解的网格几行几列的方式需要索引都加上一
        }
        let a = 1
        // console.log(res);
        return res
      } else {
        xPointStart = 0;
        xPointEnd = this.col - 1
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
    if (iName === undefined) iName = 'true'
    let setName = reName !== null ? reName : iName.toString()
    // if (this._layoutMatrix.length < yEnd) this.addRow(yEnd - this._layoutMatrix.length + 1)
    // console.log(xStart,yStart,xEnd,yEnd,iName);
    for (let rowIndex = yStart - 1; rowIndex <= yEnd - 1; rowIndex++) {
      for (let colIndex = xStart - 1; colIndex <= xEnd - 1; colIndex++) {
        try {
          this._layoutMatrix[rowIndex][colIndex] = setName
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
}

