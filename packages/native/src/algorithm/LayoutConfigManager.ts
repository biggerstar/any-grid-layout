import {cloneDeep} from "@/utils/tool";
import {Container} from "@/main/container/Container";
import {Item} from "@/main/item/Item";
import {ContainerGeneralImpl} from "@/main/container/ContainerGeneralImpl";

export class LayoutConfigManager {
  public container: Container
  public customLayout = {}
  public options = {}

  constructor(options) {
    this.options = options
  }

  setContainer(container) {
    this.container = container
  }

  /**
   * 用于提取用户传入的[所有]布局配置文件到 container.layouts
   * */
  initLayoutInfo() {
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
   * auto compute margin，size，col
   * @param direction {Number}  col || row
   * @param containerBoxLen {Number}  element width or height
   * @param size {Number}  set custom size value
   * @param margin {Number} set custom margin value
   * @param ratio {Number} set custom ratio value, default value from container built-in param
   * */
  autoComputeSizeInfo(direction, containerBoxLen, size, margin, ratio) {
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
      } // margin和size都固定,啥事都不做，用户给的太多了,都不用计算了
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
   * 生成合并最终配置，包含用户传入配置 和 global配置 和 合并后的最终useLayout配置,
   * 在layouts布局配置中找到符合该屏幕的px对应的布局方案,
   * layout对应的字段和Container的属性完全一致，两者最终会同步
   * */
  genLayoutConfig(containerWidth = null, containerHeight = null, customLayout = null)
    : Record<'layout' | 'global' | 'customLayout' | 'useLayout', ContainerGeneralImpl> {
    let layoutItem: any = {}
    // console.log(containerWidth,this.container.element.clientWidth);
    containerWidth = containerWidth ? containerWidth : this.container.element?.clientWidth
    containerHeight = containerHeight ? containerHeight : this.container.element?.clientHeight
    // console.log(containerWidth);
    // if (containerWidth === 0) containerWidth = 300
    const layouts = this.container.layouts.sort((a, b) => a.px - b.px)
    for (let i = 0; i < layouts.length; i++) {
      layoutItem = layouts[i]
      if (!Array.isArray(layoutItem.items)) layoutItem.items = []
      if (layouts.length === 1) break
      // 此时 layoutItem.px循环结束后 大于 containerWidth,表示该Container在该布局方案中符合px以下的设定,
      // 接上行: 如果实际Container大小还大于layoutItem.px，此时是最后一个，将跳出直接使用最后也就是px最大对应的那个布局方案
      if (layoutItem.px < containerWidth) continue
      break
    }
    // console.log(containerWidth,layoutItem.px);
    if (containerWidth === 0 && !customLayout.col) throw new Error("请在layout中传入col的值或者为Container设置一个初始宽度")
    //----------------------------------------------------//
    if (!customLayout) customLayout = this.genCustomLayout(this.container, layoutItem)

    let {
      col = null,   //  缺省值必须为null才能触发自动计算col
      row = null,
      ratioCol = this.container.ratioCol,
      ratioRow = this.container.ratioRow,
      size = [null, null],
      margin = [null, null],
      sizeWidth,
      sizeHeight,
      marginX,
      marginY,
    } = customLayout
    // console.log(containerWidth,layoutItem.px,layoutItem.margin,layoutItem.size,layoutItem.col);

    // const checkMarginOrSize = (name = '') => {
    //     const curArr = customLayout[name]
    //     if (Array.isArray(curArr)) {
    //         if (!['number', 'string'].includes(typeof curArr[0])
    //             || !['number', 'string'].includes(typeof curArr[1])) {
    //             console.error(name, '数组内的参数值只能为数字或者数字形式的字符串,您如果需要对其单独设置，请使用margin或者size用于单独设置的对应参数');
    //         }
    //     }
    // }
    // checkMarginOrSize('margin')
    // checkMarginOrSize('size')
    // console.log(customLayout);
    if (marginX) margin[0] = marginX
    if (marginY) margin[1] = marginY
    if (sizeWidth) size[0] = sizeWidth
    if (sizeHeight) size[1] = sizeHeight
    const oldMargin = Array.from(margin)
    const oldSize = Array.from(size)
    // console.log(oldMargin,oldSize);
    // if (!col && !(margin[0] || size[0])) throw new Error('col 或者 margin[0] 或者 size[0]必须要设定一个,您也可以设定col 或者 marginX 或者 sizeWidth两个中的一个便能进行布局')
    // if (!customLayout.responsive && !row && !(margin[1] || size[1])) throw new Error('row 或者 margin[1] 或者 size[1]必须要设定一个,您也可以设定row 或者 marginY 或者 sizeHeight两个中的一个便能进行布局')


    // console.log(col, containerWidth, size[0], margin[0], ratioCol);
    const smartInfo = this.computeSmartRowAndCol(this.container.engine.items)
    // console.log(smartInfo);
    // console.log(customLayout);
    // console.log(col);
    // console.log(smartInfo.smartCol);

    if (!col && !margin[0] && !size[0]) col = smartInfo.smartCol
    if (!row || customLayout['responsive']) row = smartInfo.smartRow
    // console.log(col);

    if (!customLayout['responsive'] && !col && this.container.col && this.container.col !== 1) col = this.container.col // 静态直接使用指定的col值,不等于1是define getter默认值就是1
    const sizeColInfo = this.autoComputeSizeInfo(col, containerWidth, size[0], margin[0], ratioCol)
    margin[0] = sizeColInfo.margin
    size[0] = sizeColInfo.size

    if (!customLayout['responsive'] && !row && this.container.row && this.container.row !== 1) row = this.container.row // 静态直接使用指定的row值,不等于1是define getter默认值就是1
    // console.log(row, containerHeight, size[1], margin[1], ratioRow)
    const sizeRowInfo = this.autoComputeSizeInfo(row, containerHeight, size[1], margin[1], ratioRow)
    margin[1] = sizeRowInfo.margin
    size[1] = sizeRowInfo.size


    if (oldMargin[0] !== null || oldMargin[1] !== null) customLayout.margin = margin
    if (oldSize[0] !== null || oldSize[1] !== null) customLayout.size = size

    // console.log(oldMargin,oldSize);
    // console.log(margin,size);

    const global = this.options['global'] || {}
    for (const key in customLayout) {
      if (global !== undefined || layoutItem[key] !== undefined) {
        customLayout[key] = customLayout[key]   // 筛选出用户传进来的初始配置
      }
    }

    this.container.layout = layoutItem
    this.container.useLayout = this.customLayout = this.checkLayoutValue(customLayout)
    const useLayout = this.checkLayoutValue({
      ...this.customLayout,
      margin,
      size
    })

    // console.log(useLayout.margin, useLayout.size);
    return {
      layout: layoutItem,   // 当前使用的layouts中某个布局配置
      global: this.options['global'],  //  当前container的全局配置
      customLayout: customLayout,   //  当前global和layoutItem 合并后使用的布局配置
      useLayout: useLayout,  // 在customLayout情况下必然包含margin，size布局字段
    }
  }


  /**[这里会计算col，row，不计算margin，size] 通过Container的行和列限制信息自动计算当前容器可使用的最大col和row,传入前col和row是Container中必须指定的值,
   * 这里Container挂载(mount)的时候会执行两次，一次是预同步容器大小信息，一次是执行最终挂载后容器信息，算是没架构好，
   * 后面有机会再优化吧
   * @param {Container} container 容器实例，该函数将直接修改Container中的 containerW，containerH， col ，row 等等，
   *                                      另外也同步修改当前使用的container.layout(当前使用的layout)中的 col，row
   * @param {Boolean} isSetConfig 是否设置最终col和row的运算结果
   * @param {Object,Null} customLayout 临时使用用于计算的layout
   * @return {Object} 一个包含最大col和row，containerW，ContainerH的集合
   * TODO 优化初始化执行两次问题，方案是收集所有Item后再调用该函数进行同步
   * */
  autoSetColAndRows(container, isSetConfig = true, customLayout = null) {
    const layoutManager = this.container.engine.layoutManager
    if (!container) container = this.container
    let maxCol = container.col
    let maxRow = container.row
    if (!customLayout) customLayout = this.genCustomLayout(container)
    let {
      col = null,   //  缺省值必须为null才能触发自动计算col
      row = null,
      ratioCol = container['ratioCol'],
      ratioRow = container['ratioRow'],
      size = [null, null],
      margin = [null, null],
      sizeWidth,
      sizeHeight,
      marginX,
      marginY,
      coverCol = false,
      coverRow = false,
    } = customLayout
    const items = container.engine.items
    const computeLimitLength = (maxCol, maxRow) => {
      //-----------------------------Col确定---------------------------------//
      if (container["minCol"] && container["maxCol"] && (container["minCol"] > container["maxCol"])) {
        maxCol = container["maxCol"]
        this.container.eventManager.warn('limitOverlap', "minCol指定的值大于maxCol,将以maxCol指定的值为主")
      } else if (container["maxCol"] && maxCol > container["maxCol"]) maxCol = container["maxCol"]
      else if (container["minCol"] && maxCol < container["minCol"]) maxCol = container["minCol"]

      //-----------------------------Row确定---------------------------------//
      if (container["minRow"] && container["maxRow"] && (container["minRow"] > container["maxRow"])) {
        maxRow = container["maxRow"]
        this.container.eventManager.warn('limitOverlap', "minRow指定的值大于maxRow,将以maxRow指定的值为主")
      } else if (container["maxRow"] && maxRow > container["maxRow"]) maxRow = container["maxRow"]
      else if (container["minRow"] && maxRow < container["minRow"]) maxRow = container["minRow"]
      return {
        limitCol: maxCol,
        limitRow: maxRow
      }
    }
    const AutoSetting = () => {
      // 自动设置col和row
      //  响应式模式后面所有操作将自动转变成autoRow,该情况不限制row，如果用户传入maxRow的话会限制ContainerH
      layoutManager.autoRow(!row || customLayout["responsive"])
      if (marginX) margin[0] = marginX
      if (marginY) margin[1] = marginY
      if (sizeWidth) size[0] = sizeWidth
      if (sizeHeight) size[1] = sizeHeight

      // row和col实际宽高不被限制，直接按现有Item计算得出，下面会进行Container的宽高限制
      // console.log(smartInfo);
      // console.log(maxCol,maxRow)

      const smartInfo = this.computeSmartRowAndCol(items)
      // const overCol
      if (coverCol || (!col && !margin[0] && !size[0]) || (col || Infinity) < smartInfo.smartCol) {   // 若三种都没有指定，将从items中自动计算出合适的最大容器大小(通常这里用于指定static位置的成员自动计算)
        maxCol = smartInfo.smartCol   // 如果都没有指定则根据当前配置自适应
        // console.log(coverCol , (!col && !margin[0] && !size[0]) , (col || Infinity) < smartInfo.smartCol)
      } else {
        const containerWidth = this.container.element?.clientWidth
        // if (!customLayout['responsive'] && !col && this.container.col && this.container.col !== 1) maxCol = this.container.col // 静态直接使用指定的col值,不等于1是define getter默认值就是1,所以默认情况下自动获取,但是不排除传入就是1的情况
        const sizeColInfo = this.autoComputeSizeInfo((col || maxCol), containerWidth, size[0], margin[0], ratioCol)
        maxCol = sizeColInfo.direction
      }

      if (coverRow || !row || (customLayout['responsive'] && !container.row/*初次加载时*/)
        || (row || Infinity) < smartInfo.smartRow) {  // 没有给出row则自适应，自动计算
        //  如果静态模式下col和row有任何一个没有指定，则看看是否有static成员并获取其最大位置
        maxRow = smartInfo.smartRow
      } else {
        const containerHeight = this.container.element?.clientHeight
        // if (!customLayout['responsive'] && !row && this.container.row && this.container.row !== 1) maxRow = this.container.row // 静态直接使用指定的row值,不等于1是define getter默认值就是1,所以默认情况下自动获取,但是不排除传入就是1的情况
        const sizeRowInfo = this.autoComputeSizeInfo((row || maxRow), containerHeight, size[1], margin[1], ratioRow)
        maxRow = sizeRowInfo.direction
      }
      // console.log(maxRow);

    }
    AutoSetting()
    // autoGrowRow

    let containerW = maxCol
    let containerH = maxRow
    if (isSetConfig && maxCol && maxRow) {
      const limitInfo = computeLimitLength(maxCol, maxRow)
      //  响应模式下无需限制row实际行数，该row或maxRow行数限制只是限制Container高度或宽度
      maxCol = containerW = limitInfo.limitCol
      maxRow = containerH = limitInfo.limitRow
      container['containerW'] = containerW
      container['containerH'] = containerH
      // console.log(containerW,containerH);
      container['col'] = maxCol
      container['row'] = maxRow
      if (col) container.layout.col = maxCol   // 上面必须保证col最终的正确性，这里只关心结果
      if (row) container.layout.row = maxRow   // 上面必须保证row最终的正确性，这里只关心结果
      if (container.platform === 'vue') {
        const useLayout = container['vue'].useLayout
        if (useLayout.col) useLayout.col = maxCol
        if (useLayout.row) useLayout.row = maxRow
      }

      // console.log(maxCol, maxRow)
      // console.log(maxRow, col, row);
      layoutManager.setColNum(maxCol)
      layoutManager.setRowNum(maxRow)
      layoutManager.addRow(maxRow - layoutManager._layoutMatrix.length)
      layoutManager.addCol(maxCol - layoutManager._layoutMatrix[0].length)
      const preCol = container.__ownTemp__.preCol
      const preRow = container.__ownTemp__.preRow
      if (maxCol !== preCol) {
        container.__ownTemp__.preCol = maxCol
        container.eventManager._callback_('colChange', maxCol, preCol, container)
        const vueColChange = container._VueEvents['vueColChange']
        if (typeof vueColChange === 'function') vueColChange(maxCol, preCol, container)

      }
      if (maxRow !== preRow) {
        container.__ownTemp__.preRow = maxRow
        container.eventManager._callback_('rowChange', maxRow, preRow, container)
        const vueRowChange = container._VueEvents['vueRowChange']
        if (typeof vueRowChange === 'function') vueRowChange(maxRow, preRow, container)
      }
    }
    return {
      col: maxCol,
      row: maxRow,
      containerW,
      containerH
    }
  }

  genCustomLayout(container = null, layoutItem = null) {
    if (!container) container = this.container
    if (!layoutItem) layoutItem = container.layout
    return Object.assign(cloneDeep(this.options['global']), cloneDeep(layoutItem || {})) // 在global值的基础上附加修改克隆符合当前layout的属性
  }


  /** 智能计算当前 items 中最大col边界值和最大row边界值 */
  computeSmartRowAndCol = (items: Item[]) => {
    let smartCol = this.container.col || 1
    let smartRow = this.container.row || 1
    if (items.length > 0) {
      items.forEach((item) => {
        if ((item.pos.x + item.pos.w - 1) > smartCol) smartCol = item.pos.x + item.pos.w - 1
        if ((item.pos.y + item.pos.h - 1) > smartRow) smartRow = item.pos.y + item.pos.h - 1
      })
    }
    // console.log(smartCol,smartRow);
    return {smartCol, smartRow}
  }


  checkLayoutValue = (customLayout) => {   // 里面就是缺啥补啥
    let {margin, size} = customLayout
    if (margin) {
      if (margin[0] !== null) {
        margin[0] = margin[0] ? parseFloat(margin[0].toFixed(1)) : 0
        if (margin[1] === null) margin[1] = margin[0]
      }

      if (margin[1] !== null) {
        margin[1] = margin[1] ? parseFloat(margin[1].toFixed(1)) : 0
        if (margin[0] === null) margin[0] = margin[1]
      }
    }
    if (size) {
      if (size[0] !== null) {
        size[0] = size[0] ? parseFloat(size[0].toFixed(1)) : 0
        if (size[1] === null) size[1] = size[0]
      }
      if (size[1] !== null) {
        size[1] = size[1] ? parseFloat(size[1].toFixed(1)) : 0
        if (size[0] === null) size[0] = size[1]
      }
    }
    // console.log(size, margin);
    return customLayout
  }
}










