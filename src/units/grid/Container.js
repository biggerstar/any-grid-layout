import Sync from "@/units/grid/other/Sync.js";
import Item from "@/units/grid/Item.js";
import DomFunctionImpl from "@/units/grid/DomFunctionImpl.js";
import Engine from "@/units/grid/Engine.js";
import TempStore from "@/units/grid/other/TempStore.js";
import {defaultStyle} from "@/units/grid/style/defaultStyle.js";
import EditEvent from '@/units/grid/other/EditEvent.js'
import ItemPos from '@/units/grid/ItemPos.js'
import EventCallBack from "@/units/grid/other/EventCallBack.js";


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
 * */
export default class Container extends DomFunctionImpl {
    //----------------内部需要的参数---------------------//
    option = {}
    element = null
    classList = []
    attr = []
    engine = []
    mode = 'pseudoStatic'  //  优先级:  pseudoStatic(伪静态= 响应式 + 静态) > responsive(响应式)  > static(全静态)
    px = null
    // a = {xl: 1920, lg: 1200, md: 992, sm: 768, xs: 480, xxs: 0}
    // _defaultStaticColNum = {xl: 12, lg: 10, md: 8, sm: 6, xs: 4, xxs: 0}
    useLayout = {}   //  当前使用的布局方案配置
    childContainer = [] // 所有该Container的直接子嵌套容器
    isNesting = false    // 该Container自身是否[被]嵌套
    parentItem = null
    //----------------外部传进的的参数---------------------//
    responsive = false     //  responsive:  默认为static静态布局,值等于true为响应式布局
    responseMode = 'exchange'  //  exchange(默认) || stream
    // static = false
    layout = []    //  其中的px字段表示 XXX 像素以下执行指定布局方案
    col = null
    row = null    //  当前自动 暂未支持固定
    margin = [null, null]
    marginX = null
    marginY = null
    size = [null, null]   //size[1]如果不传入的话长度将和size[1]一样
    sizeWidth = null
    sizeHeight = null
    minCol = null
    maxCol = null
    minRow = null  // 最小行数 只是容器高度，未和布局算法挂钩
    maxRow = null  // 最大行数 只是容器高度，未和布局算法挂钩
    ratio = 0.1    // 只有col的情况下(margin和size都没有指定)margin和size自动分配margin/size的比例 1:1 ratio值为1
    data = []  // 传入后就不会再变，等于备份原数据
    global = {}
    event = {}
    sensitivity = 0.8   //  拖拽移动的灵敏度，表示每秒移动X像素触发交换检测,这里默认每秒36px   ## 不稳定性高，自用
    style = defaultStyle.containerStyleConfigField   //  可以外部传入直接替换
    nestedOutExchange = false   //  如果是嵌套页面，从嵌套页面里面拖动出来Item是否立即允许该被嵌套的容器参与响应布局,true是允许，false是不允许,参数给被嵌套容器
    itemConfig = {} // 单位栅格倍数{minW,maxW,minH,maxH} ,接受的Item大小限制,同样适用于嵌套Item交换通信,建议最好在外部限制
    exchange = false
    //----------------保持状态所用参数---------------------//
    _mounted = false
    __store__ = TempStore.containerStore
    __ownTemp__ = {
        //----------只读变量-----------//
        exchangeLock: false,
        firstInitColNum: null,
        firstEnterLock: true,
        beforeOverItem: [],  // 保存响应式模式下开始拖拽后经过的Item,最多保存20个
        moveCount: 0,
        containerViewWidth: null,   //  container视图第一次加载时候所占用的像素宽度
        //-----内部可写外部只读变量------//
        offsetPageX: 0,        // 容器距离浏览器可视区域左边的距离
        offsetPageY: 0,       //  容器距离浏览器可视区域上边的距离
        //----------可写变量-----------//
    }

    constructor(option) {
        super()
        if (option.el === null) new Error('请指定需要绑定的el,是一个id或者class值或者原生的element')
        this.el = option.el
        this.engine = new Engine(option)
        this.engine.setContainer(this)
        this.event = new EventCallBack(option.event)
        if (option.itemConfig) this.itemConfig = new ItemPos(option.itemConfig)  // 这里的ItemPos不是真的pos，只是懒，用写好的来校验而已
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


    /** 在页面上添加一行的空间 */
    addRowSpace(num = 1) {
        this.row += num
        this.updateStyle(this.genContainerStyle())
    }

    /** 在页面上删除一行的空间 */
    removeRowSpace(num = 1) {
        this.row = this.row = num
        if (this.row < 0) throw new Error('行数不应该小于0，请设置一个大于0的值')
        this.updateStyle(this.genContainerStyle())
    }

    /**
     * el 参数可以传入一个具名ID  或者一个原生的 Element 对象
     * 直接渲染Container到实例化传入的所指 ID 元素中, 将实例化时候传入的 data 数据渲染出来，
     * 如果实例化不传入 data 可以在后面自行创建item之后手动渲染
     * */
    mount() {
        if (this._mounted) return
        if (this.el instanceof Element) this.element = this.el
        Sync.run(() => {
            if (this.element === null) {
                this.element = document.querySelector(this.el)
                if (this.element === null) throw new Error('未找到指定ID:' + this.el + '元素')
            }
            this.updateStyle(defaultStyle.containerDefaults) // 必须在engine.init之前
            this.engine.init()   //  初始化后就能找到用户指定的 this.useLayout
            if (!this.responsive && (!this.col || !this.row || (!this.sizeWidth && !this.size[0]))) {
                throw new Error('使用静态布局col,row,和sizeWidth必须都指定值,sizeWidth等价于size[0]')
            }
            if (!this.element.clientWidth) throw new Error('您应该为Container指定一个宽度，响应式布局使用指定动态宽度，静态布局可以直接设定固定宽度')
            this.classList = Array.from(this.element.classList)
            this.attr = Array.from(this.element.attributes)
            // console.log(this.engine.data);
            this._childCollect()
            this.engine.initItems()
            // console.log(this.engine.items);
            this.engine.mountAll()
            this.updateLayout()
            this._isNestingContainer_()
            this.updateStyle(this.genContainerStyle())
            this.element._gridContainer_ = this
            this.element._isGridContainer_ = true
            this.__ownTemp__.firstInitColNum = this.col
            this.__store__.screenWidth = window.screen.width
            this.__store__.screenHeight = window.screen.height
            this.__ownTemp__.containerViewWidth = this.element.clientWidth
            const containerPosInfo = this.element.getBoundingClientRect()
            this.__ownTemp__.offsetAbsolutePageLeft = containerPosInfo.left
            this.__ownTemp__.offsetAbsolutePageTop = containerPosInfo.top
            this.responsiveLayout()
            this._mounted = true
        })
    }

    _isNestingContainer_(element = null) {
        element = element ? element : this.element
        if (!element) return
        while (true) {
            if (element.parentElement === null) {    // 父元素往body方向遍历上去为null表示该Container是第一层
                this.__ownTemp__.offsetPageX = this.element.offsetLeft
                this.__ownTemp__.offsetPageY = this.element.offsetTop
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
                upperItem.updateStyle({
                    overflow: 'scroll'
                })
                break
            }
        }
    }

    /** 将item成员从Container中全部移除  */
    unmount() {
        this.engine.unmount()
        this._mounted = false
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
    updateLayout(items = [], ignoreList = []) {
        this.engine.updateLayout(items, ignoreList)
    }

    /** 是否开启所有Item位置或大小变化的过渡动画
     *  @param {Number|Object|Boolean} transition Item移动或者大小癌变要进行变化过渡的时间，单位ms,可以传入true使用默认时间180ms,或者传入false关闭动画
     *  @param {String} fieldString 要进行变化的CSS属性字段，使用逗号
     * */
    animation(transition = true, fieldString = null) {
        Sync.run(() => {
            if (!this._mounted) {
                console.error('animation函数执行错误,Container未挂载', this)
                return
            }
            this.engine.items.forEach((item) => item.animation(transition, fieldString))
        })
    }

    /**  开启响应式布局 ，  非静态自动补全前面的空位，紧凑布局   */
    responsiveLayout() {
        this.mode = "responsive"
        this.engine.responsive()
        window.addEventListener('resize', (ev) => {
            // this.engine.setColNum()
            const browserViewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            // let browserViewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight


            // containerViewWidth
            const newContainerWidth = Math.round(this.__ownTemp__.containerViewWidth * (browserViewWidth / this.__store__.screenWidth))

            // let gridColNum = Math.floor( newContainerWidth / (this.size[0] + this.margin[0]))
            // let gridColNum = Math.round(this.__ownTemp__.firstInitColNum * (browserViewWidth / this.__store__.screenWidth))

            console.log(newContainerWidth);
            // console.log(gridColNum, '    ')
            // this.setColNum(gridColNum)
            // this.updateStyle({
            //     width: this.nowWidth() + 'px'
            // })

            // this.updateLayout(this.genContainerStyle())
            //
            this.engine._syncLayoutConfig(this.engine.layoutConfig.genLayoutConfig(newContainerWidth))
            // this.engine.updateLayout()


        })


        Sync.run({
            func: () => {

            },
            rule: () => this.element !== null
        })
    }

    /**  开启伪静态布局, 静态 + 响应式    */
    pseudoStaticLayout() {

    }

    /**  开启全静态布局 */
    staticLayout() {
        this.mode = "static"
        this.engine.static()
    }


    /** 为dom添加新成员
     * @param { Object || Item } item 可以是一个Item实例类或者一个配置对象
     * item : {
     *      el : 传入一个已经存在的 element
     *      w : 指定宽 栅格倍数,
     *      h : 指定高 栅格倍数
     *      ......
     *      }
     * */
    add(item) {
        item.container = this
        item.parentElement = this.element
        if (!(item instanceof Item)) item = this.engine.createItem(item)
        this.engine.addItem(item)
        return item
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
        // console.log(this.row, this.maxRow, this.maxRow || this.row);
        const containerStyle = {
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
        return containerStyle
    }

    /** 开启编辑模式,只能单独调用该函数开启，不允许实例化传入
     *  @param {Object} editOption 包含 draggable(Boolean)  resize(Boolean) 表示开启或关闭哪个功能,
     *                              调用该函数不传参或者传入布尔值 true表示draggable和 resize 全部开启
     *                              传入 布尔值 false 表示全部关闭
     * */
    edit(editOption = {}) {
        // console.log(editOption);
        Sync.run(() => {
            if (!this._mounted) {
                console.error('edit函数执行错误Container未挂载', this)
                return
            }
            if (typeof editOption === 'object') {
                if (Object.keys(editOption).length === 0) editOption = true
            }
            if (editOption === false) {
                editOption = {draggable: false, resize: false}
            } else if (editOption === true) {
                editOption = {draggable: true, resize: true}
            }
            if (editOption.draggable || editOption.resize) {
                EditEvent.startEvent(this)
            } else {
                EditEvent.removeEvent(this)
            }
            this.engine.items.forEach((item) => item.edit(editOption))
        })
    }


    /** 获取现在的Container宽度，只涉及浏览器渲染后的视图宽度，未和布局算法挂钩  */
    nowWidth = () => {
        let marginWidth = 0
        let nowCol = this.col
        // if (this.maxCol !== null && this.col > this.maxCol) nowCol = this.maxCol
        // if (this.minCol !== null && this.col < this.minCol) nowCol = this.minCol
        if ((nowCol) > 1) marginWidth = (nowCol - 1) * this.margin[0]
        // console.log(this.col * this.size[0] + marginWidth)
        return ((nowCol) * this.size[0]) + marginWidth || 0
    }

    /** 获取现在的Container高度,只涉及浏览器渲染后的视图高度，未和布局算法挂钩  */
    nowHeight = () => {
        let marginHeight = 0
        let nowRow = this.row
        // if (this.maxRow !== null && this.row > this.maxRow) nowRow = this.maxRow
        // if (this.minRow !== null && this.row < this.minRow) nowRow = this.minRow
        if ((nowRow) > 1) marginHeight = (nowRow - 1) * this.margin[1]
        // console.log(this.row * this.size[1] + marginHeight)
        // console.log(this.row);
        return ((nowRow) * this.size[1]) + marginHeight || 0
    }

    /** 将用户HTML原始文档中的Container根元素的直接儿子元素收集起来并转成Item收集在this.item中，
     * 并将其渲染到DOM中   */
    _childCollect() {
        Array.from(this.element.children).forEach((node, index) => {
            let posData = Object.assign({}, node.dataset)
            // console.log(posData);
            const item = this.add({el: node, ...posData})
            item.name = item.getAttr('name')  //  开发者直接在元素标签上使用name作为名称，后续便能直接通过该名字找到对应的Item
        })
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
            item.updateStyle({
                backgroundColor: 'yellow',
                placeContent: 'center'
            })
        }
    }

    testUnmount() {
        this.engine.getItemList().forEach((item, index) => {
            item.mount()
            setTimeout(() => {
                item.unmount()
            }, index * 1000)
        })
    }
}

