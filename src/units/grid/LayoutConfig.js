import {cloneDeep, merge} from "@/units/grid/other/tool.js";
import {layoutConfig} from "@/units/grid/defaultLayoutConfig.js";

export default class LayoutConfig {
    container = null
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
        if (typeof option.layout === "object") layoutInfo.push(option.layout)     // 传入的layout字段Object形式
        else if (Array.isArray(option.layout)) layoutInfo = option.layout         // 传入的layout字段Array形式
        else if (option.layout === true) layoutInfo = this._defaultLayoutConfig   // 传入的layout字段直接设置成true形式,使用默认的内置布局方案
        else throw new Error("请传入layout配置信息")
        if (layoutInfo.length > 1) {
            layoutInfo.sort((a, b) => {
                if (typeof a.px !== "number" && typeof b.px !== "number") {
                    throw new Error("使用多个layout预设布局方案请必须指定对应的像素px,单位为数字,假设px=1024表示Container宽度1024像素以下执行该布局方案")
                }
                return a.px - b.px
            })
        }
        this.container.layout = layoutInfo    // 这里包括所有的屏幕适配布局，也可能只有一种默认实例化未通过挂载layout属性传入的一种布局
    }

    /**  传入屏幕的宽度，会在预定的layout布局配置中找到符合该屏幕的px对应的layoutConfig,
     * 之后返回该屏幕尺寸下的col size margin style  等等等配置信息，还有很多字段不写出来，
     * 这些对应的字段和Container中的对外属性完全一致，两者最终会同步   */
    genLayoutConfig(containerWidth = null) {
        let useLayoutConfig = {}
        containerWidth = containerWidth ? containerWidth : this.container.element.clientWidth
        // if(this.option.global) merge(this.container,this.option.global)       // 合并配置到Container对象中作为全局配置
        for (let i = 0; i < this.container.layout.length; i++) {
            const layoutItem = this.container.layout[i]
            useLayoutConfig = layoutItem
            if (this.container.layout.length === 1) break
            // 此时 layoutItem.px循环结束后 大于 containerWidth,表示该Container在该布局方案中符合px以下的设定,
            // 接上行: 如果实际Container大小还大于layoutItem.px，此时是最后一个，将跳出直接使用最后也就是px最大对应的那个布局方案
            if (layoutItem.px < containerWidth) continue
            break
        }
        // console.log(containerWidth, useLayoutConfig);
        if (containerWidth === 0 && !useLayoutConfig.col) throw new Error("请在layout中传入col的值或者为Container设置一个初始宽度")
        //----------------------------------------------------//

        useLayoutConfig = cloneDeep(Object.assign(merge(this.option.global, this.option.global, true), useLayoutConfig)) // 在global值的基础上附加修改克隆符合当前layout的属性
        this.container.useLayout = useLayoutConfig  //  将新的配置给Container中的nowLayoutConfig表示当前使用的配置
        let {
            col = this.container.col,
            ratio = this.container.ratio,
            size = this.container.size,
            margin = this.container.margin,
            padding = 0,
            sizeWidth,
            sizeHeight,
            marginX,
            marginY,
        } = useLayoutConfig
        if (!col && !size[0]) throw new Error('col或者size[0]必须要设定一个,您也可以设定col或sizeWidth两个中的一个便能进行布局')
        if (marginX) margin[0] = marginX
        if (marginY) margin[1] = marginY
        if (sizeWidth) size[0] = sizeWidth
        if (sizeHeight) size[1] = sizeHeight

        if (col) {   //  col指定通常是执行静态布局，主算 size 和 margin
            if (size[0] === null && margin[0] === null) {   // 自动分配size[0]和margin[0]
                if (col === 1) {
                    margin[0] = 0
                    size[0] = containerWidth / col
                } else {
                    //  自动分配时解二元一次方程
                    //   marginAndSizeWidth +  margin[0]
                    // ---------------------------------   =  1
                    //     (margin[0]  + size[0]) * col
                    // containerWidth +  margin[0] = (margin[0]  + size[0]) * col
                    // size[0] = (containerWidth - ((col - 1) *  margin[0])) / col
                    // margin[0] =  size[0] * ratio
                    // 通过消元法消去 size[0]
                    // 得到： margin[0]    = containerWidth /  ( col - 1 + (col / ratio) )
                    margin[0] = containerWidth / (col - 1 + (col / ratio))
                    size[0] = margin[0] / ratio
                    size[0] = (containerWidth - (col - 1) * margin[0]) / col
                    // console.log(margin[0],size[0]);
                    // console.log(size[0] * col + (margin[0] * (col - 1)));
                }
            } else if (size[0] !== null && margin[0] === null) {   // size[0]固定，自动分配margin[0]
                if (col === 1) margin[0] = 0
                else margin[0] = ((containerWidth - (col * size[0])) / col)
                if (margin[0] <= 0) margin[0] = 0
            } else if (size[0] === null && margin[0] !== null) {  // margin固定，自动分配size[0]
                if (col === 1) margin[0] = 0
                size[0] = (containerWidth - (col * margin[0])) / col
                if (size[0] <= 0) throw new Error('在margin[0]或在marginX为' + margin[0] +
                    '的情况下,size[0]或sizeWidth的Item主题宽度已经小于0')
            } else if (size[0] !== null && margin[0] !== null) {
            } // margin和size都固定,啥事都不做，用户给的太多了,都不用计算了
        } else if (col === null) {   // col不指定执行动态布局， 主算 col数量，次算margin,size中的一个,缺啥算啥
            // console.log(11111111);
            // if (margin[0] !== null && size[0] === null) {  }  // col = null size = null 没有这种情况！！
            if (margin[0] === null && size[0] !== null) {   // size[0]固定，自动分配margin[0]和计算col
                if (containerWidth <= size[0]) {    //  别问为什么这里和上面写重复代码，不想提出来且为了容易理解逻辑，也为了维护容易，差不了几行的-_-
                    margin[0] = 0
                    col = 1
                } else {
                    col = Math.floor(containerWidth / size[0])
                    margin[0] = (containerWidth - (size[0] * col)) / col
                }
            } else if (margin[0] !== null && size[0] !== null) {   // margin[0]和size[0]固定，自动计算col
                if (containerWidth <= size[0]) {   //  Container宽度小于预设的size宽度，表示是一行，此时不设置margin将全部宽度给size
                    margin[0] = 0
                    col = 1
                } else {     //  上面不是一行那这里就是多行了~~~~~~
                    col = Math.floor((containerWidth - margin[0]) / (margin[0] + size[0]))
                }
            }
        }

        useLayoutConfig = Object.assign(useLayoutConfig, {
            padding,
            margin,
            size,
            ratio,
            col,
        })

        let checkLayoutValue = (useLayoutConfig) => {   // 里面就是缺啥补啥
            let {margin, size, minCol, maxCol, col, padding} = useLayoutConfig
            margin[0] = margin[0] ? parseFloat(margin[0].toFixed(1)) : 0
            margin[1] = margin[1] ? parseFloat(margin[1].toFixed(1)) : parseFloat(margin[0].toFixed(1))
            size[0] = size[0] ? parseFloat(size[0].toFixed(1)) : 0
            size[1] = size[1] ? parseFloat(size[1].toFixed(1)) : parseFloat(size[0].toFixed(1))  // 如果未传入sizeHeight，默认和sizeWidth一样
            if (col < minCol) useLayoutConfig.col = minCol
            if (col > maxCol) useLayoutConfig.col = maxCol
            let computedPadding = () => {
                let marginWidth = 0
                if ((col) > 1) marginWidth = (col - 1) * margin[0]
                return ((col) * size[0]) + marginWidth || 0
            }
            padding = (containerWidth - computedPadding()) / 2
            // console.log(padding,containerWidth,computedPadding());
            return useLayoutConfig
        }
        return checkLayoutValue(useLayoutConfig)
    }


}