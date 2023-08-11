import {Container} from "@/main/container/Container";
import {Item} from "@/main/item/Item";
import {ItemPos} from "@/main/item/ItemPos";
import {CustomItems} from "@/types";

export class LayoutConfigManager {
  public container: Container

  public get items(): CustomItems {
    return this.container.layout.items || []
  }

  public options = {}

  constructor(options) {
    this.options = options
  }

  public setContainer(container) {
    this.container = container
  }

  /**
   * 用于提取用户传入的[所有]布局配置文件到 container.layouts
   * */
  public initLayoutInfo() {
    const options: Record<any, any> = this.options
    let layoutInfo = []
    if (Array.isArray(options.layouts)) layoutInfo = options.layouts         // 传入的layouts字段Array形式
    else if (typeof options.layouts === "object") layoutInfo.push(options.layouts)     // 传入的layouts字段Object形式
    else throw new Error("请传入layout配置信息")
    if (Array.isArray(layoutInfo) && layoutInfo.length > 1) {
      let isBreak = false
      layoutInfo.sort((a, b) => {
        if (isBreak) return 0
        if (typeof a.px !== "number" || typeof b.px !== "number") {
          console.warn("未指定layout的px值,传入的layout为", b)
          isBreak = true
        }
        return a.px - b.px
      })
    }
    this.container.layouts = JSON.parse(JSON.stringify(layoutInfo))    // items 可能用的通个引用源，这里独立给内存地址，这里包括所有的屏幕适配布局，也可能只有一种默认实例化未通过挂载layouts属性传入的一种布局
    // console.log(layoutInfo);
  }

  /**
   * auto computed margin，size，col
   * @param direction {Number}  col | row 的值
   * @param containerBoxLen {Number}  element width or height
   * @param size {Number}  set custom size value
   * @param margin {Number} set custom margin value
   * @param ratio {Number} set custom ratio value, default value from container built-in param
   * */
  private autoComputeSizeInfo(direction, containerBoxLen, size, margin, ratio) {
    if (direction) {   //  col指定通常是执行静态布局，主算 size 和 margin
      if (size === null && margin === null) {   // 自动分配size和margin
        if (parseInt(direction.toString()) === 1) {
          margin = 0
          size = containerBoxLen / direction
        } else {
          //  自动分配时解二元一次方程
          //   marginAndSizeWidth +  margin[0]
          // ---------------------------------   =  1
          //     (margin  + size) * col
          // containerBoxLen +  margin = (margin  + size) * col
          // size = (containerBoxLen - ((col - 1) *  margin)) / col
          // margin=  size * ratioCol
          // 通过消元法消去 size
          // 得到： margin    = containerBoxLen /  ( col - 1 + (col / ratioCol) )
          margin = containerBoxLen / (direction - 1 + (direction / ratio))
          // size = margin / ratioCol
          size = (containerBoxLen - (direction - 1) * margin) / direction
          // console.log(size * col + (margin * (col - 1)));
        }
      } else if (size !== null && margin === null) {   // size[0]固定，自动分配margin
        if (parseInt(direction.toString()) === 1) margin = 0
        else margin = (containerBoxLen - (direction * size)) / (direction - 1)
        if (margin <= 0) margin = 0
      } else if (size === null && margin !== null) {  // margin固定，自动分配size
        if (parseInt(direction.toString()) === 1) margin = 0
        size = (containerBoxLen - ((direction - 1) * margin)) / direction
        if (size <= 0) throw new Error('在margin[*(0 or 1)]或在margin* (X or Y)为' + margin +
          '的情况下,size[*(0 or 1)]或size*(Width or Height)的Item主体宽度已经小于0,' +
          '您可以调小margin或者设定Container最小宽度或者高度(css:min-XXX),且保证margin*(col||row)大于最小宽度')
      } else if (size !== null && margin !== null) {
      } // margin和size都固定,啥事都不做，用户给的已知数太多,都不用计算了
    } else if (direction === null) {   // col不指定执行动态布局， 主算 col数量，次算margin,size中的一个,缺啥算啥
      // if (margin !== null && size === null) {  }  // col = null size = null 没有这种情况！！
      if (margin === null && size !== null) {   // size固定，自动分配margin和计算col
        if (containerBoxLen <= size) {    //  别问为什么这里和上面写重复代码，不想提出来且为了容易理解逻辑，也为了维护容易，差不了几行的-_-
          margin = 0
          direction = 1
        } else {
          direction = Math.floor(containerBoxLen / size)
          margin = (containerBoxLen - (size * direction)) / direction
        }
      } else if (margin !== null && size !== null) {   // margin和size固定，自动计算col
        if (containerBoxLen <= size) {   //  Container宽度小于预设的size宽度，表示是一行，此时不设置margin将全部宽度给size
          margin = 0
          direction = 1
        } else {     //  上面不是一行那这里就是多行了~~~~~~
          direction = Math.floor((containerBoxLen + margin) / (margin + size))
        }
      } else if (margin !== null && size === null) {
        size = margin / ratio
        if (containerBoxLen <= size) {
          direction = 1
        } else {
          direction = Math.floor((containerBoxLen + margin) / (margin + size))
        }
      }
    }
    return {
      direction,
      size,
      margin
    }
  }


  /**
   * 自动设置size和margin
   * */
  public autoSetSizeAndMargin(): void {
    const {clientWidth: containerWidth, clientHeight: containerHeight} = this.container.element || {}
    if (containerWidth === 0) throw new Error("请为Container设置一个宽高")
    const curLayout = this.container.layout
    let {
      col = null,   //  缺省值必须为null才能触发自动计算col
      row = null,
      ratioCol = this.container.getConfig('ratioCol'),
      ratioRow = this.container.getConfig('ratioRow'),
      size = [null, null],
      margin = [null, null],
      sizeWidth,
      sizeHeight,
      responsive = false
    } = curLayout
    if (sizeWidth) size[0] = sizeWidth
    if (sizeHeight) size[1] = sizeHeight

    //----------------------------------------------------//
    const smartInfo = this.computeSmartRowAndCol()
    if (!col && !margin[0] && !size[0]) col = smartInfo.smartCol
    if (!row || responsive) row = smartInfo.smartRow

    const nowCol = this.container.getConfig("col")
    if (!responsive && !col && nowCol && nowCol !== 1) col = nowCol // 静态直接使用指定的col值,不等于1是define getter默认值就是1
    const sizeColInfo = this.autoComputeSizeInfo(col, containerWidth, size[0], margin[0], ratioCol)
    margin[0] = sizeColInfo.margin
    size[0] = sizeColInfo.size

    const nowRow = this.container.getConfig("row")
    if (!responsive && !row && nowRow && nowRow !== 1) row = nowRow // 静态直接使用指定的row值,不等于1是define getter默认值就是1
    const sizeRowInfo = this.autoComputeSizeInfo(row, containerHeight, size[1], margin[1], ratioRow)
    margin[1] = sizeRowInfo.margin
    size[1] = sizeRowInfo.size

    this.container.setConfig('margin', margin)
    this.container.setConfig('size', size)

  }

  /**
   * 该函数将直接修改Container中的 containerW，containerH， col ，row 等
   * [这里会计算col，row，不计算margin，size] 通过Container的行和列限制信息自动计算当前容器可使用的最大col和row,传入前col和row是Container中必须指定的值,
   * 这里Container挂载(mount)的时候会执行两次，一次是预同步容器大小信息，一次是执行最终挂载后容器信息，算是没架构好，后面有时间会再优化
   *
   * @param {Boolean} isSetConfig 是否设置最终col和row的运算结果
   * @return {Object} 一个包含最大col和row，containerW，ContainerH的集合
   * TODO 优化初始化执行两次问题，方案是收集所有Item后再调用该函数进行同步
   * */
  public autoSetColAndRows(isSetConfig: boolean = true): void {
    const layoutManager = this.container.engine.layoutManager
    const container: Container = this.container
    let maxCol = container.getConfig("col")
    let maxRow = container.getConfig("row")
    const curLayout = container.layout

    let {
      col = null,   //  缺省值必须为null才能触发自动计算col
      row = null,
      ratioCol = container.getConfig('ratioCol'),
      ratioRow = container.getConfig('ratioRow'),
      size = [null, null],
      margin = [null, null],
      sizeWidth,
      sizeHeight,
      marginX,
      marginY,
      coverCol = false,
      coverRow = false,
      responsive = false
    } = curLayout
    const items = container.engine.items
    const computeLimitLength = (maxCol: number, maxRow: number) => {
      const curMaxCol = container.getConfig('maxCol')
      const curMinCol = container.getConfig('minCol')
      const curMaxRow = container.getConfig('maxRow')
      const curMinRow = container.getConfig('minRow')
      //-----------------------------Col限制确定---------------------------------//
      if (curMinCol && curMaxCol && (curMinCol > curMaxCol)) {
        maxCol = curMaxCol
        this.container.eventManager._warn_('limitOverlap', "minCol指定的值大于maxCol,将以maxCol指定的值为主")
      } else if (curMaxCol && maxCol > curMaxCol) maxCol = curMaxCol
      else if (curMinCol && maxCol < curMinCol) maxCol = curMinCol

      //-----------------------------Row限制确定---------------------------------//
      if (curMinRow && curMaxRow && (curMinRow > curMaxRow)) {
        maxRow = curMaxRow
        this.container.eventManager._warn_('limitOverlap', "minRow指定的值大于maxRow,将以maxRow指定的值为主")
      } else if (curMaxRow && maxRow > curMaxRow) maxRow = curMaxRow
      else if (curMinRow && maxRow < curMinRow) maxRow = curMinRow
      return {
        limitCol: maxCol,
        limitRow: maxRow
      }
    }
    const AutoSetting = () => {
      // 自动设置col和row
      // 响应式模式后面所有操作将自动转变成autoRow,该情况不限制row，如果用户传入maxRow的话会限制ContainerH
      layoutManager.autoRow(!row || responsive)
      if (marginX) margin[0] = marginX
      if (marginY) margin[1] = marginY
      if (sizeWidth) size[0] = sizeWidth
      if (sizeHeight) size[1] = sizeHeight
      // row和col实际宽高不被限制，直接按现有Item计算得出，下面会进行Container的宽高限制
      const smartInfo = this.computeSmartRowAndCol(items)

      if (
        coverCol
        || (!col && !margin[0] && !size[0])
        || (col || Infinity) < smartInfo.smartCol) {
        // 若三种都没有指定，将从items中自动计算出合适的最大容器大小(通常这里用于指定static位置的成员自动计算)
        maxCol = smartInfo.smartCol   // 如果都没有指定则根据当前配置自适应
      } else {
        const containerWidth = this.container.element?.clientWidth
        const sizeColInfo = this.autoComputeSizeInfo(col, containerWidth, size[0], margin[0], ratioCol)
        maxCol = sizeColInfo.direction
      }
      if (
        coverRow
        || !row
        || (responsive && !container.getConfig("row")/*初次加载时*/)
        || (row || Infinity) < smartInfo.smartRow) {  // 没给出row则自适应，自动计算有
        //  如果静态模式下col和row有任何一个没有指定，则看看是否有static成员并获取其最大位置
        maxRow = smartInfo.smartRow
      } else {
        const containerHeight = this.container.element?.clientHeight
        const sizeRowInfo = this.autoComputeSizeInfo(row, containerHeight, size[1], margin[1], ratioRow)
        maxRow = sizeRowInfo.direction
      }

      // console.log(maxRow);
    }
    // console.log(maxCol, maxRow)
    AutoSetting()


    let containerW = maxCol
    let containerH = maxRow
    if (isSetConfig && maxCol && maxRow) {
      const limitInfo = computeLimitLength(maxCol, maxRow)
      //  响应模式下无需限制row实际行数，该row或maxRow行数限制只是限制Container高度或宽度
      maxCol = containerW = limitInfo.limitCol
      maxRow = containerH = limitInfo.limitRow
      container.containerW = containerW
      container.containerH = containerH
      // console.log(containerW,containerH);
      container.setConfig('col', maxCol)
      container.setConfig('row', maxRow)

      console.log(maxCol, maxRow, col, row);

      layoutManager.setColNum(maxCol)
      layoutManager.setRowNum(maxRow)
      layoutManager.addRow(maxRow - layoutManager._layoutMatrix.length)
      layoutManager.addCol(maxCol - layoutManager._layoutMatrix[0].length)
      const preCol = container.__ownTemp__.preCol
      const preRow = container.__ownTemp__.preRow
      if (maxCol !== preCol) {
        container.__ownTemp__.preCol = maxCol
        container.eventManager._callback_('colChange', maxCol, preCol, container)
        const vueColChange = container._VueEvents?.['vueColChange']
        if (typeof vueColChange === 'function') vueColChange(maxCol, preCol, container)

      }
      if (maxRow !== preRow) {
        container.__ownTemp__.preRow = maxRow
        container.eventManager._callback_('rowChange', maxRow, preRow, container)
        const vueRowChange = container._VueEvents?.['vueRowChange']
        if (typeof vueRowChange === 'function') vueRowChange(maxRow, preRow, container)
      }
    }
  }


  /** 智能计算当前 items 中最大col边界值和最大row边界值 */
  public computeSmartRowAndCol = (items: Item[] = []) => {
    items = items.length ? items : <Item[]>this.items
    let smartCol = this.container.getConfig("col") || 1
    let smartRow = this.container.getConfig("row") || 1
    // const allItemsNoXY /* 是否所有的item都没有指定xy */ = !items.find((item) => item.pos.x && item.pos.y)
    // console.log(allItemsNoXY)
    // if (!allItemsNoXY) {  // 如果items中有明确指定的xy
    //
    // } else { // 如果items没有指定xy则使用当前宽计算col
    //
    // }
    items.forEach(({pos}: Item) => {
      const {x, y, w, h} = pos as ItemPos
      // console.log({x, y, w, h})
      if ((x + w - 1) > smartCol) smartCol = x + w - 1
      if ((y + h - 1) > smartRow) smartRow = y + h - 1
    })
    return {smartCol, smartRow}
  }
}

