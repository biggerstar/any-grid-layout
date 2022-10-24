import Item from "@/units/grid/Item.js";
import Sync from "@/units/grid/other/Sync.js";
import ItemPosList from "@/units/grid/ItemPosList.js";
import {cloneDeep, merge} from "@/units/grid/other/tool.js";
import LayoutManager from "@/units/grid/algorithm/LayoutManager.js";
import {layoutConfig} from "@/units/grid/defaultLayoutConfig.js";


/** #####################################################################
 * 用于连接Container 和 Item 和 LayoutManager 之间的通信
 *   更改布局的操作也都在这里，外部只能通过调用相关函数通信
 *   所有的最新参数都会同步到这里
 *   特殊情况: Container中的事件操作没去写通信接口，里面多次直接操作对应事件监听的所指Item
 *   目前需改善：有一定耦合度，思路实现的时候多次解耦，但是还是有多个地方直接通过指针进行操作，后面再改善吧
 *   TODO 开启多个容器的时候引擎合并改变成一个
 *  ##################################################################### */
export default class Engine {
    items = []
    option = {}
    layoutManager = null
    container = null
    mode = 'responsive'  // responsive || static
    _defaultLayoutConfig = layoutConfig
    __temp__ = {
        responsiveFunc: null
    }

    constructor(option) {  //  posList用户初始未封装成ItemPos的数据列表
        this.option = option    // 拿到和Container同一份用户传入的配置信息
    }

    init() {
        this.itemPosList = new ItemPosList()
        // this.container.setColNum(this.option.col ? this.option.col : this.container.col)
        this.layoutManager = new LayoutManager()
        this._initLayoutInfo()
        let useLayoutConfig = this._genLayoutConfig()
        this._syncLayoutConfig(useLayoutConfig)
    }

    /** 用于提取用户传入的布局配置文件到 this.layout */
    _initLayoutInfo() {
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
    _genLayoutConfig(containerWidth = null) {
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
            } // margin和size都固定,啥事都不做，用户给的太多了

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

    /** 通过传入当前的useLayoutConfig直接应用当前布局方案，必须包含col, size, margin, 通过引擎找到适合当前的配置信息并进行各个模块之间的布局方案信息同步 */
    _syncLayoutConfig(useLayoutConfig) {
        if (Object.keys(useLayoutConfig).length === 0) {
            if (!this.option.col) throw new Error("未找到layout相关决定布局配置信息，您可能是未传入col字段")
        }
        merge(this.container, useLayoutConfig)      //  更新同步当前Container中的属性值
        merge(this.layoutManager, useLayoutConfig)  //  更新layoutManager中的属性值
        this.items.forEach(item => {
            //  只给Item需要的两个参数，其余像draggable，resize，transition这些实例化Item自身用的，Item自己管理，无需同步
            merge(item, {
                margin: useLayoutConfig.margin,
                size: useLayoutConfig.size,
            })
        })

    }

    /** 更新当前配置，只有调用这里更新能同步所有的模块配置 */
    updateConfig(useLayoutConfig) {
        // this.container.layout
        // console.log(useLayoutConfig);
    }

    initItems() {
        const posList = this.container.data || []
        posList.forEach((pos) => {
            this.addItem(this.createItem(pos))
        })
        // console.log(this.itemPosList);
    }

    setColNum(col) {
        this.layoutManager.setColNum(col)
    }

    setContainer(container) {
        this.container = container
    }

    len() {
        return this.items.length
    }

    getItemList() {
        return this.items
    }

    getPosList() {
        return this.itemPosList.getPosList()
    }


    /** 为Container提供接口, 在container中调用 */
    responsive() {
        this.mode = "responsive"
        // this.__temp__.responsiveFunc = (ev)=>{
        //     console.log(ev);
        //     // console.log(this.container.element.clientHeight,this.container.element.clientWidth);
        //
        // }
        // window.addEventListener('resize',this.__temp__.responsiveFunc)


    }

    /** 为Container提供接口, 在container中调用 */
    static() {
        this.mode = "static"
        if (this.__temp__.responsiveFunc !== null) {
            window.removeEventListener('resize', this.__temp__.responsiveFunc)
        }
    }

    /** 根据当前的 i 获取对应的Item  */
    index(indexVal) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].i === indexVal) return this.items[i]
        }
        return null
    }

    /** 返回一个新的重新排序为包含static的Item的数组,优先排在前面 */
    sortStatic() {
        const staticItems = []
        const items = []
        // const arr = this.items.filter((item)=> item.element === dragItem.element)
        // arr.forEach((item) => item.remove())
        this.items.forEach((item) => {
            if (!item instanceof Item || !item._mounted || item.element.parentNode === null) return
            if (item.pos.static === true) staticItems.push(item)
            else items.push(item)
        })
        // items.sort((itemA, itemB) => itemA.i - itemB.i)
        this.renumber()
        return staticItems.concat(items)
    }

    /** 将item成员全部挂载到Container  */
    mountAll() {
        this.sortStatic()
        this.items.forEach((item) => item.mount())
        this.container.row = this.layoutManager.row
    }

    /** 将item成员从Container中全部移除  */
    unmount() {
        this.items.forEach((item) => item.unmount())
        this.clear()
    }

    /** 将item成员从Container中全部移除，之后重新渲染  */
    remount() {
        this.unmount()
        this.container.mount()
    }

    /** 添加一个Item 只添加不挂载 */
    addItem(item) {
        const itemConfig = this.container.itemConfig
        if (itemConfig.minW > item.pos.w) console.error(this.container,item, `itemConfig配置指定minW为:${itemConfig.minW},当前w为${item.pos.w}`)
        else if (itemConfig.maxW < item.pos.w) console.error(this.container,item, `itemConfig配置指定maxW为:${itemConfig.maxW},当前w为${item.pos.w}`)
        else if (itemConfig.minH > item.pos.h) console.error(this.container,item, `itemConfig配置指定minH为:${itemConfig.minH},当前h为${item.pos.h}`)
        else if (itemConfig.maxH < item.pos.h) console.error(this.container,item, `itemConfig配置指定maxH为:${itemConfig.maxH},当前h为${item.pos.h}`)
        else {
            item.i = this.items.length
            item.pos = this.itemPosList.createPos(merge(this._genItemPosArg(item), this.layoutManager.addItem(item.pos)))
            this.items.push(item)
            // console.log(item.pos);
        }
    }

    removeItem(item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) this.items.splice(i, 1);
        }
    }

    reset() {
        this.layoutManager.reset()
        this.itemPosList.clear()
        this.container.row = 1
    }

    clear() {
        this.items = []
    }

    /** 是否包含Item */
    includes(item) {
        return this.items.includes(item)
    }

    remove(removeItem) {
        for (let i = 0; i < this.items.length; i++) {
            if (removeItem === this.items[i]) {
                this.items.splice(i, 1)
                break
            }
        }
    }

    insert(item, index) {
        this.items.splice(index, 0, item)
    }

    /** 某个Item在this.items列表移动到指定位置
     * @param {Item} item  item
     * @param {Number} toIndex  移动到哪个索引
     * @dataParam {Number} fromIndex  来自哪个索引
     * */
    move(item, toIndex) {
        if (toIndex < 0) toIndex = 0
        let fromIndex = null
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) {
                fromIndex = i
                break
            }
        }
        if (fromIndex !== null) {
            this.items.splice(fromIndex, 1)
            this.items.splice(toIndex, 0, item)
        }
    }


    /** 交换自身Container中两个Item在this.items的位置 */
    exchange(itemA, itemB) {
        if (this.items.includes(itemA) && this.items.includes(itemB)) {
            this.items[itemA.i] = itemB
            this.items[itemB.i] = itemA
        }
    }

    /** 为自身Container中的this.items重新编号 */
    renumber(items) {
        items = items ? items : this.items
        items.forEach((item, index) => item.i = index)   // 为当前位置的Item按items底标索引重新编号
    }

    /** 使用itemOption对象创建一个Item, 如果有传入的el会直接将该el对应的Element对象转化成Item */
    createItem(itemOption) {
        //-------后面增加item需用的实例化传参需在这里为item添加该参数------//
        //   也能直接使用merge函数合并，这里分开没为什么
        itemOption.container = this.container
        itemOption.size = this.container.size
        itemOption.margin = this.container.margin
        //-----------------------------------------------------------//
        itemOption.i = this.len()  // 为item自动编号，动态值，决定因素是原始html元素加上后面添加的item
        const item = new Item(itemOption)
        // console.log(item);
        // console.log(itemOption);
        // Sync.run({
        //     func: () => {
        //     },
        //     rule: () => {
        //         console.log(this.container);
        //         item.parentElement = this.container.element
        //         return item.parentElement !== null
        //     }
        // })
        return item
    }

    /**  参数详情见类 Container.find 函数
     * */
    findItem(nameOrClassOrElement) {
        return this.items.filter((item) => {
            return item.name === nameOrClassOrElement
                || item.classList.includes(nameOrClassOrElement)
                || item.element === nameOrClassOrElement
        })

    }

    /**  更新所有的Item布局  */
    updateLayout(items, ignoreList = []) {
        this.reset()
        let useLayoutConfig = this._genLayoutConfig()
        this._syncLayoutConfig(useLayoutConfig)
        items = items ? items : this.sortStatic()
        items.forEach((item, index) => {
            items[index].pos = this.itemPosList.createPos(merge(this._genItemPosArg(item), this.layoutManager.addItem(item.pos)))
            // console.log(this.items[index].pos);
            // console.log(this.items[index].pos.static);
            if (items[index].pos.static) {
                // console.log(this.items[index]);
            }
            if (!ignoreList.includes(item)) {
                items[index].updateItemLayout()
            }
            this.container.row = this.layoutManager.row   // 将layoutManager中的行数告诉Container
        })
        this.container.updateStyle(this.container.genContainerStyle())
    }


    _genItemPosArg(item) {
        item.pos.i = item.i
        item.pos.col = (() => this.container.col)()
        item.pos.row = (() => this.container.row)()
        return item.pos
    }

}
