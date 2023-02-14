import {cloneDeep} from "@/units/grid/other/tool.js";
import {layoutConfig} from "@/units/grid/default/defaultLayoutConfig.js";

export default class LayoutConfig {
    container = null
    useLayoutConfig = {}
    option = {}
    _defaultLayoutConfig = layoutConfig

    constructor(option) {
        this.option = option
    }

    setContainer(container) {
        this.container = container
    }

    /** 用于提取用户传入的布局配置文件到 container.layout */
    initLayoutInfo() {
        const option = this.option
        let layoutInfo = []
        if (Array.isArray(option.layouts)) layoutInfo = option.layouts         // 传入的layouts字段Array形式
        else if (typeof option.layouts === "object") layoutInfo.push(option.layouts)     // 传入的layouts字段Object形式
        else if (option.layouts === true) layoutInfo = this._defaultLayoutConfig  // (不计划开放外用,只用于开发测试)传入的layouts字段直接设置成true形式,使用默认的内置布局方案
        else throw new Error("请传入layout配置信息")
        if (Array.isArray(layoutInfo) && layoutInfo.length > 1) {
            layoutInfo.sort((a, b) => {
                if (typeof a.px !== "number" && typeof b.px !== "number") {
                    throw new Error("使用多个layout预设布局方案请必须指定对应的像素px,单位为数字,假设px=1024表示Container宽度1024像素以下执行该布局方案")
                }
                return a.px - b.px
            })
        }
        this.container.layouts = JSON.parse(JSON.stringify(layoutInfo))    // data可能用的通个引用源，这里独立给内存地址，这里包括所有的屏幕适配布局，也可能只有一种默认实例化未通过挂载layouts属性传入的一种布局
        // console.log(layoutInfo);
    }

    /** auto compute margin，size，col
     *  @param direction {Number}  col || row
     *  @param containerBoxLen {Number}  element width or height
     *  @param size {Number}  custom set size value
     *  @param margin {Number}  custom set margin value
     *  @param ratio {Number}  custom set ratio value, default value from container built-in param
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


    /** [这里只会计算size，margin] 传入屏幕的宽度，会在预定的layout布局配置中找到符合该屏幕的px对应的layoutConfig,
     * 之后返回该屏幕尺寸下的col size margin style  等等等配置信息，还有很多字段不写出来，
     * 这些对应的字段和Container中的对外属性完全一致，两者最终会同步   */
    genLayoutConfig(containerWidth = null, containerHeight = null,) {
        let useLayoutConfig = {}
        let layoutItem = {}
        // console.log(containerWidth,this.container.element.clientWidth);
        containerWidth = containerWidth ? containerWidth : this.container.element?.clientWidth
        containerHeight = containerHeight ? containerHeight : this.container.element?.clientHeight
        // console.log(containerWidth);
        // if (containerWidth === 0) containerWidth = 300
        const layouts = this.container.layouts.sort((a, b) => a.px - b.px)
        for (let i = 0; i < layouts.length; i++) {
            layoutItem = layouts[i]
            if (!Array.isArray(layoutItem.data)) layoutItem.data = []
            if (layouts.length === 1) break
            // 此时 layoutItem.px循环结束后 大于 containerWidth,表示该Container在该布局方案中符合px以下的设定,
            // 接上行: 如果实际Container大小还大于layoutItem.px，此时是最后一个，将跳出直接使用最后也就是px最大对应的那个布局方案
            if (layoutItem.px < containerWidth) continue
            break
        }
        this.container.layout = layoutItem
        // console.log(containerWidth,layoutItem.px);
        if (containerWidth === 0 && !useLayoutConfig.col) throw new Error("请在layout中传入col的值或者为Container设置一个初始宽度")
        //----------------------------------------------------//
        useLayoutConfig = Object.assign(cloneDeep(this.option.global), cloneDeep(layoutItem)) // 在global值的基础上附加修改克隆符合当前layout的属性
        let {
            col = null,   //  缺省值必须为null才能触发自动计算col
            row = null,
            ratioCol = this.container.ratioCol,
            ratioRow = this.container.ratioRow,
            size = [null, null],
            margin = [null, null],
            padding = 0,
            sizeWidth,
            sizeHeight,
            marginX,
            marginY,
        } = useLayoutConfig
        // console.log(containerWidth,layoutItem.px,layoutItem.margin,layoutItem.size,layoutItem.col);

        // const checkMarginOrSize = (name = '') => {
        //     const curArr = useLayoutConfig[name]
        //     if (Array.isArray(curArr)) {
        //         if (!['number', 'string'].includes(typeof curArr[0])
        //             || !['number', 'string'].includes(typeof curArr[1])) {
        //             console.error(name, '数组内的参数值只能为数字或者数字形式的字符串,您如果需要对其单独设置，请使用margin或者size用于单独设置的对应参数');
        //         }
        //     }
        // }
        // checkMarginOrSize('margin')
        // checkMarginOrSize('size')
        // console.log(useLayoutConfig);

        if (marginX) margin[0] = marginX
        if (marginY) margin[1] = marginY
        if (sizeWidth) size[0] = sizeWidth
        if (sizeHeight) size[1] = sizeHeight
        // if (!col && !(margin[0] || size[0])) throw new Error('col 或者 margin[0] 或者 size[0]必须要设定一个,您也可以设定col 或者 marginX 或者 sizeWidth两个中的一个便能进行布局')
        // if (!useLayoutConfig.responsive && !row && !(margin[1] || size[1])) throw new Error('row 或者 margin[1] 或者 size[1]必须要设定一个,您也可以设定row 或者 marginY 或者 sizeHeight两个中的一个便能进行布局')

        const sizeColInfo = this.autoComputeSizeInfo(col, containerWidth, size[0], margin[0], ratioCol)
        margin[0] = sizeColInfo.margin
        size[0] = sizeColInfo.size

        const sizeRowInfo = this.autoComputeSizeInfo(row, containerHeight, size[1], margin[1], ratioRow)
        margin[1] = sizeRowInfo.margin
        size[1] = sizeRowInfo.size

        useLayoutConfig = Object.assign(useLayoutConfig, {
            padding,
            margin,
            size,
        })   // 被修改的几个值再次合并回去

        let checkLayoutValue = (useLayoutConfig) => {   // 里面就是缺啥补啥
            let {margin, size, minCol, maxCol, col} = useLayoutConfig
            if (margin[0] !== null) {
                margin[0] = margin[0] ? parseFloat(margin[0].toFixed(1)) : 0
                if (margin[1] === null) margin[1] = margin[0]
            }
            if (size[0] !== null) {
                size[0] = size[0] ? parseFloat(size[0].toFixed(1)) : 0
                if (size[1] === null) size[1] = size[0]
            }
            if (margin[1] !== null) {
                margin[1] = margin[1] ? parseFloat(margin[1].toFixed(1)) : 0
                if (margin[0] === null) margin[0] = margin[1]
            }
            if (size[1] !== null) {
                size[1] = size[1] ? parseFloat(size[1].toFixed(1)) : 0
                if (size[0] === null) size[0] = size[1]
            }

            // console.log(size, margin);
            return useLayoutConfig
        }

        const currentLayout = {}
        const global = this.option.global || {}
        for (const key in useLayoutConfig) {
            if (global !== undefined || layoutItem[key] !== undefined) {
                currentLayout[key] = useLayoutConfig[key]   // 筛选出用户传进来的初始配置
            }
        }
        this.useLayoutConfig = Object.assign(this.useLayoutConfig, checkLayoutValue(useLayoutConfig))
        this.container.useLayout = useLayoutConfig  //  将新的配置给Container中的nowLayoutConfig表示当前使用的配置
        return {
            layout: layoutItem,   // 当前使用的layouts中某个布局配置
            global: this.option.global,  //  当前container的全局配置
            useLayoutConfig: useLayoutConfig,  // currentLayout情况下包含margin，size等等布局必须字段
            currentLayout: currentLayout,   //  当前global和layoutItem 合并后使用的布局配置
        }
    }


    /**[这里会计算col，row，不计算margin，size] 通过Container的行和列限制信息自动计算当前容器可使用的最大col和row,传入前col和row是Container中必须指定的值,
     * 这里Container挂载(mount)的时候会执行两次，一次是预同步容器大小信息，一次是执行最终挂载后容器信息，可以算是没架构好，
     * 后面有机会再优化吧
     * @param {Container} container 容器实例
     * @param {Boolean} isSetConfig 是否设置最终col和row的运算结果
     * @return {Object} 一个包含最大col和row，containerW，ContainerH的集合
     * TODO 优化初始化执行两次问题，方案是收集所有Item后再调用该函数进行同步
     * */
    autoSetColAndRows(container, isSetConfig = true) {
        const layoutManager = this.container.engine.layoutManager
        let maxCol = container.col
        let maxRow = container.row
        let useLayoutConfig = Object.assign(cloneDeep(this.option.global), cloneDeep(container.layout || {})) // 在global值的基础上附加修改克隆符合当前layout的属性
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
        } = useLayoutConfig
        let containerW = maxCol
        let containerH = maxRow
        const items = container.engine.items
        const computeSmartRowAndCol = (items) => {
            let smartCol = 1
            let smartRow = 1
            if (items.length > 0) {
                items.forEach((item) => {
                    if ((item.pos.x + item.pos.w - 1) > smartCol) smartCol = item.pos.x + item.pos.w - 1
                    if ((item.pos.y + item.pos.h - 1) > smartRow) smartRow = item.pos.y + item.pos.h - 1
                })
            }
            // console.log(smartCol,smartRow);
            return {smartCol, smartRow}
        }
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
            layoutManager.autoRow(!row || useLayoutConfig["responsive"])
            if (marginX) margin[0] = marginX
            if (marginY) margin[1] = marginY
            if (sizeWidth) size[0] = sizeWidth
            if (sizeHeight) size[1] = sizeHeight

            // row和col实际宽高不被限制，直接按现有Item计算得出，下面会进行Container的宽高限制
            // console.log(smartInfo);
            // console.log(maxCol,maxRow)

            const smartInfo = computeSmartRowAndCol(items)
            if (!col && !margin[0] && !size[0]) {
                maxCol = smartInfo.smartCol   // 如果都没有指定则根据当前配置自适应
            } else {
                const containerWidth = this.container.element?.clientWidth
                if (!useLayoutConfig['responsive'] && !col && this.container.col) col = this.container.col // 静态直接使用指定的col值
                const sizeColInfo = this.autoComputeSizeInfo(col, containerWidth, size[0], margin[0], ratioCol)
                maxCol = sizeColInfo.direction
            }
            if (!row || useLayoutConfig['responsive']) {  // 没有给出row则自适应，自动计算
                //  如果静态模式下col和row有任何一个没有指定，则看看是否有static成员并获取其最大位置
                maxRow = smartInfo.smartRow
            } else {
                const containerHeight = this.container.element?.clientHeight
                if (!useLayoutConfig['responsive'] && !row && this.container.row) row = this.container.row // 静态直接使用指定的row值
                const sizeRowInfo = this.autoComputeSizeInfo(row, containerHeight, size[1], margin[1], ratioRow)
                maxRow = sizeRowInfo.direction
            }

            // console.log(maxRow);
            const limitInfo = computeLimitLength(maxCol, maxRow)
            //  响应模式下无需限制row实际行数，该row或maxRow行数限制只是限制Container高度或宽度
            containerW = limitInfo.limitCol
            containerH = limitInfo.limitRow
        }
        AutoSetting()
        // console.log(maxCol, maxRow)
        // autoGrowRow
        if (isSetConfig) {
            container.col = maxCol
            container.row = maxRow
            container.containerW = containerW
            container.containerH = containerH
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
}










