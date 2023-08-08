/** 布局算法,非响应式 true表示栅格中该位置已经被占用，false表示未占用
 *  @param {Object} option  同学，你用一个对象放东西就行了，自己看类成员！！
 *  pos 是ItemPos类成员
 * */

export class LayoutManager {
  //-----------调试用-----------//
  isDebugger = false    //  在运行的最后位置加上 debugger ，能直接打印出item的添加路径过程
  DebuggerTemp = {}
  count = 0
  //-----------私有参数----------//
  _mode = 'grid' // grid || block
  _layoutMatrix = []   // 布局矩阵
  //-----------不痛不痒参数----------//
  layoutPositions = []   //  栅格ITEM成员的详细信息数组,暂时没啥用,就存着玩玩
  //-----------很有用的用户参数----------//
  // minRow = null
  col = null // 列数，必须，实现自适应布局需在外层二次封装动态col的值
  minRow = null
  maxRow = null
  row = null  //  行数,非必须
  isAutoRow = false
  iNameHash = ''   // 具名矩阵随机hash,如果没有这个跨容器时同iName会在isStaticBlank检测存在空位，导致Item重叠

  constructor() {
    // if (typeof option.col !== 'number') new Error('col是必要参数且为正整数')
    // this.minRow = option.minRow ? option.minRow : 1
    // this.row = option.row ? option.row : this.minRow
    for (let i = 0; i < 4; i++) {
      this.iNameHash = this.iNameHash + String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0))
    }
  }

  /** 获取当前成员数量*/
  len() {
    return this.layoutPositions.length
  }

  setColNum(col) {
    this.col = col
  }

  setRowNum(row) {
    this.row = row
  }

  toINameHash(i) {
    return this.iNameHash + i
  }

  autoRow(isAutoRow = true) {
    this.isAutoRow = isAutoRow
  }

  /**
   * @param {Number} num  添加的行数
   * */
  addRow = (num = null) => {
    if (!num) return
    // console.log(this.col);
    for (let i = 0; i < num; i++) {
      this._layoutMatrix.push(new Array(this.col).fill(false))
    }
    // console.log(this.row);
    this.row = this._layoutMatrix.length
    // console.log(this._layoutMatrix);
  }

  /**
   * @param {Number} num  添加的行数
   * */
  addCol = (num = null) => {
    if (!num) return
    // console.log(this.col);
    for (let i = 0; i < this._layoutMatrix.length; i++) {  // 遍历row
      for (let j = 0; j < num; j++) {     // 往col添加指定num个默认值
        this._layoutMatrix[i].push(false)
      }
    }
    // console.log(this.row);
    if (this._layoutMatrix.length > 0) {
      this.col = this._layoutMatrix[0].length
    }
    // console.log(this._layoutMatrix);
  }

  /** 删除空白的最后一行,若已被占用不进行删除 TODO 弃用 */
  removeOneRow = () => {
    if (this._layoutMatrix.length === 0) {
      console.log('栅格内行数已经为空')
      return false
    }
    if (!this._layoutMatrix[this._layoutMatrix.length - 1].includes(true)) {
      this._layoutMatrix.pop()
      this.row = this._layoutMatrix.length
      return true
    } else {
      console.log('计划删除的栅格内存在组件,未删除包含组件的栅格')
      return false
    }
  }

  /** 删除尾部(下方)所有空白的行 */
  removeBlankRow = (num) => {
    for (let i = 0; i < num; i++) {
      if (!this.removeOneRow()) return
    }
  }

  /** 用于重设清空矩阵信息和当前组件们的布局信息  */
  reset() {
    this._layoutMatrix = []
    this.layoutPositions = []
  }

  /** 传入一个ItemPos，根据新的w和h判断是否  */
  isOverlap(pos) {

  }


  /** 计算当前最大值row情况下补充满整个矩阵空处需要再增加几行 */
  computedNeedRow(items) {
    // const boundary = this.computedColAndRows(items)
    // console.log(boundary.row,this._layoutMatrix.length);
    // return boundary.row - this._layoutMatrix.length > 0 ? boundary.row - this._layoutMatrix.length : 0
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
      iName: this.toINameHash(posOption.i),  // iName外部传入加本类hash为做具名矩阵
    }
  }


  addItem(itemLayout) {
    this._updateSeatLayout(itemLayout)
    // this.layoutPositions.push(itemLayout)

    ///////////////////////////////////////////////////////////
    //  调试算法入队过程
    // this.isDebugger = true
    if (this.isDebugger) {
      const colorLayoutMatrix = this._layoutMatrix.map(row => {
        return row.map(flag => flag ? '●' : '○')
      })
      console.log(`[${this.count++}]`, itemLayout);
      console.log('       ', colorLayoutMatrix[0].map((val, colIndex) => colIndex).join('    '));
      colorLayoutMatrix.forEach((val, index) => {
        console.log(' ' + index, ':', val);
      })
      console.log('---------------------------------------------');
    }
    ///////////////////////////////////////////////////////////
  }

  /** 根据auto控制找响应式布局还是静态布局
   *  @param posOption {ItemPos} XXX
   *  @param auto {Boolean} 是否自动排列
   *  @return findItemLayout 布局对象
   *  */
  findItem = (posOption, auto = false) => {
    if (posOption.w <= 0 || posOption.h <= 0) throw new Error(' w 或 h 是一个正整数')
    let findItemLayout
    // console.log(posOption);
    // 如果是静态布局直接赋值后占位，外部最好所有的static成员先加载后再加载非静态成员,这样不会照成重叠
    if (!!auto) {
      findItemLayout = this._findBlankPosition(posOption.w, posOption.h)

      if (findItemLayout === undefined) return null
      if (posOption.i !== undefined) findItemLayout.iName = this.toINameHash(posOption.i)
      findItemLayout.row = this._layoutMatrix.length  // 这个row是最新该Item添加进去占用后矩阵的行数
    } else {
      // for (let i = 0; i < this._layoutMatrix.length; i++) {
      //     console.log(this._layoutMatrix[i]);
      // }
      //     console.log(posOption);

      if (this.isStaticBlank(posOption)) {
        findItemLayout = this.itemPosToItemLayout(posOption)
        return findItemLayout
      } else return null
    }
    // console.log(findItemLayout);
    // console.log(this.isOverFlowMatrix(posOption));
    if (auto === false && this.isOverFlowMatrix(posOption)) return null   // 静态模式下超过边界返回null
    else return findItemLayout
    // if (this.maxRow && this.maxRow < (findItemLayout.y + findItemLayout.h - 1)) {
    //     console.error(posOption, '超出maxRow设定范围,若直接使用裸算请在外围检测保持传入的posOption对应的h+y不超过maxRow')
    //     return
    // }
  }

  /** 判断该pos是否超出当前的矩阵范围,通常用于静态模式
   * @return {Boolean} 超过：true  未超过：false
   * */
  isOverFlowMatrix(nextStaticPos) {
    // console.log((nextStaticPos.x + nextStaticPos.w -1) > this.col
    //     || (nextStaticPos.y + nextStaticPos.h -1) > this.row);
    // console.log(nextStaticPos);
    return (nextStaticPos.x + nextStaticPos.w - 1) > this.col
      || (nextStaticPos.y + nextStaticPos.h - 1) > this.row
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
    const iName = this.toINameHash(nextStaticPos.i)
    const maxStartX = nextStaticPos.x + nextStaticPos.w - 1
    const maxStartY = nextStaticPos.y + nextStaticPos.h - 1
    if (maxStartX > this.col || maxStartY > this.row) return false  // isBlank
    // const isDebugger = false
    // if (isDebugger) {
    //     for (let i = 0; i < this._layoutMatrix.length; i++) {
    //         console.log(this._layoutMatrix[i]);
    //     }
    //     console.log('-----------------------------------------');
    // }
    // for (let i = 0; i < this._layoutMatrix.length; i++) {
    //     console.log(this._layoutMatrix[i]);
    // }
    // console.log('--------------------------------------------');

    for (let rowIndex = yStart - 1; rowIndex <= yEnd - 1; rowIndex++) {
      for (let colIndex = xStart - 1; colIndex <= xEnd - 1; colIndex++) {
        const point = this._layoutMatrix[rowIndex][colIndex]
        // 静态外部跨容器同iName会检测失效，存在该表达式作用时静态resize能允许忽略同iName下检测结果为有空格，该函数不适用于静态跨容器
        if (iName.toString() === point) continue
        if (point !== false) { // 等于true是开了debugger情况，false是默认占位值
          isBlank = false
          break
        }
      }
    }
    return isBlank
  }


  /** 判断该行是否包含 w宽度的空白位置供组件放置  */
  _findRowBlank(rowData = [], w, xPointStart, xPointEnd) {
    let rowBlankCount = 0
    if (w <= 0) new Error('宽度不能为0或负数，请使用正整数')
    for (let i = xPointStart; i <= xPointEnd; i++) { //  因为块矩阵start和end指向同个索引所以取值要加一偏移计算
      // if ((rowData.length - i + rowBlankCount) < w) break   //  后面位置已经不够组件在该行放置，此时需转下一行计算
      if (rowData[i] !== false) rowBlankCount = 0  // 如果该行该位置被占用清空预放置行的空格计数
      else if ((rowData[i] === false)) rowBlankCount++
      // if (i === 1 && this.DebuggerTemp.index === 16 && this.DebuggerTemp.yPointStart === 4) debugger

      if (rowBlankCount === w) {  //  如果该行能放置符合w的新组件
        return {
          success: true,
          xStart: i + 1 - w,   // 加1是起始索引假设1-6, w为2 ，所占空间只有index0,index1
          // xStart: i + 1 - w ,
          xEnd: i,
          xWidth: w
        }
      }
    }
    return {success: false}
  }

  /** 找到新数组合适位置空间的 itemPos
   * @param { Number } w 宽度
   * @param { Number } h 高度
   * @return { Object } anonymous 一个新成员可插入的 itemPos 对象，该函数是单纯查询可插入位置，不会影响布局矩阵也不会对其记录
   * */
  _findBlankPosition(w, h) {  //params { w,h }
    let xPointStart = 0
    let xPointEnd = this.col - 1
    let yPointStart = 0
    let rowPointData = []

    let counter = 0
    while (counter++ < 500) {  // counter 加一次索引行数加1,500表示最大500行,正常这够用了吧？
      if (this._layoutMatrix.length < (h + yPointStart)) {
        // console.log(this.row,this.isAutoRow);
        if (this.isAutoRow) {
          this.addRow((h + yPointStart) - this._layoutMatrix.length)  // 缺几行添加几行,不可删，响应式模式用到静态布局没用到
        }
      }
      let findSuccess = true
      let rowFindDone = false

      if (!this.col) {
        break
        // throw new Error('未找到经过引擎处理过后的col，可能是少传参数或者代码执行顺序有误，倘若这样，不用问，这就是bug')
      }
      for (let j = 0; j < h; j++) { // 假设高度足够，计算整个组件占用区域是否被占用，不够addRow函数自动添加
        // if (xPointEnd === 0 && j === 0) xPointEnd = rowPointData.length
        rowPointData = this._layoutMatrix[yPointStart + j]
        this.DebuggerTemp.yPointStart = yPointStart
        let rowBlankInfo = this._findRowBlank(rowPointData, w, xPointStart, xPointEnd)
        // console.log(rowBlankInfo);
        // console.log('w:', w, 'x:', xPointStart, 'y:', yPointStart);
        // console.log('rowBlankInfo', rowBlankInfo);
        // if (j === 0){
        //     rowBlankInfo = this._findRowBlank(rowPointData, w, 0,rowPointData.length)
        // }else {
        //     rowBlankInfo =
        // }

        if (rowBlankInfo.success === false) {
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

        } else if (rowBlankInfo.success === true) {
          // console.log(yPointStart,'成功',rowBlankInfo)
          findSuccess = true
          if (j === 0) {
            // console.log('----------------------------');
            // console.log('第一次');  //  第一层找到空白行xIndex了,后面检测的h根据xStart，和 xEnd = xStart + w 来形成该item计划所处矩阵
            xPointStart = rowBlankInfo.xStart
            xPointEnd = rowBlankInfo.xEnd
          }
        }

      }
      if (findSuccess) {
        return {
          w, h,
          xStart: xPointStart + 1,
          yStart: yPointStart + 1,
          xEnd: xPointEnd + 1,
          yEnd: yPointStart + h - 1 + 1,
          x: xPointStart + 1,     // 和 xStart值永远相等
          y: yPointStart + 1,     // 和 yStart值永远相等
          col: this.col,
          row: this.row
          // 四个都加1是因为数组构成的矩阵索引是0,变成普通容易理解的网格几行几列的方式需要索引都加上一
        }
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
          if (this.isDebugger) this._layoutMatrix[rowIndex][colIndex] = '__debugger__'
          else this._layoutMatrix[rowIndex][colIndex] = setName
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
}

