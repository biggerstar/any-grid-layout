/** 布局算法,非响应式 true表示栅格中该位置已经被占用，false表示未占用
 *  @param {Object} option  同学，你用一个对象放东西就行了，自己看类成员！！
 *  pos 是ItemPos类成员
 * */

export default class LayoutManager {
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
    minRow = null
    row = this.minRow  //  行数,非必须
    col = null // 列数，必须，实现自适应布局需在外层二次封装动态col的值

    constructor() {
        // if (typeof option.col !== 'number') new Error('col是必要参数且为正整数')
        // this.minRow = option.minRow ? option.minRow : 1
        // this.row = option.row ? option.row : this.minRow
    }

    /** 获取当前成员数量*/
    len() {
        return this.layoutPositions.length
    }

    setColNum(col){
        this.col = col
    }

    genLayout() {

    }


    /** 主动添加新的ITEM到矩阵中,会自动计算排列
     * @param {Object} posOption,ItemPos  普通的pos,在这里会转成最终grid位置的pos对象 , 对象内value参数见ItemPos类
     * @return {Object} findItemLayout 新成员的位置信息，同 _findBlankPosition 返回一致
     *                  该函数和_findBlankPosition的区别是 addItem 会操作布局矩阵并将新的成员记录到 layoutPositions中
     * */
    addItem = (posOption) => {
        if (posOption.w <= 0 || posOption.h <= 0) throw new Error(' w 或 h 是一个正整数')
        let findItemLayout = null
        if (posOption.static === true) {   // 如果是静态布局直接赋值后占位，外部最好所有的static成员先加载后再加载非静态成员,这样不会照成重叠
            findItemLayout = {
                w: posOption.w,
                h: posOption.h,
                xStart: posOption.x,
                yStart: posOption.y,
                xEnd: posOption.x +  posOption.w - 1 ,
                yEnd: posOption.y +  posOption.h - 1  ,
            }
        } else {
            findItemLayout = this._findBlankPosition(posOption.w, posOption.h)
        }

        const itemPos = {
            ...findItemLayout,
            iName: posOption.i,  // iName外部传入为做具名矩阵
        }
        // console.log(itemPos);
        this._addSeatLayout(itemPos)
        this.layoutPositions.push(itemPos)

        ///////////////////////////////////////////////////////////
        //  调试算法入队过程
        if (this.isDebugger) {
            const ColorLayoutMatrix = this._layoutMatrix.map(row => {
                return row.map(flag => flag ? '●' : '○')
            })
            console.log(`[${this.count++}]`, findItemLayout);
            console.log('       ', ColorLayoutMatrix[0].map((val, colIndex) => colIndex).join('    '));
            ColorLayoutMatrix.forEach((val, index) => {
                console.log(' ' + index, ':', val);
            })
            console.log('---------------------------------------------');
        }
        ///////////////////////////////////////////////////////////
        return posOption.static ? posOption : findItemLayout
    }

    /**
     * @param {Number} num  添加的行数
     * */
    addRow = (num = 1) => {
        for (let i = 0; i < num; i++) {
            this._layoutMatrix.push(new Array(this.col).fill(false))
        }
        this.row = this._layoutMatrix.length
    }

    /** 删除空白的最后一行,若已被占用不进行删除 */
    removeOneRow = () => {
        if (this._layoutMatrix.length === this.minRow) {
            console.log('栅格内行数已经为空')
            return false
        }
        if (!this._layoutMatrix[this._layoutMatrix.length - 1].includes(true)) {
            this._layoutMatrix.pop()
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
        if (w > this.col) {
            console.warn('ITEM:', 'w:' + w, 'x', 'h:' + h, '的宽度', w, '超过栅格大小，自动调整该ITEM宽度为栅格最大宽度', this.col);
            w = this.col
        }
        let counter = 0
        while (counter++ < 500) {  // counter 加一次索引行数加1,500表示最大500行,正常这够用了吧？
            if (this._layoutMatrix.length < (h + yPointStart)) {
                this.addRow((h + yPointStart) - this._layoutMatrix.length)  // 缺几行添加几行
            }
            let findSuccess = true
            let rowFindDone = false
            if (!this.col ) throw new Error('未找到经过引擎处理过后的col，可能是少传参数或者代码执行顺序有误，倘若这样，不用问，这就是bug')
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
     *  iName: 外部传入为了做具名矩阵
     *  助记： 第五行其实在矩阵的索引为 4 , 自用助记,没啥大意义
     *
     * */
    _addSeatLayout({xStart, yStart, xEnd, yEnd, iName}) {
        // console.log(iName);
        if (this._layoutMatrix.length < yEnd ) this.addRow(yEnd - this._layoutMatrix.length + 1)
        for (let rowIndex = yStart - 1; rowIndex <= yEnd - 1; rowIndex++) {
            for (let colIndex = xStart - 1; colIndex <= xEnd - 1 ; colIndex++) {
                try {
                    this._layoutMatrix[rowIndex][colIndex] = this.isDebugger ? true : (iName.toString()) || true
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
}


class LayoutDataTransform {
    constructor() {
    }


    /** 网格布局数据转点阵数据  */
    static gridToPoint(itemPos) {
        return {
            w: itemPos.w,
            h: itemPos.h,
            xStart: itemPos.x - 1,
            yStart: itemPos.y - 1,
            xEnd: itemPos.x - 1 + itemPos.w,
            yEnd: itemPos.y - 1 + itemPos.h,
        }
    }

    /** 点阵数据转网格布局数据 */
    static pointToGrid(itemPos) {

    }
}


// const layoutManager = new LayoutManager({
//     el: 'container',
//     // data: [],
//     data: layoutData,
//     col: 5,
//     // row: 10,
//     // margin: [10, 10],
//     // size:[80,100]
// })
// layoutManager.gridLayout()

// console.log(layoutManager._layoutMatrix);
// console.log(layoutManager.layoutPositions);
