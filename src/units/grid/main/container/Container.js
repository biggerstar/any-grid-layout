import Sync from "@/units/grid/other/Sync.js";
import Item from "@/units/grid/main/item/Item.js";
import DomFunctionImpl from "@/units/grid/other/DomFunctionImpl.js";
import Engine from "@/units/grid/main/Engine.js";
import TempStore from "@/units/grid/other/TempStore.js";
import {defaultStyle} from "@/units/grid/default/style/defaultStyle.js";
import ItemPos from '@/units/grid/main/item/ItemPos.js'
import EventCallBack from "@/units/grid/events/EventCallBack.js";
import LayoutInstantiationField from "@/units/grid/main/container/LayoutInstantiationField.js";
import {throttle} from "@/units/grid/other/tool.js";
import ResizeObserver from '@/units/grid/modules/resize-observer-polyfill/ResizeObserver.es';


//---------------------------------------------------------------------------------------------//
const tempStore = TempStore.store
//---------------------------------------------------------------------------------------------//

/** 栅格容器, 所有对DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 *  Container中所有对外部可以设置的属性都是在不同的布局方案下全局生效，如若有设定layout布局数组或者单对象的情况下,
 *  该数组内的配置信息设置优先于Container中设定的全局设置，比如 实例化传进
 *  {
 *    col: 8,
 *    size:[80,80],
 *    layout:[{
 *          px:1024,
 *          size:[100,100]
 *        },
 *    .............
 *    ]}
 *    此时该col生效数值是8，来自全局设置属性，size的生效值是[100,100],来自layout中指定的局部属性
 *    注：
 *    1.暂不支持iframe嵌套
 *    2.使用原生js开发的时候如果首屏加载网页中元素会一闪而过或者布局错误然后才生成网格布局,出现这种情况可以对Container挂载的那个元素点进行display:'none',
 *      框架处理会自动显示出来，出现这个的原因是因为html加载渲染比js对dom的渲染快
 * */
export default class Container extends DomFunctionImpl {
    //----------实例化传进的的参数(次级配置信息)-----------//
    // 相关字段在ContainerInitConfig类中,实例化的时候会进行合并到此类.次级的意思是实例化对象的配置信息深度为二以下的其他字段
    //---------实例化传进的的特殊参数(一级配置信息)---------//
    // 一级配置信息的意思是实例化对象的配置信息第一层的字段
    el = ''
    parent = null  // 嵌套情况下上级Container
    platform = 'native'   //  native(默认原生js) || vue || react(计划)
    layouts = []  //  其中的px字段表示 XXX 像素以下执行指定布局方案
    events = []
    global = {}
    //----------------内部需要的参数---------------------//
    element = null       //  container主体元素节点
    contentElement = null   // 放置Item的元素节点，被element直接包裹
    classList = []
    attr = []
    engine = []
    px = null
    useLayout = {}   //  当前使用的布局方案配置
    childContainer = [] // 所有该Container的直接子嵌套容器
    isNesting = false    // 该Container自身是否[被]嵌套
    parentItem = null
    containerH = null
    containerW = null
    eventManager = null    // events通过封装构建的类实例
    //----------------保持状态所用参数---------------------//
    _VueEvents = {}
    _mounted = false
    __store__ = tempStore
    __ownTemp__ = {
        //-----内部可写外部只读变量------//
        exchangeLock: false,
        firstInitColNum: null,
        firstEnterUnLock: false,   //  第一次进入的权限是否解锁
        moveExchangeLock: false,
        beforeOverItems: [],  // 保存响应式模式下开始拖拽后经过的Item,最多保存20个
        moveCount: 0,
        offsetPageX: 0,        // 容器距离浏览器可视区域左边的距离
        offsetPageY: 0,       //  容器距离浏览器可视区域上边的距离
        exchangeLockX: false,  // 锁定Item是否可以横向移动
        exchangeLockY: false, // 锁定Item是否可以纵向向移动
        beforeContainerSizeInfo: null,
        observer: null,
        nestingFirstMounted: false // 嵌套模式下第一次是否挂载，决定是否执行render函数
        //----------可写变量-----------//
    }

    constructor(option) {
        super()
        if (option.el === null) new Error('请指定需要绑定的el,是一个id或者class值或者原生的element')
        // 部分一级实例化参数处理
        this.el = option.el
        if (typeof option.platform === 'string') this.platform = option.platform
        Object.assign(this, new LayoutInstantiationField())
        this._define()
        this.eventManager = new EventCallBack(option.events)
        this.engine = new Engine(option)
        if (option.global) this.global = option.global
        if (option.parent) {
            this.parent = option.parent
            this.parent.childContainer.push(this)
            this.isNesting = true
        }
        this.engine.setContainer(this)
        if (option.itemLimit) this.itemLimit = new ItemPos(option.itemLimit)  // 这里的ItemPos不是真的pos，只是懒，用写好的来校验而已
    }

    _define() {
        const self = this
        let col = null
        let row = null
        Object.defineProperties(this, {
            col: {
                get: () => col,
                set: (v) => {
                    if (col === v) return
                    col = v
                }
            },
            row: {
                get: () => row,
                set: (v) => {
                    if (row === v) return
                    row = v
                }
            },
        })
    }

    /** 设置列数量,必须设置,可通过实例化参数传入而不一定使用该函数，该函数用于中途临时更换列数可用  */
    setColNum(col) {
        if (col > 30 || col < 0) {
            throw new Error('列数量只能最低为1,最高为30,如果您非要设置更高值，' +
                '请直接将值给到本类中的成员col，而不是通过该函数进行设置')
        }
        this.col = col
        this.engine.setColNum(col)
        return this
    }

    /** 设置行数量,行数非必须设置 */
    setRowNum(row) {
        this.row = row
        return this
    }

    /** 获取所有的Item，返回一个列表(数组) */
    getItemList() {
        return this.engine.getItemList()
    }


    /** 在页面上添加一行的空间,已弃用 */
    addRowSpace(num = 1) {
        this.row += num
        this.updateLayout(true)
    }

    /** 在页面上删除一行的空间，已弃用*/
    removeRowSpace(num = 1) {
        this.row = this.row - num
        if (this.row < 0) throw new Error('行数不应该小于0，请设置一个大于0的值')
        this.updateLayout(true)
    }

    genGridContainerBox = () => {
        this.contentElement = document.createElement('div')
        this.contentElement.classList.add('grid-container-area')
        this.element.appendChild(this.contentElement)
        this.updateStyle(defaultStyle.gridContainer, this.contentElement)
        this.contentElement.classList.add(this.className)
    }

    /**
     * el 参数可以传入一个具名ID  或者一个原生的 Element 对象
     * 直接渲染Container到实例化传入的所指 ID 元素中, 将实例化时候传入的 data 数据渲染出来，
     * 如果实例化不传入 data 可以在后面自行创建item之后手动渲染
     * */
    mount(mCallback) {
        if (this._mounted) return
        const _mountedFun = () => {
            //---------------------------------------------------------//
            if (this.el instanceof Element) this.element = this.el
            if (this.element === null) {
                if (!this.isNesting) this.element = document.querySelector(this.el)
                if (this.element === null) {
                    const errMsg = '在DOM中未找到指定ID对应的:' + this.el + '元素'
                    throw new Error(errMsg)
                }
            }
            this.element._gridContainer_ = this
            this.element._isGridContainer_ = true
            this.engine.init()    //  初始化后就能找到用户指定的 this.useLayout
            // this._collectNestingMountPoint()
            if (this.platform === 'vue') {
                this.contentElement = this.element.querySelector('.grid-container-area')
            } else {
                this.genGridContainerBox()
                this.updateStyle(defaultStyle.mainContainer)   // 必须在engine.init之前
            }
            // this._define()
            this.attr = Array.from(this.element.attributes)
            this.classList = Array.from(this.element.classList)
            if (this.element && this.element.clientWidth > 0) {
                this.engine._sync()
                if (!this.responsive && !this.row) {
                    throw new Error('使用静态布局row,和sizeWidth必须都指定值,sizeWidth等价于size[0],若没定义col则会自动生成')
                }
                if (!this.element.clientWidth) throw new Error('您应该为Container指定一个宽度，响应式布局使用指定动态宽度，静态布局可以直接设定固定宽度')
            }

            // this.render()
            // this.updateContainerStyleSize()  // updateLayout内已经执行
            // this._isNestingContainer_()
            this._observer_()
            this.__ownTemp__.firstInitColNum = this.col
            this.__store__.screenWidth = window.screen.width
            this.__store__.screenHeight = window.screen.height
            this._mounted = true
            this.eventManager._callback_('containerMounted', this)
            if (typeof mCallback === 'function') mCallback.bind(this)(this)
        }
        if (this.platform === 'vue') _mountedFun()
        else Sync.run(_mountedFun)
    }

    mountItems(items) {
        items.forEach(item => container.add(item))
        this.engine.mountAll()
    }

    exportData() {
        return this.engine.items.map((item) => {
            const exposeConfig = {}
            let exposePos = {}
            exposePos = item.pos.export()
            if (this.responsive) {
                delete exposePos.x
                delete exposePos.y
            }
            exposeConfig['pos'] = exposePos
            Array.from(['static', 'draggable', 'resize', 'close']).forEach((field => {
                if (item[field] !== false) exposeConfig[field] = item[field]
            }))
            Array.from(['follow', 'dragOut']).forEach((field => {
                if (item[field] !== true) exposeConfig[field] = item[field]
            }))
            //transition 特殊导出
            if (typeof item.transition === 'boolean') exposeConfig.transition = item.transition
            if (typeof item.transition === 'object') {
                if (item.transition.time !== 180 || item.transition.field !== 'top,left,width,height') {
                    exposeConfig.transition = item.transition
                }
            }
            return exposeConfig
        })
    }

    /** 渲染某一组Data */
    render(renderCallback) {
        Sync.run(() => {
            if (this.element && this.element.clientWidth <= 0) {
                return
            }
            if (typeof renderCallback === 'function') {
                // console.log(this.useLayout);
                renderCallback(this.useLayout.data || [], this.useLayout, this.element)
            }
            this.updateLayout(true)
        })
    }

    _nestingMount(ntList = null) {
        // 将收集的挂载点分配给各个Item,ntList是预挂载点列表
        ntList = ntList ? ntList : tempStore.nestingMountPointList
        for (let i = 0; i < this.engine.items.length; i++) {
            const item = this.engine.items[i]
            for (let j = 0; j < ntList.length; j++) {
                if (ntList[j].id === (item.nesting || '').replace('#', '')) {
                    let ntNode = ntList[j]
                    // console.log(11111111111111, container);
                    // console.log(ntNode);
                    ntNode = ntNode.cloneNode(true)
                    // newNode.id = ntList[j].id
                    item.element.appendChild(ntNode)
                    break
                }
            }
        }
    }

    /** 将包含Item初始化信息的对象列表转成Item集合 */
    toItemList(data) {
        return data.map(pos => this.engine.createItem(pos))
    }


    /** 将item成员从Container中全部移除
     * @param {Boolean} isForce 是否移除element元素的同时移除掉现有加载的items列表中的对应item
     * */
    unmount(isForce = false) {
        this.engine.unmount(isForce)
        this._mounted = false
        this._disconnect_()
        this.eventManager._callback_('containerUnmounted', this)
    }

    /** 将item成员从Container中全部移除，之后重新渲染  */
    remount() {
        this.engine.remount()
    }

    remove(removeItem) {
        this.engine.items.forEach((item) => {
            if (removeItem === item) item.remove()
        })
    }

    /** 以现有所有的Item pos信息更新Container中的全部Item布局，可以用于对某个单Item做修改后重新规划更新布局  */
    updateLayout(items = null, ignoreList = []) {
        this.engine.updateLayout(items, ignoreList)
    }

    _disconnect_() {
        this.__ownTemp__.observer.disconnect()
    }

    _observer_() {
        this.__ownTemp__.observer = new ResizeObserver(throttle(() => {
            if (!this._mounted) return
            const containerWidth = this.element.clientWidth
            if (containerWidth <= 0) return
            let useLayout = this.engine.layoutConfig.genLayoutConfig(containerWidth)
            let {useLayoutConfig, currentLayout, layout} = useLayout
            let fullUseLayoutConfig = new LayoutInstantiationField(useLayoutConfig)
            const res = this.eventManager._callback_('mountPointElementResizing', useLayoutConfig, containerWidth, this.container)

            if (res === null || res === false) return
            if (typeof res === 'object') useLayoutConfig = res

            // console.log(useLayoutConfig);
            // console.log(this.px, useLayoutConfig.px);

            if (this.px && useLayoutConfig.px) {
                if (this.px !== useLayoutConfig.px) {
                    // console.log(this.px, useLayoutConfig.px);
                    if (this.platform !== 'vue') {
                        // vue中的Item是由vue自己管理，这边不参与，该注释段落保留后面可能有用
                        // this.engine.unmount(false)
                        // this.engine.clear()
                        // this.engine._syncLayoutConfig(fullUseLayoutConfig)
                        // this.render()
                    }
                    this.eventManager._callback_('useLayoutChange', currentLayout, containerWidth, this.container)
                    this._VueEvents.vueUseLayoutChange(useLayout)
                } else {
                    this.engine._syncLayoutConfig(fullUseLayoutConfig)
                }
                this.engine.updateLayout(true)
            }
        }, this.resizeReactionDelay))
        this.__ownTemp__.observer.observe(this.element)
    }


    /** 检查当前布局下指定Item是否能添加进Container，如果不行返回null，如果可以返回该Item可以添加的位置信息
     * @param {Item} item 想要检查的Item信息
     * @param {Boolean} responsive 是否响应式检查，如果是响应式自动返回可以添加的位置，如果是静态则确定该Item指定的位置是否被占用
     *  */
    isBlank(item, responsive) {
        return this.engine._isCanAddItemToContainer_(item, responsive)
    }

    /** 为dom添加新成员
     * @param { Object || Item } item 可以是一个Item实例类或者一个配置对象
     * @return {Item|| NonNullable}  添加成功返回该添加创建的Item，添加失败返回null
     * item : {
     *      el : 传入一个已经存在的 element
     *      w : 指定宽 栅格倍数,
     *      h : 指定高 栅格倍数
     *      ......
     *      }
     * */
    add(item) {
        // console.log(item.autoOnce);
        item.container = this
        item.parentElement = this.contentElement
        if (!(item instanceof Item)) item = this.engine.createItem(item)
        return this.engine.addItem(item)
    }

    /** 使用css class 或者 Item的对应name, 或者 Element元素 找到该对应的Item，并返回所有符合条件的Item
     * name的值在创建 Item的时候可以传入 或者直接在标签属性上使用name键值，在这边也能获取到
     * @param { String,Element } nameOrClassOrElement  宽度 高度 是栅格的倍数
     * @return {Array} 所有符合条件的Item
     * */
    find(nameOrClassOrElement) {
        return this.engine.findItem(nameOrClassOrElement)
    }


    /** 生成该栅格容器布局样式  */
    genContainerStyle = () => {
        return {
            width: this.nowWidth() + 'px',
            height: this.nowHeight() + 'px',
        }
        // containerStyle.overflowX = this.col > (this.maxCol || this.col) ? 'scroll' : 'hidden'
        // containerStyle.overflowY = this.row > (this.maxRow || this.row) ? 'scroll' : 'hidden'

        // return {
        //     // gridTemplateColumns: `repeat(${this.col},${this.size[0]}px)`,
        //     // gridTemplateRows: `repeat(${this.row},${this.size[1]}px)`,
        //     // gridAutoRows: `${this.size[1]}px`,
        //     // gap: `${this.margin[0]}px ${this.margin[1]}px`,
        //     // display: 'block',
        //
        // }
    }

    /** 获取现在的Container宽度，只涉及浏览器渲染后的视图宽度，未和布局算法挂钩  */
    nowWidth = () => {
        let marginWidth = 0
        let nowCol = this.containerW
        if ((nowCol) > 1) marginWidth = (nowCol - 1) * this.margin[0]
        return ((nowCol) * this.size[0]) + marginWidth || 0
    }

    /** 获取现在的Container高度,只涉及浏览器渲染后的视图高度，未和布局算法挂钩  */
    nowHeight = () => {
        let marginHeight = 0
        let nowRow = this.containerH
        if ((nowRow) > 1) marginHeight = (nowRow - 1) * this.margin[1]
        return ((nowRow) * this.size[1]) + marginHeight || 0
    }

    updateContainerStyleSize() {
        this.updateStyle(this.genContainerStyle(), this.contentElement)
    }

    /** 根据挂载在实例上的containerW和containerH的值自动根据大小对Container进行更新 */
    _collectNestingMountPoint() {
        for (let i = 0; i < this.element.children.length; i++) {
            if (tempStore.nestingMountPointList.includes(this.element.children[i])) continue
            tempStore.nestingMountPointList.push(document.adoptNode(this.element.children[i]))
        }

    }

    /** 确定该Item是否是嵌套Item，并将其保存到相关配置的字段 */
    _isNestingContainer_(element = null) {
        element = element ? element : this.contentElement
        if (!element) return
        while (true) {
            if (element.parentElement === null) {    // 父元素往body方向遍历上去为null表示该Container是第一层
                this.__ownTemp__.offsetPageX = this.contentElement.offsetLeft
                this.__ownTemp__.offsetPageY = this.contentElement.offsetTop
                break
            }
            element = element.parentElement    //  不是null在链中往上取父元素
            if (element._isGridItem_) {      //  上级是Item表示是嵌套的， 父元素是Container元素执行自身offset加上父元素offset
                const upperItem = element._gridItem_
                this.__ownTemp__.offsetPageX = upperItem.element.offsetLeft + upperItem.container.__ownTemp__.offsetPageX
                this.__ownTemp__.offsetPageY = upperItem.element.offsetTop + upperItem.container.__ownTemp__.offsetPageY
                element._gridItem_.container.childContainer.push({
                    parent: element._gridItem_.container,
                    container: this,
                    nestingItem: element._gridItem_
                })
                this.isNesting = true
                this.parentItem = upperItem
                break
            }
        }
    }

    /** 将用户HTML原始文档中的Container根元素的直接儿子元素收集起来并转成Item收集在this.item中，
     * 并将其渲染到DOM中  (弃用，不使用网页收集)  */
    _childCollect() {
        const items = []
        Array.from(this.contentElement.children).forEach((node, index) => {
            let posData = Object.assign({}, node.dataset)
            // console.log(posData);
            const item = this.add({el: node, ...posData})
            if (item) item.name = item.getAttr('name')  //  开发者直接在元素标签上使用name作为名称，后续便能直接通过该名字找到对应的Item
            items.push(items)
        })
        return items
    }


    test() {
        this.margin = [10, 10]
        this.mount()
        for (let i = 0; i < 20; i++) {
            let item = this.add({
                w: Math.ceil(Math.random() * 2),
                h: Math.ceil(Math.random() * 2)
            })
            item.mount()
        }
    }

    testUnmount() {
        this.engine.getItemList().forEach((item, index) => {
            item.mount()
            const timer = setTimeout(() => {
                item.unmount()
                clearTimeout(timer)
            }, index * 1000)
        })
    }
}

