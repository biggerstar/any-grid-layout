import {Item} from "@/main/item/Item";

export class Layout {
  get col() {
    return this._layoutMatrix[0].length
  }

  get row() {
    return this._layoutMatrix.length | 1
  }

  _layoutMatrix = [[]]   // 布局矩阵

  place = false
  placed = true

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
    // console.log(this.col);
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
   * @param xPointStart 执行x起点
   * @param xPointEnd 执行y起点
   * */
  _findRowBlank(rowData = [], w, xPointStart, xPointEnd) {
    let rowBlankCount = 0
    if (w <= 0) new Error('宽度不能为0或负数，请使用正整数')
    for (let i = xPointStart; i <= xPointEnd; i++) { //  因为块矩阵start和end指向同个索引所以取值要加一偏移计算
      if (rowData[i] !== this.place) rowBlankCount = 0  // 如果该行该位置被占用清空预放置行的空格计数
      else if ((rowData[i] === this.place)) rowBlankCount++
      if (rowBlankCount === w) {  //  如果该行能放置符合w的新组件
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

}


