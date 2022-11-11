import Item from "@/units/grid/Item.js";
import Sync from "@/units/grid/other/Sync.js";
import ItemPosList from "@/units/grid/ItemPosList.js";
import {cloneDeep, merge} from "@/units/grid/other/tool.js";
import LayoutManager from "@/units/grid/algorithm/LayoutManager.js";
import ItemPos from "@/units/grid/ItemPos.js";
import LayoutConfig from "@/units/grid/LayoutConfig.js";

/** #####################################################################
 * 用于连接Container 和 Item 和 LayoutManager 之间的通信
 *   更改布局的操作也都在这里，外部只能通过调用相关函数通信
 *   所有的最新参数都会同步到这里
 *   特殊情况: Container中的事件操作没去写通信接口，里面多次直接操作对应事件监听的所指Item
 *   目前需改善：有一定耦合度，思路实现的时候多次解耦，但是还是有多个地方直接通过指针进行操作，后面再改善吧
 *  ##################################################################### */
export default class Engine {
    items = []
    option = {}
    layoutManager = null
    container = null
    layoutConfig = null
    event = {}
    initialized = false
    mode = 'responsive'  // responsive || static
    __temp__ = {
        responsiveFunc: null,
        staticIndexCount: 0

    }

    constructor(option) {  //  posList用户初始未封装成ItemPos的数据列表
        this.option = option    // 拿到和Container同一份用户传入的配置信息
    }

    init() {
        this.itemPosList = new ItemPosList()
        // this.container.setColNum(this.option.col ? this.option.col : this.container.col)
        this.layoutManager = new LayoutManager()
        this.layoutConfig = new LayoutConfig(this.option)
        this.layoutConfig.setContainer(this.container)
        this.layoutConfig.initLayoutInfo()
        let useLayoutConfig = this.layoutConfig.genLayoutConfig()
        this._syncLayoutConfig(useLayoutConfig)
        this.initialized = true
    }

    /** 通过传入当前的useLayoutConfig直接应用当前布局方案，必须包含col, size, margin, 通过引擎找到适合当前的配置信息并进行各个模块之间的布局方案信息同步 */
    _syncLayoutConfig(useLayoutConfig) {
        if (Object.keys(useLayoutConfig).length === 0) {
            if (!this.option.col) throw new Error("未找到layout相关决定布局配置信息，您可能是未传入col字段")
        }
        merge(this.container, useLayoutConfig)      //  更新同步当前Container中的属性值
        // console.log(useLayoutConfig);
        // if (this.container.row === null && useLayoutConfig.responsive) this.layoutManager.autoRow()
        this.autoSetColAndRows(this.container)
        this.items.forEach(item => {
            //  只给Item需要的两个参数，其余像draggable，resize，transition这些实例化Item自身用的，Item自己管理，无需同步
            merge(item, {
                margin: useLayoutConfig.margin,
                size: useLayoutConfig.size,
            })
        })
    }

    /** 通过Container的行和列限制信息自动计算当前容器可使用的最大col和row,传入前col和row是Container中必须指定的值,
     * 这里Container挂载(mount)的时候会执行两次，一次是预同步容器大小信息，一次是执行最终挂载后容器信息，可以算是没架构好，
     * 后面有机会再优化吧
     * TODO 优化初始化执行两次问题，方案是收集所有Item后再调用该函数进行同步
     * */
    autoSetColAndRows(container) {
        let maxCol = container.col
        let maxRow = container.row
        let containerW = maxCol
        let containerH = maxRow
        const items = container.engine.items
        const computeSmartRowAndCol = (items)=>{
            let smartCol = 1
            let smartRow = 1
            if (items.length > 0) {
                items.forEach((item) => {
                    if ((item.pos.x + item.pos.w - 1) > smartCol) smartCol = item.pos.x + item.pos.w - 1
                    if ((item.pos.y + item.pos.h - 1) > smartRow) smartRow = item.pos.y + item.pos.h - 1
                })
            }
            return { smartCol, smartRow }
        }
        const computeLimitLength = (maxCol,maxRow)=>{
            //-----------------------------Col确定---------------------------------//
            if (container.minCol && container.maxCol && (container.minCol > container.maxCol)) {
                maxCol = container.maxCol
                console.warn("minCol指定的值大于maxCol,将以maxCol指定的值为主")
            } else if (container.maxCol && maxCol > container.maxCol) maxCol = container.maxCol
            else if (container.minCol && maxCol < container.minCol) maxCol = container.minCol

            //-----------------------------Row确定---------------------------------//
            if (container.minRow && container.maxRow && (container.minRow > container.maxRow)) {
                maxRow = container.maxRow
                console.warn("minRow指定的值大于maxRow,将以maxRow指定的值为主")
            } else if (container.maxRow && maxRow > container.maxRow) maxRow = container.maxRow
            else if (container.minRow && maxRow < container.minRow) maxRow = container.minRow
            return {
                limitCol:maxCol,
                limitRow:maxRow
            }
        }

        if (container.responsive){    // 响应模式会检测第一次给出的row进行初始容器固定
            if (!this.initialized) {   // 响应式模式第一次添加,为了固定初始row值，并在addItem部分去除溢出该row值的Item
                if(container.row === null)  this.layoutManager.autoRow()
                else maxRow = container.row
            }else if(this.initialized){   //  响应式模式后面所有操作将自动转变成autoRow,该情况不限制row，如果用户传入maxRow的话会限制ContainerH
                this.layoutManager.autoRow()
                const smartInfo = computeSmartRowAndCol(items)
                // row和col实际宽高不被限制，直接按现有Item计算得出，下面会进行Container的宽高限制
                maxCol = smartInfo.smartCol
                maxRow = smartInfo.smartRow
                const limitInfo = computeLimitLength(maxCol,maxRow)
                //  响应模式下无需限制row实际行数，该row或maxRow行数限制只是限制Container高度或宽度
                containerW = limitInfo.limitCol
                containerH = limitInfo.limitRow
            }
        }else if(!container.responsive){  // 静态模式下老老实实row多少就多少
            const limitInfo = computeLimitLength(container.col,container.row)
            containerW = maxCol = limitInfo.limitCol
            containerH = maxRow = limitInfo.limitRow
        }
        this.container.col = maxCol
        this.container.row = maxRow
        this.container.containerW = containerW
        this.container.containerH = containerH
        this.layoutManager.setColNum(maxCol)
        this.layoutManager.setRowNum(maxRow)
        this.layoutManager.addRow(maxRow)
        return {
            col: maxCol,
            row: maxRow,
            containerW,
            containerH
        }
    }

    /** 寻找某个指定矩阵范围内包含的所有Item,下方四个变量构成一个域范围;
     *  Item可能不完全都在该指定矩阵范围内落点，只是有一部分落在范围内，该情况也会被查找收集起来
     *  @param x {Number} x坐标
     *  @param y {Number} y坐标
     *  @param w {Number} x坐标方向延伸宫格数量
     *  @param h {Number} y坐标方向延伸宫格数量
     * */
    findItemFromPosition(x, y, w, h) {
        // console.log(x,y,w,h);
        const items = []
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            const xBoundaryStart = x
            const yBoundaryStart = y
            const xBoundaryEnd = x + w - 1
            const yBoundaryEnd = y + h - 1
            const xItemStart = item.pos.x
            const yItemStart = item.pos.y
            const xItemEnd = item.pos.x + item.pos.w - 1
            const yItemEnd = item.pos.y + item.pos.h - 1
            if ((xItemEnd >= xBoundaryStart && xItemEnd <= xBoundaryEnd      // 左边界碰撞
                    || xItemStart >= xBoundaryStart && xItemStart <= xBoundaryEnd)    // 右边界碰撞
                && (yItemEnd >= yBoundaryStart && yItemEnd <= yBoundaryEnd      // 左边界碰撞
                    || yItemStart >= yBoundaryStart && yItemStart <= yBoundaryEnd)      // 下边界碰撞
                // || ( xBoundaryStart <= xItemStart && xBoundaryEnd >= yItemEnd     // 全包含
                //     && yBoundaryStart <= yItemStart && yBoundaryEnd >= yItemEnd  )
            ) {
                items.push(item)
            }
        }
        return items
    }


    /** 更新当前配置，只有调用这里更新能同步所有的模块配置 */
    updateConfig(useLayoutConfig) {
        // this.container.layout
        // console.log(useLayoutConfig);
    }

    initItems() {
        const posList = this.container.data || []
        // 静态布局且可能网页元素已经被收集，js添加比html收集慢所以需要使用computedNeedRow
        posList.forEach((pos) => {
            this.addItem(this.createItem(pos))
        })
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
        // console.log(this.items.filter(item => !item._mounted));
        this.items.forEach((item) => {
            if (!item instanceof Item || !item._mounted || item.element.parentNode === null) return
            if (item.pos.temporaryStatic === true) staticItems.push(item)
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
        if (this.container.responsive) this.container.row = this.layoutManager.row  //静态布局的row是固定的，响应式不固定
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
    addItem(item) {   //  html收集的元素和js生成添加的成员都使用该方法添加
        const itemConfig = this.container.itemConfig
        if (itemConfig.minW > item.pos.w) console.error(this.container, item, `itemConfig配置指定minW为:${itemConfig.minW},当前w为${item.pos.w}`)
        else if (itemConfig.maxW < item.pos.w) console.error(this.container, item, `itemConfig配置指定maxW为:${itemConfig.maxW},当前w为${item.pos.w}`)
        else if (itemConfig.minH > item.pos.h) console.error(this.container, item, `itemConfig配置指定minH为:${itemConfig.minH},当前h为${item.pos.h}`)
        else if (itemConfig.maxH < item.pos.h) console.error(this.container, item, `itemConfig配置指定maxH为:${itemConfig.maxH},当前h为${item.pos.h}`)
        else {
            let itemRealPos = null
            item.pos.i = item.i = this.__temp__.staticIndexCount++
            if (!this.container._mounted) item.pos.__temp__._autoOnce = true
            // let nextStaticPos = item.pos.nextStaticPos !== null ? item.pos.nextStaticPos : item.pos
            // TODO  添加成功和失败的event回调
            // if (this._isCanAddItemToContainer_(item, item.pos.__temp__._autoOnce, true)) {
            //     this.items.push(item)
            // }
            this.push(item)
        }
    }

    push(item){
        const realLayoutPos = this._isCanAddItemToContainer_(item, item.pos.__temp__._autoOnce, true)
        if (realLayoutPos) {
            console.log(realLayoutPos)

            this.items.push(item)
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
        items.forEach((item, index) => {
            item.i = index
            item.pos.i = index
        })   // 为当前位置的Item按items底标索引重新编号
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
        return new Item(itemOption)
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

    /**  是否可以添加Item到当前的Container,请注意addSeat为true时该操作将会影响布局管理器中的_layoutMatrix,每次检查成功将会占用该检查成功所指定的空间
     *  @param item {Item}
     *  @param responsive {Boolean}  是否响应式还是静态布局
     *  @param addSeat {Boolean}  检测的时候是否为矩阵中添加占位
     * */
    _isCanAddItemToContainer_(item, responsive = false, addSeat = false) {
        let realLayoutPos
        let nextStaticPos = item.pos.nextStaticPos !== null ? item.pos.nextStaticPos : item.pos
        nextStaticPos.i = item.i
        realLayoutPos = this.layoutManager.findItem(nextStaticPos, responsive)
        // console.log(realLayoutPos);
        if (realLayoutPos !== null) {
            if (addSeat) {
                this.layoutManager.addItem(realLayoutPos)
                item.pos = this.itemPosList.createPos(merge(this._genItemPosArg(item), realLayoutPos))
                item.pos.nextStaticPos = null
                item.pos.__temp__._autoOnce = false
            }
            return realLayoutPos
        } else {
            // item.display = false
            return null
        }
    }

    /**  根据是否响应式布局或者静态布局更新容器内的Item布局
     *  items是指定要更新的几个Item，否则更新全部
     * */
    updateLayout(items = null, ignoreList = []) {
        //更新响应式布局
        if (this.container.responsive) {
            this.reset()
            let useLayoutConfig = this.layoutConfig.genLayoutConfig()
            this._syncLayoutConfig(useLayoutConfig)
            this.renumber()
            let updateItemList = items
            if (updateItemList === null) updateItemList = []
            items = this.items
            updateItemList = updateItemList.filter(item => items.includes(item))
            // console.log(items.length, updateItemList);
            const updateResponsiveItemLayout = (item) => {
                // if (!this._isCanAddItemToContainer_(item, item.__temp__._autoOnce, false)){
                //     this.layoutManager.addRow(1)
                // }
                const realPos = this._isCanAddItemToContainer_(item, item.__temp__._autoOnce, true)
                if (realPos){
                    // this.container.row = realPos.row
                    item.updateItemLayout()
                }
            }

            // console.log(updateItemList);
            updateItemList.forEach((item) => {   // 1.先对要进行更新成员占指定静态位
                item.__temp__._autoOnce = false
                // console.warn(item.pos);
                updateResponsiveItemLayout(item)
            })

            items.forEach(item => {   // 2。再对剩余成员按顺序找位置坐下
                if (updateItemList.includes(item)) return
                item.__temp__._autoOnce = true
                updateResponsiveItemLayout(item)
            })






            // console.log(items);
            // for (let i = 0; i < this.layoutManager._layoutMatrix.length; i++) {
            //     console.log(this.layoutManager._layoutMatrix[i]);
            // }
            // console.log('-----------------------------------------');


            this.container.updateStyle(this.container.genContainerStyle())
        } else if(!this.container.responsive){
            //更新静态布局
            // this.layoutManager.autoRow(false)
            let updateItemList = items || []
            if (updateItemList.length === 0) return
            items = this.items
            updateItemList = updateItemList.filter(item => items.includes(item))
            this.reset()
            let useLayoutConfig = this.layoutConfig.genLayoutConfig()
            this._syncLayoutConfig(useLayoutConfig)
            //----------------------------------------------------//
            const updateStaticItemLayout = (item) => {
                this._isCanAddItemToContainer_(item, false, true)
            }
            items.forEach(item => {  // 1.先把不进行改变的成员占位
                if (updateItemList.includes(item)) return   //  后面处理
                updateStaticItemLayout(item)
            })
            // console.log(updateItemList);
            updateItemList.forEach((item) => {  // 2。再对要进行更新的Item进行查询和改变位置
                updateStaticItemLayout(item)
                item.updateItemLayout()    //  只对要更新的Item进行更新
            })

        }

        const isDebugger = false
        if (isDebugger) {
            for (let i = 0; i < this.layoutManager._layoutMatrix.length; i++) {
                console.log(this.layoutManager._layoutMatrix[i]);
            }
            console.log('-----------------------------------------');
        }
    }

    _genItemPosArg(item) {
        item.pos.i = item.i
        item.pos.col = (() => this.container.col)()
        item.pos.row = (() => this.container.row)()
        return item.pos
    }

}
