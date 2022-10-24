import Sync from "@/units/grid/other/Sync.js";
import Item from "@/units/grid/Item.js";
import {merge, throttle} from "@/units/grid/other/tool.js";
import DomFunctionImpl from "@/units/grid/DomFunctionImpl.js";
import Engine from "@/units/grid/Engine.js";
import {layoutConfig} from "@/units/grid/defaultLayoutConfig.js";

const defaultStyle = {
    // minWidth: '100px',
    // minHeight: '100px',   // 建议和下面size[1] 值一样
    height:'auto',
    // width:'100%',
    display: 'block',
    boxSizing: 'border-box',
    backgroundColor: '#2196F3',
    position: 'relative',
    // cursor: 'grab',
}

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
 *    ]}
 *    此时该col生效数值是8，来自全局设置属性，size的生效值是[100,100],来自layout中指定的局部属性
 * */
export default class Container extends DomFunctionImpl {
    //----------------内部需要的参数---------------------//
    id = ''
    option = {}
    element = null
    classList = []
    attr = []
    engine = []
    mode = 'pseudoStatic'  //  优先级:  pseudoStatic(伪静态= 响应式 + 静态) > responsive(响应式)  > static(全静态)
    px = null
    // a = {xl: 1920, lg: 1200, md: 992, sm: 768, xs: 480, xxs: 0}
    // _defaultStaticColNum = {xl: 12, lg: 10, md: 8, sm: 6, xs: 4, xxs: 0}
    useLayout = { }   //  当前使用的布局方案配置
    //----------------外部传进的的参数---------------------//
    responsive = true
    static = true
    layout = []    //  其中的px字段表示 XXX 像素以下执行指定布局方案
    transition = true  //  是否开启过渡动画
    col = null
    row = null    //  当前自动 暂未支持固定
    minRow = null  // 最小行数 暂未支持
    margin = [null, null]
    marginX = null
    marginY = null
    size = [null, null]
    sizeWidth = null
    sizeHeight = null
    minCol = null
    maxCol = null
    ratio = 0.1    // 只有col的情况下margin和size自动分配margin/size的比例 1:1 ratio值为1
    data = []  // 传入后就不会再变，等于备份原数据
    isEdit = false       //  是否是编辑模式
    global = {}
    style = {
        opacity: '0.8',
        transform: 'scale(1.1)',
    }
    //----------------保持状态所用参数---------------------//
    _mounted = false
    __temp__ = {
        //----------只读变量-----------//
        screenWidth: null,  // 用户屏幕宽度
        screenHeight: null,  // 用户屏幕高度
        firstInitColNum: null,
        containerViewWidth: null,   //  container视图第一次加载时候所占用的像素宽度
        //----------可写变量-----------//
        _isItemsDraggable: false,
        _isItemsResize: false,
        _mouseInContainerOuter: false,
        isLeftMousedown: false,
        isMousePointInContainer: false,
        fromItemExchangeIndex:null,  // 用户拖动交换保留最新的索引，在鼠标抬起进行最终交换
        fromItem: null,    // 表示在Container中的鼠标初次按下未抬起的Item, 除Item类型外的元素不会被赋值到这里
        toItem: null,      // 表示在Container中的鼠标按下后抬起的正下方位置的Item, 除Item类型外的元素不会被赋值到这里
        cloneElement: null,      // 表示在用户拖动点击拖动的瞬间克隆出来的文档
        mousedownEvent: null, // 鼠标第一次点击event对象
        dragOrResize: null,  //  drag || resize
        isDragging: false,
        isResizing: false,
        resizeWidth: 0,
        resizeHeight: 0,
    }

    constructor(option) {
        super()
        if (option.el === null) new Error('请指定需要绑定的el,是一个id值或者原生的element')
        this.el = option.el
        this.option = option
        this.engine = new Engine(option)
        this.engine.setContainer(this)
        // this._layoutInit()
        // this.mode === 'static' ? this.staticLayout() : this.responsiveLayout()
    }


    _layoutInit() {
        // static [size,margin]
        let aa = {
            px: 1920,
            mode: 'static',
            keep: ['col', 'size', 'margin'],
            col: 12,
            size: [80, 80],
            margin: [10, 10],
            // data:[]
        }
        let layout = null
        //  有响应式优先都是使用像素布局
        if (this.responsive && this.static) {   //  两者为 true 或者都不传或者都为false的时候使用默认的布局模式 pseudoStatic
            this.mode = 'pseudoStatic'
            if (this.layout === null || Object.keys(this.layout).length === 0) {
                layout = this._defaultResponsivePixel
            }
        } else if (this.responsive) {
            this.mode = 'responsive'
        } else if (this.static) {
            this.mode = 'static'
        }

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


    /**
     * el 参数可以传入一个具名ID  或者一个原生的 Element 对象
     * 直接渲染Container到实例化传入的所指 ID 元素中, 将实例化时候传入的 data 数据渲染出来，
     * 如果实例化不传入 data 可以在后面自行创建item之后手动渲染
     * */
    mount() {
        if (this._mounted) return
        if (this.el instanceof Element) this.element = this.el
        else if (typeof this.el === 'string') this.id = this.el
        Sync.run(() => {
            if (this.element === null){
                this.element = document.getElementById(this.id)
                if (this.element === null) throw new Error('未找到指定ID:' + this.id + '元素')
            }
            this.updateStyle(defaultStyle) // 必须在engine.init之前
            if (!this.element.clientWidth)throw new Error('您应该为Container指定一个宽度，响应式布局使用指定动态宽度，静态布局可以直接设定固定宽度')
            this.id = this.element.id
            this.classList = Array.from(this.element.classList)
            this.attr = Array.from(this.element.attributes)
            this.engine.init()
            this._childCollect()
            this.engine.initItems()
            this.engine.mountAll()
            this.transitions(this.transition)
            this.edit(this.isEdit)
            this._event()
            this.updateStyle(this.genContainerStyle())
            this._mounted = true
            this.__temp__.firstInitColNum = this.col
            this.__temp__.screenWidth = window.screen.width
            this.__temp__.screenHeight = window.screen.height
            this.__temp__.containerViewWidth = this.element.clientWidth
            this.responsiveLayout()
        })
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

    /** 以现有所有的Item pos信息更新Container中的全部Item布局，可以用于对某个单Item做修改后重新规划更新布局  */
    updateLayout() {
        this.engine.updateLayout()
    }

    /** 是否开启Item位置变化的过渡动画
     *  @param {Boolean} isTransition  是否开启动画
     * */
    transitions(isTransition = true) {
        this.transition = isTransition
        this.engine.transitions(isTransition)
    }

    gridWidthFromPixel(px) {

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
            const newContainerWidth = Math.round(this.__temp__.containerViewWidth * (browserViewWidth / this.__temp__.screenWidth))

            // let gridColNum = Math.floor( newContainerWidth / (this.size[0] + this.margin[0]))
            // let gridColNum = Math.round(this.__temp__.firstInitColNum * (browserViewWidth / this.__temp__.screenWidth))

            console.log(newContainerWidth);
            // console.log(gridColNum, '    ')
            // this.setColNum(gridColNum)
            // this.updateStyle({
            //     width: this.nowWidth() + 'px'
            // })

            // this.updateLayout(this.genContainerStyle())
            //
            this.engine._syncLayoutConfig(this.engine._genLayoutConfig(newContainerWidth))
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
        return {
            // gridTemplateColumns: `repeat(${this.col},${this.size[0]}px)`,
            // gridTemplateRows: `repeat(${this.row},${this.size[1]}px)`,
            // gridAutoRows: `${this.size[1]}px`,
            // gap: `${this.margin[0]}px ${this.margin[1]}px`,
            // display: 'block',
            // width: this.nowWidth() + 'px',
            height: this.nowHeight() + 'px',
        }
    }

    /** 开启编辑模式
     *  @param {Object} editOption 包含 draggable(Boolean)  resize(Boolean) 表示开启或关闭哪个功能,
     *                              调用该函数不传参或者传入布尔值 true表示draggable和 resize 全部开启
     *                              传入 布尔值 false 表示全部关闭
     * */
    edit(editOption = {}) {
        Sync.run(()=>{
            if (typeof editOption === 'object') {
                if (Object.keys(editOption).length === 0) editOption = true
            }
            if (editOption === false) {
                editOption = {draggable: false, resize: false}
            } else if (editOption === true) {
                editOption = {draggable: true, resize: true}
            }
            editOption.draggable = this._isItemsDraggable = editOption.draggable === true
            editOption.resize = this._isItemsResize = editOption.resize === true
            this.isEdit = this._isItemsResize || this._isItemsDraggable
            this.engine.edit(editOption)
        })
    }

    /** 获取现在的Container宽度  */
    nowWidth = () => {
        let marginWidth = 0
        if ((this.col) > 1) marginWidth = (this.col - 1) * this.margin[0]
        // console.log(this.col * this.size[0] + marginWidth)
        return ((this.col) * this.size[0]) + marginWidth || 0
    }

    /** 获取现在的Container高度  */
    nowHeight = () => {
        let marginHeight = 0
        if ((this.row) > 1) marginHeight = (this.row - 1) * this.margin[1]
        // console.log(this.row * this.size[1] + marginHeight)
        console.log(this.row);
        return ((this.row) * this.size[1]) + marginHeight || 0
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

    /** 事件委托  */
    _event() {
        //----------------------事件委托------------------------//
        let timeOutEvent = null, regularUpdateLayoutTimer = null
        let EEF = this._eventEntrustFunctor()
        // this.engine.items.forEach((item) => {
        //     item.onResize((res) => {
        //         if (this.__temp__.resizeWidth === res.width && this.__temp__.resizeHeight === res.height) return
        //         this.__temp__.resizeWidth = res.width
        //         this.__temp__.resizeHeight = res.height
        //         this.__temp__.dragOrResize = 'resize'
        //         // console.log(res,this.__temp__.dragOrResize);
        //     })
        // })


        const mousedown = (ev) => {
            this.__temp__.fromItem = this._findItemFromElement(ev.target)
            // console.log(this.__temp__.fromItem );
            // timeOutEvent = setTimeout(() => {   //  监控长按事件
            //     clearTimeout(timeOutEvent)
            //     // console.log('长按了');
            // }, 0)
            const offsetSelfLeft = ev.target.clientWidth - ev.offsetX
            const offsetSelfTop = ev.target.clientHeight - ev.offsetY
            if (offsetSelfLeft < 22 || offsetSelfTop < 22) this.__temp__.dragOrResize = 'resize'   // 保留resize位置防止要调整大小触发drag
            else this.__temp__.dragOrResize = 'drag'
            if (this.isEdit) {
                // console.log(ev);
                //----------------------------------------------------------------//
                this.__temp__.isLeftMousedown = true
                this.__temp__.mousedownEvent = ev
                EEF.cursor.grabbing()
                if (this.__temp__.fromItem) {
                    this.__temp__.fromItem.transition(false)
                }
                //----------------------------------------------------------------//
                let regularUpdateLayoutTimer = setInterval(()=>{
                    if (this.__temp__.isResizing){
                        // this.engine.updateLayout()
                    }
                    if (this.__temp__.isDragging) {
                        // this.engine.updateLayout()
                    }
                },200)

                let timeOutEvent = setInterval(() => {
                    if (this.__temp__.isLeftMousedown === false) {
                        if (this.__temp__.isResizing) EEF.itemResize.mouseup()
                        if (this.__temp__.isDragging) {
                            mouseup()
                            this.engine.updateLayout()
                        }
                        clearInterval(timeOutEvent)
                        clearInterval(regularUpdateLayoutTimer)
                    }
                    if (this.__temp__.isDragging) {
                        // if (this.__temp__.fromItem) {
                        //     this.__temp__.fromItem.element.style.pointerEvents = 'none'
                        // }
                    }
                }, 500)
            }
        }
        const mouseenter = (ev) => {
            this.__temp__.isMousePointInContainer = true
            this.__temp__.toItem = this._findItemFromElement(ev.target)
            if (this.__temp__.toItem === null) return false
            if (this.__temp__.isDragging) EEF.itemDrag.mouseenter(ev)
        }

        const mousemove = (ev) => {
            if (this.isEdit) {
                if (this._isItemsDraggable && this.__temp__.dragOrResize === 'drag') {
                    this.__temp__.isDragging = true
                    this.__temp__.isResizing = false
                } else if (this._isItemsResize && this.__temp__.dragOrResize === 'resize') {
                    this.__temp__.isResizing = true
                    this.__temp__.isDragging = false
                }
                // console.log(this.__temp__.fromItem);

                if (this.__temp__.isLeftMousedown) {
                    // console.log(this.__temp__.dragOrResize);
                    if (this.__temp__.isDragging) {
                        if (EEF.cursor.cursor !== 'grabbing') EEF.cursor.grabbing()  //  加判断为了禁止css重绘

                        EEF.itemDrag.mousemove(ev)
                    } else if (this.__temp__.isResizing) {
                        EEF.itemResize.doResize(ev)
                    }
                }else {
                    if (EEF.cursor.cursor !== 'grab') EEF.cursor.grab()
                }
            }
        }

        const mouseout = (ev) => {
            if (this.isEdit) {
                this.__temp__.isMousePointInContainer = false
            }
        }

        const mouseleave = (ev) => {
            if (ev.target === this.element) {
                this.__temp__.isLeftMousedown = false
                this.__temp__._mouseInContainerOuter = true
            }
            console.log(ev);
            if (this.__temp__.isDragging) EEF.itemDrag.mouseleave()
        }

        const mouseup = (ev) => {
            if (this.isEdit) {
                if (this.__temp__.isResizing) EEF.itemResize.mouseup()
                if (this.__temp__.isDragging) EEF.itemDrag.mouseup()
                if (EEF.cursor.cursor !== 'grab') EEF.cursor.grab()
            }

            //------------------------------//
            clearInterval(timeOutEvent)
            this.__temp__.toItem = null
            this.__temp__.fromItem = null
            this.__temp__.isDragging = false
            this.__temp__.isResizing = false
            this.__temp__.isLeftMousedown = false
            this.__temp__.mousedownEvent = null
            this.__temp__.dragOrResize = null
        }

        //--------------------------------------------------------------------------------------------//
        this.element.addEventListener('mousedown', mousedown)
        this.engine.items.forEach((item) => item.element.addEventListener('mouseenter', mouseenter))
        this.element.addEventListener('mousemove', mousemove)
        this.element.addEventListener('mouseup', mouseup)
        this.element.addEventListener('mouseleave', mouseleave)
        this.element.addEventListener('mouseout', mouseout)
        this.element.addEventListener('dragstart', (ev) => ev.preventDefault())
        this.element.addEventListener('drag', (ev) => ev.preventDefault())
        this.element.addEventListener('dragover', (ev) => ev.preventDefault())
        //--------------------------------------------------------------------------------------------//
    }


    /** 用于事件委托触发的函数集  */
    _eventEntrustFunctor() {
        return {
            itemResize: {
                doResize: (ev) => {
                    const mousedownEvent = this.__temp__.mousedownEvent
                    const item = this.__temp__.fromItem
                    if (ev.target === this.element) return
                    if (item === null) return
                    // console.log('doResize');
                    //----------------------------------------//
                    // let offset = {  // 偏离鼠标 resize 的像素
                    //     x: item.element.clientWidth - item.__temp__.clientWidth,
                    //     y: item.element.clientHeight - item.__temp__.clientHeight
                    // }

                    const resized = {
                        // w: item.__temp__.w + Math.round(offset.x / (item.size[0] + item.margin[1])) || 1,
                        // h: item.__temp__.h + Math.round(offset.y / (item.size[1] + item.margin[0])) || 1,
                        w: Math.ceil(item.element.clientWidth / (item.size[0] + item.margin[0])) || 1,
                        h: Math.ceil(item.element.clientHeight / (item.size[1] + item.margin[1])) || 1,
                    }

                    merge(item.pos, resized)
                    const pos = item.pos
                    //----------------检测改变的大小是否符合用户限制 -------------//
                    if ((resized.w + item.pos.x) > pos.col) item.pos.w = pos.col - pos.x + 1    //item调整大小时在容器右边边界超出时进行限制

                    if (pos.w < pos.minW) item.pos.w = pos.minW
                    if (pos.w > pos.maxW && pos.maxW !== Infinity) item.pos.w = pos.maxW
                    if (pos.h < pos.minH) item.pos.h = pos.minH
                    if (pos.h > pos.maxH && pos.maxH !== Infinity) item.pos.h = pos.maxH
                    //---------------------resize 增减长宽结束--------------//
                    // console.log(this.minWidth(),this.minHeight(),this.maxWidth(),this.maxHeight());
                    item.pos.static = true    // 使其变成静态不会在调整中被动态改变x,y照成错位，调整后即刻改了回来


                    // console.log(width, height);
                    throttle(()=>{
                        let width = ev.clientY - mousedownEvent.offsetY + this.size[0]
                        let height = ev.clientX - mousedownEvent.offsetX + this.size[1]
                        if (width > item.nowWidth()) width = item.nowWidth()
                        if (height > item.nowHeight()) height = item.nowHeight()
                        item.updateStyle({
                            width: width + 'px',
                            height: height + 'px',
                        })
                    },300)
                    if (item.__temp__.resized.w !== resized.w && item.__temp__.resized.h !== resized.h) { // 只有改变Item的大小才进行style重绘
                        // this.engine.updateLayout(null,[item])
                        item.__temp__.resized = resized
                        item.updateStyle(item._genLimitSizeStyle())
                        this.updateStyle(this.genContainerStyle())
                    }
                },
                mouseup: () => {
                    const mousedownEvent = this.__temp__.mousedownEvent
                    const item = this.__temp__.fromItem
                    if (item === null) return
                    //----------------------------------------//
                    // this.engine.updateLayout()
                    item.pos.static = item.__temp__.static
                    item.updateStyle(item._genItemStyle())
                }
            },
            cursor: {
                container: () => {
                    return this
                },
                cursor: 'grab',
                grab: function () {
                    const container = this.container()
                    container.updateStyle({cursor: 'grab'}, container.element, true)
                    this.cursor = 'grab'
                },
                grabbing: function () {
                    const container = this.container()
                    container.updateStyle({cursor: 'grabbing'}, container.element, true)
                    this.cursor = 'grabbing'
                },
            },
            itemDrag: {
                cloneItem: null,
                mouseup: (ev) => {
                    const fromItem = this.__temp__.fromItem
                    const toItem = this.__temp__.toItem
                    if (fromItem === null || toItem === null) return
                    // console.log(ev);
                    fromItem?.updateStyle({
                        transform: 'scale(1)',
                        pointerEvents: 'auto',
                    }, this.__temp__.cloneElement)
                    fromItem.transition(false)
                    let tempI
                    // tempI = toItem.i        // 获取最新交换位置，执行两个Item的最终交换
                    // toItem.i = fromItem.i
                    // fromItem.i = tempI
                    // this.engine.updateLayout()
                    if (this.__temp__.cloneElement !== null) {
                        fromItem.updateStyle({opacity: '1'})
                        this.element.removeChild(this.__temp__.cloneElement)
                        this.__temp__.cloneElement = null
                    }

                },
                mouseenter: (ev) => {
                    // const mousedownEvent = this.__temp__.mousedownEvent
                    const fromItem = this.__temp__.fromItem
                    const toItem = this.__temp__.toItem
                    if (fromItem === null || toItem === null) return
                    // console.log(fromItem, toItem);
                    let tempI
                    tempI = fromItem.i     // 将两个Item临时交换更新布局
                    fromItem.i = toItem.i
                    toItem.i = tempI
                    // console.log(ev.target);
                    this.__temp__.fromItemExchangeIndex = tempI   //  保留当前最新交换位置
                    // this.engine.updateLayout()
                    console.log(toItem === fromItem);

                    if (toItem === fromItem){
                        tempI = toItem.i        // 将两个Item换回来，等于恢复原样布局信息
                        toItem.i = fromItem.i
                        fromItem.i = tempI
                    }
                },
                mouseleave:(ev)=>{
                    return;
                    const fromItem = this.__temp__.fromItem
                    const toItem = this.__temp__.toItem
                    if (fromItem === null || toItem === null) return
                    let tempI
                    tempI = toItem.i        // 将两个Item换回来，等于恢复原样布局信息
                    toItem.i = fromItem.i
                    fromItem.i = tempI
                },
                mousemove: throttle((ev) => {
                    const mousedownEvent = this.__temp__.mousedownEvent
                    const fromItem = this.__temp__.fromItem
                    if (fromItem === null || mousedownEvent === null) return
                    if (this.__temp__.cloneElement === null) {
                        this.__temp__.cloneElement = fromItem.element.cloneNode(true)
                        this.element.appendChild(this.__temp__.cloneElement)
                        fromItem.updateStyle({opacity: this.style.opacity})
                        fromItem.updateStyle({
                            pointerEvents: 'none',
                            transform: this.style.transform
                        }, this.__temp__.cloneElement)
                    }
                    // console.log(ev);
                    const left = ev.pageX - mousedownEvent.offsetX
                    const top = ev.pageY - mousedownEvent.offsetY
                    fromItem.updateStyle({
                        left: left + 'px',
                        top: top + 'px',
                        // height: mousedownEvent.target.clientHeight + 'px',
                        // width: mousedownEvent.target.clientWidth + 'px',
                    }, this.__temp__.cloneElement)
                }, 10)
            }

        }
    }

    _findItemFromElement = (elem) => {  //  找到事件委托触发的所在container中的item, 现在只做往下第一层，TODO 后面可遍历增加
        const toElementItems = this.find(elem)
        if (toElementItems.length <= 0) return null
        else {
            // console.log(toElementItems[0]);
            return toElementItems[0]
        }
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

