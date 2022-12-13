import Item from "@/units/grid/main/item/Item.js";
import {merge} from "@/units/grid/other/tool.js";
import LayoutManager from "@/units/grid/algorithm/LayoutManager.js";
import LayoutConfig from "@/units/grid/algorithm/LayoutConfig.js";
import ItemPos from "@/units/grid/main/item/ItemPos.js";

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
    initialized = false
    __temp__ = {
        responsiveFunc: null,
        staticIndexCount: 0
    }

    constructor(option) {  //  posList用户初始未封装成ItemPos的数据列表
        this.option = option    // 拿到和Container同一份用户传入的配置信息
    }

    init() {
        if (this.initialized) return
        this.layoutManager = new LayoutManager()
        this.layoutConfig = new LayoutConfig(this.option)
        this.layoutConfig.setContainer(this.container)
        this.layoutConfig.initLayoutInfo()
        this.initialized = true
    }

    /** 同步Container和layoutManager的配置信息 */
    _sync() {  // 语法糖
        let useLayoutConfig = this.layoutConfig.genLayoutConfig()
        this._syncLayoutConfig(useLayoutConfig.useLayoutConfig)
    }

    /** 通过传入当前的useLayoutConfig直接应用当前布局方案，必须包含col, size, margin, 通过引擎找到适合当前的配置信息并进行各个模块之间的布局方案信息同步 */
    _syncLayoutConfig(useLayoutConfig = null) {
        if (!useLayoutConfig) return
        if (Object.keys(useLayoutConfig).length === 0) {
            if (!this.option.col) throw new Error("未找到layout相关决定布局配置信息，您可能是未传入col字段")
        }
        // console.log(useLayoutConfig);
        merge(this.container, useLayoutConfig, false, ['events'])      //  更新同步当前Container中的属性值
        // console.log(useLayoutConfig);
        // console.log(this.container.eventManager)
        this.autoSetColAndRows(this.container)
        this.items.forEach(item => {
            //  container只给Item需要的两个参数，其余像draggable，resize，transition这些实例化Item自身用的，Item自己管理，无需同步
            merge(item, {
                margin: useLayoutConfig.margin,
                size: useLayoutConfig.size,
            })
        })
    }

    /** 通过Container的行和列限制信息自动计算当前容器可使用的最大col和row,传入前col和row是Container中必须指定的值,
     * 这里Container挂载(mount)的时候会执行两次，一次是预同步容器大小信息，一次是执行最终挂载后容器信息，可以算是没架构好，
     * 后面有机会再优化吧
     * @param {Container} container 容器实例
     * @param {Boolean} isSetConfig 是否设置最终col和row的运算结果
     * @return {Object} 一个包含最大col和row，containerW，ContainerH的集合
     * TODO 优化初始化执行两次问题，方案是收集所有Item后再调用该函数进行同步
     * */
    autoSetColAndRows(container, isSetConfig = true) {
        let maxCol = container.col
        let maxRow = container.row
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
            return {smartCol, smartRow}
        }
        const computeLimitLength = (maxCol, maxRow) => {
            //-----------------------------Col确定---------------------------------//
            if (container["minCol"] && container["maxCol"] && (container["minCol"] > container["maxCol"])) {
                maxCol = container["maxCol"]
                console.warn("minCol指定的值大于maxCol,将以maxCol指定的值为主")
            } else if (container["maxCol"] && maxCol > container["maxCol"]) maxCol = container["maxCol"]
            else if (container["minCol"] && maxCol < container["minCol"]) maxCol = container["minCol"]

            //-----------------------------Row确定---------------------------------//
            if (container["minRow"] && container["maxRow"] && (container["minRow"] > container["maxRow"])) {
                maxRow = container["maxRow"]
                console.warn("minRow指定的值大于maxRow,将以maxRow指定的值为主")
            } else if (container["maxRow"] && maxRow > container["maxRow"]) maxRow = container["maxRow"]
            else if (container["minRow"] && maxRow < container["minRow"]) maxRow = container["minRow"]
            return {
                limitCol: maxCol,
                limitRow: maxRow
            }
        }
        const responsiveAutoSetting = () => {
            if (!this.initialized) {   // 响应式模式第一次添加,为了固定初始row值，并在addItem部分去除溢出该row值的Item
                if (!container.row) this.layoutManager.autoRow()
                else maxRow = container.row
                if (container["maxRow"]) console.warn("【响应式】模式中不建议使用maxRow,您如果使用该值，" +
                    "只会限制容器盒子(Container)的高度,不能限制成员排列的row值 因为响应式设计是能自动管理容器的高度，" +
                    "您如果想要限制Container显示区域且获得内容滚动能力，您可以在Container外部加上一层盒子并设置成overflow:scroll")
            } else if (this.initialized) {   //  响应式模式后面所有操作将自动转变成autoRow,该情况不限制row，如果用户传入maxRow的话会限制ContainerH
                this.layoutManager.autoRow()
                const smartInfo = computeSmartRowAndCol(items)
                // row和col实际宽高不被限制，直接按现有Item计算得出，下面会进行Container的宽高限制
                // maxCol = smartInfo.smartCol  这里因为当前设定col必须要有，所以col从始至终都是固定的，不进行动态调整
                maxRow = smartInfo.smartRow
                const limitInfo = computeLimitLength(maxCol, maxRow)
                //  响应模式下无需限制row实际行数，该row或maxRow行数限制只是限制Container高度或宽度
                containerW = limitInfo.limitCol
                containerH = limitInfo.limitRow
            }
        }
        const staticAutoSetting = () => {
            const limitInfo = computeLimitLength(container.col, container.row)
            containerW = maxCol = limitInfo.limitCol
            containerH = maxRow = limitInfo.limitRow
        }

        if (container["responsive"]) {    // 响应模式会检测第一次给出的row进行初始容器固定
            responsiveAutoSetting()
        } else if (!container["responsive"]) {  // 静态模式下老老实实row多少就多少
            staticAutoSetting()
        }
        if (isSetConfig) {
            this.container.col = maxCol
            this.container.row = maxRow
            this.container.containerW = containerW
            this.container.containerH = containerH
            this.layoutManager.setColNum(maxCol)
            this.layoutManager.setRowNum(maxRow)
            this.layoutManager.addRow(maxRow - this.layoutManager._layoutMatrix.length)
        }
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
     *  @param items {Object} 在该Item列表中查找，默认使用this.Items
     * */
    findCoverItemFromPosition(x, y, w, h, items = null) {
        // console.log(x,y,w,h);
        items = items || this.items
        const resItem = []
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            const xBoundaryStart = x       // 左边界
            const yBoundaryStart = y       // 上边界
            const xBoundaryEnd = x + w - 1  //  右边界
            const yBoundaryEnd = y + h - 1  // 下边界
            const xItemStart = item.pos.x          // Item左边界
            const yItemStart = item.pos.y           // Item上边界
            const xItemEnd = item.pos.x + item.pos.w - 1    // Item右边界
            const yItemEnd = item.pos.y + item.pos.h - 1    // Item下边界

            if ((xItemEnd >= xBoundaryStart && xItemEnd <= xBoundaryEnd      // 左边界碰撞
                    || xItemStart >= xBoundaryStart && xItemStart <= xBoundaryEnd  // X轴中间部分碰撞
                    || xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd)    // 右边界碰撞
                && (yItemEnd >= yBoundaryStart && yItemEnd <= yBoundaryEnd      // 左边界碰撞
                    || yItemStart >= yBoundaryStart && yItemStart <= yBoundaryEnd  // Y轴中间部分碰撞
                    || yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)      // 下边界碰撞
                || (xBoundaryStart >= xItemStart && xBoundaryEnd <= xItemEnd     // 全包含,目标区域只被某个超大Item包裹住的情况(必须要)
                    && yBoundaryStart >= yItemStart && yBoundaryEnd <= yItemEnd)
            ) {
                resItem.push(item)
            }
        }
        return resItem
    }

    /** 响应式模式下找到在布局流在Container空白部分或者在Container外所对应容器里面可以放置的x，y位置，
     * 并对应返回该位置的Item作为外部使用的toItem   */
    findResponsiveItemFromPosition(x, y, w, h) {
        let pointItem = null
        let lastY = 1
        if (this.items.length > 0) {
            lastY = this.items[this.items.length - 1].pos.y
        }
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            const xItemStart = item.pos.x
            const yItemStart = item.pos.y
            const xItemEnd = item.pos.x + item.pos.w - 1
            const yItemEnd = item.pos.y + item.pos.h - 1
            if (xItemStart !== x) continue
            if (y > lastY) y = lastY
            if (x => xItemStart && x <= xItemEnd && y >= yItemStart && y <= yItemEnd) {
                if (x === xItemStart && y === yItemStart) pointItem = item
            }
        }
        return pointItem
    }

    /** 在静态布局中通过指定的Item找到该Item在矩阵中最大的resize空间，函数返回maxW和maxH代表传进来的对应Item在矩阵中最大长,宽
     * 数据来源于this.items的实时计算
     * @param {Item} itemPoint 要计算矩阵中最大伸展空间的Item，该伸展空间是一个矩形
     * @return {{maxW: number, maxH: number,minW: number, minH: number}}  maxW最大伸展宽度，maxH最大伸展高度,minW最小伸展宽度，maxH最小伸展高度
     * */
    findStaticBlankMaxMatrixFromItem(itemPoint) {
        const x = itemPoint.pos.x
        const y = itemPoint.pos.y
        const w = itemPoint.pos.w
        const h = itemPoint.pos.h
        let maxW = this.container.col - x + 1   // X轴最大活动宽度
        let maxH = this.container.row - y + 1   // Y轴最大活动宽度
        let minW = maxW  // X轴最小活动宽度
        let minH = maxH  // Y轴最小活动宽度
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i]
            const pos = item.pos
            if (itemPoint === item) continue
            if (pos.x + pos.w - 1 < x || pos.y + pos.h - 1 < y) continue   // 上和左在x,y点外的Item不考虑
            //  思路：右方向最大(maxW && minH) :上方向最大(minW && maxH)
            // if (pos.x === x && pos.y === y) continue
            if (pos.x >= x && pos.x - x < maxW) {
                if (((y + h - 1) >= pos.y && (y + h - 1) <= (pos.y + pos.h - 1)
                    || (pos.y + pos.h - 1) >= y && (pos.y + pos.h - 1) <= (y + h - 1))) {    // 横向计算X空白处
                    maxW = pos.x - x
                }
            }
            if (pos.y >= y && pos.y - y < maxH) {
                if (((x + w - 1) >= pos.x && (x + w - 1) <= (pos.x + pos.w - 1)
                    || (pos.x + pos.w - 1) >= x && (pos.x + pos.w - 1) <= (x + w - 1))) {  // 纵向计算Y空白处
                    maxH = pos.y - y
                }
            }
            if (pos.x >= x && pos.x - x < minW) {
                if (((y + maxH - 1) >= pos.y && (y + maxH - 1) <= (pos.y + pos.h - 1)
                    || (pos.y + pos.h - 1) >= y && (pos.y + pos.h - 1) <= (y + maxH - 1))) {    // 横向计算X最小空白处
                    minW = pos.x - x
                }
            }
            if (pos.y >= y && pos.y - y < minH) {
                if (((x + maxW - 1) >= pos.x && (x + maxW - 1) <= (pos.x + pos.w - 1)
                    || (pos.x + pos.w - 1) >= x && (pos.x + pos.w - 1) <= (x + maxW - 1))) {  // 纵向计算Y空白处
                    minH = pos.y - y
                }
            }
        }
        // console.log(minW,minH,maxW,maxH)
        return {
            maxW,    // 当前item的pos中x,y,w,h指定位置大伸展宽度
            maxH,    // 最大伸展高度(同上)
            minW,    // 最小伸展宽度(同上)
            minH     // 最小伸展高度(同上)
        }
    }

    // /** 更新当前配置，只有调用这里更新能同步所有的模块配置 */
    // updateConfig(useLayoutConfig) {
    //     // this.container.layout
    //     // console.log(useLayoutConfig);
    // }

    // initItems() {
    //     const posList = this.container.data || []
    //     // 静态布局且可能网页元素已经被收集，js添加比html收集慢所以需要使用computedNeedRow
    //     posList.forEach((pos) => {
    //         this.addItem(this.createItem(pos))
    //     })
    // }

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
            if (item.pos.static === true) staticItems.push(item)
            else items.push(item)
        })
        // items.sort((itemA, itemB) => itemA.i - itemB.i)
        this.renumber()
        return staticItems.concat(items)
    }

    /** 将item成员全部挂载到Container  */
    mountAll() {
        // this.sortStatic()
        this.items.forEach((item) => item.mount())
        if (this.container.responsive) this.container.row = this.layoutManager.row  //静态布局的row是固定的，响应式不固定
    }

    /** 将item成员从Container中全部移除,items数据还在  */
    unmount(isForce) {
        this.items.forEach((item) => item.unmount(isForce))
        this.reset()
    }

    /** 将item成员从Container中全部移除，之后重新渲染  */
    remount() {
        this.unmount()
        this.container.mount()
    }

    /** 添加一个Item 只添加不挂载 */
    addItem(item) {   //  html收集的元素和js生成添加的成员都使用该方法添加
        const itemLimit = this.container.itemLimit    // Container所有Item的限制信息
        const eventManager = this.container.eventManager
        if (itemLimit.minW > item.pos.w) eventManager._error_('itemLimitError', `itemLimit配置指定minW为:${itemLimit.minW},当前w为${item.pos.w}`, item, item)
        else if (itemLimit.maxW < item.pos.w) eventManager._error_('itemLimitError', `itemLimit配置指定maxW为:${itemLimit.maxW},当前w为${item.pos.w}`, item, item)
        else if (itemLimit.minH > item.pos.h) eventManager._error_('itemLimitError', `itemLimit配置指定minH为:${itemLimit.minH},当前h为${item.pos.h}`, item, item)
        else if (itemLimit.maxH < item.pos.h) eventManager._error_('itemLimitError', `itemLimit配置指定maxH为:${itemLimit.maxH},当前h为${item.pos.h}`, item, item)
        else {
            item.pos.i = item.i = this.__temp__.staticIndexCount++
            // console.log(item.pos.autoOnce );
            if (!this.container._mounted || this.container.responsive) item.pos.autoOnce = true   // 所有响应式都自动排列
            else if (!this.container.responsive) {
                if (!item._mounted && item.pos.autoOnce === null) item.pos.autoOnce = true  // 静态且未挂载状态的话自动排列

            }

            const success = this.push(item)
            if (success) {
                // console.log(11111111111111111);
                eventManager._callback_('addItemSuccess', item)
            } else {
                if (!this.container.responsive) eventManager._error_('ContainerOverflowError',
                    "getErrAttr=>[name|message] 容器溢出，只有静态模式下会出现此错误,您可以使用error事件函数接收该错误，" +
                    "那么该错误就不会抛出而是将错误传到error事件函数的第二个形参"
                    , item, item)
            }
            return success ? item : null  //  添加成功返回该Item，添加失败返回null
        }
        return null
    }

    /** 对要添加进items的对象进行检测，超出矩阵范围会被抛弃，如果在矩阵范围内会根据要添加对象的pos自动排序找到位置(左上角先行后列优先顺序) */
    push(item) {
        // console.log(item.pos);
        const realLayoutPos = this._isCanAddItemToContainer_(item, item.pos.autoOnce, true)
        // console.log(realLayoutPos);
        let success = false
        if (realLayoutPos) {
            // 用于自动排列Item在this.Items中的顺序，排序的结果和传入pos或者data的结果布局是一致的，
            // 同时用于解决大的Item成员在接近右侧容器边界index本是靠前却被挤压到下一行，而index比该大容器大的却布局在大Item上方，
            // 该函数下方逻辑便能解决这个问题，最终两个Item用于布局的结果是完全一样的
            if (this.items.length <= 1) {
                this.items.push(item)
                success = true
            } else {
                let nextIndexItem, nowIndexItem
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items.length > i) {
                        nowIndexItem = this.items[i]
                        nextIndexItem = this.items[i + 1]
                    }
                    if (nextIndexItem) {
                        const nowPos = nowIndexItem.pos
                        const nextPos = nextIndexItem.pos
                        if (nowPos.y <= realLayoutPos.y && nextPos.y > realLayoutPos.y) {
                            this.insert(item, i + 1)
                            success = true
                            break
                        }
                    } else {
                        this.items.push(item)
                        success = true
                        break
                    }
                }
            }
        }
        return success
    }

    /** 已经挂载后的情况下重新排列响应式Item的顺序，排序后的布局和原本的布局是一样的，只是顺序可能有变化，在拖动交换的时候不会出错
     *  原理是通过遍历当前网页内Container对应的矩阵点(point),先行后列遍历,记录下所遍历到的顺序，该顺序的布局是和原本的item列表一样的
     *  只是在Item调用engine.move时可能因为右边过宽的Item被挤压到下一行，后面的小Item会被补位到上一行，
     *  这种情况其实大Item的index顺序是在小Item前面的，但是通过move函数交换可能会出错
     * */
    sortResponsiveItem() {
        const items = []
        for (let y = 1; y <= this.container.row; y++) {
            for (let x = 1; x <= this.container.col; x++) {
                for (let index = 0; index < this.items.length; index++) {
                    const item = this.items[index]
                    if (item.pos.x === x && item.pos.y === y) {
                        items.push(item)
                        break
                    }
                }
            }
        }
        this.items = items
    }


    /** 移除某个存在的item */
    removeItem(item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) this.items.splice(i, 1);
        }
    }

    reset() {
        this.layoutManager.reset()
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

    /** 在挂载后为自身Container中的this.items重新编号 */
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
        itemOption.resize = Boolean(itemOption.resize)
        itemOption.draggable = Boolean(itemOption.draggable)
        itemOption.close = Boolean(itemOption.close)
        //-----------------------------------------------------------//
        itemOption.i = this.len()  // 为item自动编号，动态值，决定因素是原始html元素加上后面添加的item
        return new Item(itemOption)
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
     *  @param addSeat {Boolean}  检测的时候是否为矩阵中添加占位同时修改Item中的pos
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
                item.pos = new ItemPos(merge(this._genItemPosArg(item), realLayoutPos))
                item.pos.nextStaticPos = null
                item.pos.autoOnce = false
            }
            return realLayoutPos
        } else {
            return null
        }
    }


    /**  根据是否响应式布局或者静态布局更新容器内的Item布局
     *  items是指定要更新的几个Item，否则更新全部 ignoreList暂时未支持
     *  @param items {Array || Boolean} Array: 要更新的对应Item ，Array方案正常用于静态模式，
     *                                          响应式也能指定更新，用于静态优先更新(将传入的Item作为静态Item进行占位)
     *                                  Boolean: 参数为true 传入true的话不管静态还是响应式强制刷新该容器的布局
     *                                  不传值(默认null): 静态模式不进行更新，响应式模式进行全部更新
     *  @param ignoreList {Array} 暂未支持  TODO 更新时忽略的Item列表，计划只对静态模式生效
     * */
    updateLayout(items = null, ignoreList = []) {
        //更新响应式布局
        if (this.container.responsive) {
            this.reset()
            this._sync()
            this.renumber()
            let updateItemList = items
            if (items === true || updateItemList === null) updateItemList = []
            items = this.items
            updateItemList = updateItemList.filter(item => items.includes(item))
            // console.log(items.length, updateItemList);
            const updateResponsiveItemLayout = (item) => {
                const realPos = this._isCanAddItemToContainer_(item, item.autoOnce, true)
                if (realPos) {
                    item.updateItemLayout()
                }
            }
            updateItemList.forEach((item) => {   // 1.先对要进行更新成员占指定静态位
                item.autoOnce = false
                updateResponsiveItemLayout(item)
            })

            items.forEach(item => {   // 2。再对剩余成员按顺序找位置坐下
                if (updateItemList.includes(item)) return
                item.autoOnce = true
                updateResponsiveItemLayout(item)
            })
            // console.log(items);
            // for (let i = 0; i < this.layoutManager._layoutMatrix.length; i++) {
            //     console.log(this.layoutManager._layoutMatrix[i]);
            // }
            // console.log('-----------------------------------------');
            this.autoSetColAndRows(this.container)  // 对响应式经过算法计算后的最新矩阵尺寸进行调整
        } else if (!this.container.responsive) {
            //更新静态布局
            let updateItemList = []
            if (items === null) updateItemList = []
            else if (Array.isArray(items)) updateItemList = items
            else if (items !== true && updateItemList.length === 0) return
            this.reset()
            this._sync()
            this.renumber()
            items = this.items
            updateItemList = updateItemList.filter(item => items.includes(item))
            this._sync()
            //----------------------------------------------------//
            const updateStaticItemLayout = (item) => {
                this._isCanAddItemToContainer_(item, false, true)
                item.updateItemLayout()
            }
            items.forEach(item => {  // 1.先把不进行改变的成员占位
                if (updateItemList.includes(item)) return   //  后面处理
                updateStaticItemLayout(item)
            })
            updateItemList.forEach((item) => {  // 2。再对要进行更新的Item进行查询和改变位置
                updateStaticItemLayout(item)
            })
        }
        this.container.updateContainerStyleSize()
        const genBeforeSize = (container) => {
            return {
                row: container.row,
                col: container.col,
                containerW: container.containerW,
                containerH: container.containerH,
                width: container.nowWidth(),
                height: container.nowHeight()
            }
        }
        const container = this.container
        if (!container.__ownTemp__.beforeContainerSizeInfo) {
            container.__ownTemp__.beforeContainerSizeInfo = genBeforeSize(container)
        } else {
            const beforeSize = container.__ownTemp__.beforeContainerSizeInfo
            if (beforeSize.containerW !== container.containerW || beforeSize.containerH !== container.containerH) {
                const nowSize = genBeforeSize(container)
                container.__ownTemp__.beforeContainerSizeInfo = genBeforeSize(container)
                this.container.eventManager._callback_('containerSizeChange', beforeSize, nowSize, container)
            }
        }


        // const isDebugger = false
        // if (isDebugger) {
        //     for (let i = 0; i < this.layoutManager._layoutMatrix.length; i++) {
        //         console.log(this.layoutManager._layoutMatrix[i]);
        //     }
        //     console.log('-----------------------------------------');
        // }
    }

    _genItemPosArg(item) {
        item.pos.i = item.i
        item.pos.col = (() => this.container.col)()
        item.pos.row = (() => this.container.row)()
        return item.pos
    }

}
