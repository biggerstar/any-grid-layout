import Sync from "@/units/grid/other/Sync.js";
import {merge} from "@/units/grid/other/tool.js";
import ItemPos from "@/units/grid/main/item/ItemPos.js";
import {defaultStyle} from "@/units/grid/default/style/defaultStyle.js";
import EditEvent from '@/units/grid/events/EditEvent.js'
import DomFunctionImpl from "@/units/grid/other/DomFunctionImpl.js";
import TempStore from "@/units/grid/other/TempStore.js";

//---------------------------------------------------------------------------------------------//
const tempStore = TempStore.store

//---------------------------------------------------------------------------------------------//

/** 栅格成员, 所有对 DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 * @param {Element} el 传入的原生Element
 * @param {Object} pos 一个包含Item位置信息的对象
 * */
export default class Item extends DomFunctionImpl {
    //------------实例化Item外部传进的的参数,不建议在Container中传进来--------------//
    el = ''   // 和Container不同的是，这里只能是原生的Element而不用id或者class，因为已经拿到Element传进来，没必要画蛇添足
    name = '' //  开发者直接在元素标签上使用name作为名称，后续便能直接通过该名字找到对应的Item
    follow = true      //  是否让Item在脱离Items覆盖区域的时候跟随鼠标实时移动，比如鼠标在Container空白区域或者在Container外部
    dragOut = true     // 是否可以将Item拖动到容器外
    className = 'grid-item' // Item在文档中默认的类名,可以由外部传入重新自定义
    dragIgnoreEls = []   // 【不】允许点击该范围内的元素拖动Item,数组内的值为css选择器或者目标子元素(Element)
    dragAllowEls = []    // 【只】允许点击该范围内的元素拖动Item,数组内的值为css选择器或者目标子元素(Element)
    //----------被defineProperties代理的字段-------------//
    transition = null  // time:动画过渡时长 ms, field: 要过渡的css字段 可通过Container.animation函数修改全部Item,通过Item.animation函数修改单个Item
    draggable = null  //  自身是否可以拖动
    resize = null     //  自身是否可以调整大小
    close = null
    static = false
    //----实例化Container外部传进的的参数,和Container一致，不可修改,不然在网格中会布局混乱----//
    margin = [null, null]   //   间距 [左右, 上下]
    size = [null, null]   //   宽高 [宽度, 高度]

    //----------------内部需要的参数---------------------//
    i = null   //  每次重新布局给的自动正整数编号,对应的是Item的len
    element = null
    container = null   // 挂载在哪个container上
    tagName = 'div'
    classList = []
    attr = []
    pos = {}
    edit = null   // 该Item是否正在被编辑(只读)
    parentElement = null
    nesting = null
    _VueEvents = {}   // 用于 vue 携带的内置事件
    //----------------保持状态所用参数---------------------//
    _mounted = false
    _resizeTabEl = null
    _closeEl = null
    __temp__ = {
        // -------------不可写变量--------------//

        //------------都是可写变量--------------//
        // isNestingContainer: false,  // 指示该Item是不是嵌套另一个Container
        eventRecord: {}, // 当前编辑状态开启的功能，drag || resize
        event: {},
        editNumUsing: false, // 是否占用全局editItemNum的计数
        styleLock: false,
        maskEl: null,
        height: 0,
        width: 0,
        dragging: false,
        clientWidth: 0,
        clientHeight: 0,
        resized: {
            w: 1,
            h: 1
        }
    }

    constructor(itemOption) {
        super()
        if (itemOption.el instanceof Element) {
            this.el = itemOption.el
            this.element = itemOption.el
        }
        this._define()
        merge(this, itemOption)
        this.pos = new ItemPos(itemOption.pos)   //  只是初始化用，初始化后后面都是由ItemPosList管理,目前ItemPosList只是用于存储，也无大用
        this._itemSizeLimitCheck()
    }

    _define() {
        const self = this
        let draggable = false
        let resize = false
        let close = false
        let edit = false
        let transition = {
            time: 180,
            field: 'top,left,width,height'
        }
        Object.defineProperties(this, {
            draggable: {
                configurable: false,
                get: () => draggable,
                set(v) {
                    if (typeof v === 'boolean') {
                        if (draggable === v) return
                        draggable = v
                        self.edit = draggable || resize || close
                    }
                }
            },
            resize: {
                configurable: false,
                get: () => resize,
                set(v) {
                    if (typeof v === 'boolean') {
                        if (resize === v) return
                        resize = v
                        self._handleResize(v)
                        self.edit = draggable || resize || close
                    }
                }
            },
            close: {
                configurable: false,
                get: () => close,
                set(v) {
                    if (typeof v === 'boolean') {
                        if (close === v) return
                        close = v
                        self._closeBtn(v)
                        self.edit = draggable || resize || close
                    }
                }
            },
            edit: {
                configurable: false,
                get: () => edit,
                set(v) {
                    if (typeof v === 'boolean') {
                        if (edit === v) return
                        edit = v
                        self._edit(edit)
                    }
                }
            },
            transition: {
                configurable: false,
                get: () => transition,
                set(v) {
                    if (v === false) transition.time = 0
                    if (typeof v === 'number') transition.time = v
                    if (typeof v === 'object') {
                        if (v.time !== transition.time) transition.time = v.time
                        if (v.field !== transition.field) transition.field = v.field
                    }
                    self.animation(transition)
                }
            },
        })


    }

    /** 渲染, 直接渲染添加到 Container 中*/
    mount() {
        const _mountedFun = () => {
            if (this._mounted) return
            if (this.container.platform !== 'vue') {
                if (this.element === null) this.element = document.createElement(this.tagName)
                this.container.contentElement.appendChild(this.element)
            }
            this.attr = Array.from(this.element.attributes)
            this.element.classList.add(this.className)
            this.classList = Array.from(this.element.classList)
            this.updateStyle(defaultStyle.gridItem)
            this.updateStyle(this._genItemStyle())
            this.__temp__.w = this.pos.w
            this.__temp__.h = this.pos.h
            this.element._gridItem_ = this
            this.element._isGridItem_ = true
            this._mounted = true
            this.container.eventManager._callback_('itemMounted', this)
            if (this.static) this.element.innerHTML = this.element.innerHTML + `--
                ${this.pos.i}</br>
                ${this.pos.w},${this.pos.h}</br>
                ${this.pos.x},${this.pos.y} `
            // else this.element.innerHTML = this.element.innerHTML + '---' + this.i
        }

        if (this.container.platform === 'vue') _mountedFun()
        else Sync.run(_mountedFun)
    }


    /** 自身调用从container中移除,未删除Items中的占位,若要删除可以遍历删除或者直接调用clear清除全部Item,或者使用isForce参数设为true
     * @param {Boolean} isForce 是否移除element元素的同时移除掉现有加载的items列表中的对应item
     * */
    unmount(isForce = false) {
        Sync.run(() => {
            if (this._mounted) {
                if (this.__temp__.editNumUsing) {
                    this.__temp__.editNumUsing = false
                    tempStore.editItemNum--   // 卸载时占用了editNum 进行释放
                }
                this._handleResize(false)
                this._closeBtn(false)
                EditEvent.removeEventFromItem(this)
                this.container.contentElement.removeChild(this.element)
                this.container.eventManager._callback_('itemUnmounted', this)
            } else {
                this.container.layoutManager._error_('ItemAlreadyRemove', '该Item对应的element未在文档中挂载，可能已经被移除', this)
            }
        })
        if (isForce) this.remove()
        this._mounted = false
    }

    /** 将自己从Items列表中移除
     * @param {Boolean}  force  是否强力删除Dom节点，true为删除引用，false为不删除引用只删除Item占位
     * */
    remove(force = false) {
        this.container.engine.remove(this)
        if (force) {
            this.container.contentElement.removeChild(this.element)
        }
    }

    /** 为该Item开启编辑模式,这里代码和Container重复是因为可能单独开Item编辑模式
     *  @param {Boolean}  isEdit    是否开启编辑模式
     *  @backup {Object}  editOption  原参数(editOption)  包含 draggable(Boolean)  resize(Boolean) 表示开启或关闭哪个功能,
     *                              调用该函数不传参或者传入布尔值 true表示draggable和 resize 全部开启
     *                              传入 布尔值 false 表示全部关闭
     * */
    _edit(isEdit = false) {
        if (this.edit === true) {
            if (!this.__temp__.editNumUsing) {
                EditEvent.startEvent(null, this)
                this.__temp__.editNumUsing = true
                tempStore.editItemNum++   // 未占用editNum 进行占用
            }
        } else if (this.edit === false) {
            if (this.__temp__.editNumUsing) {
                EditEvent.removeEvent(null, this)
                tempStore.editItemNum--   // 占用了editNum 进行释放
                this.__temp__.editNumUsing = false
            }
        }
    }

    /** 对该Item开启位置变化过渡动画
     *  @param {Object} transition  Item移动或者大小癌变要进行变化过渡的时间，单位ms,可以传入true使用默认时间180ms,或者传入false关闭动画
     * */
    animation(transition) {
        if (typeof transition !== "object") {
            console.log('参数应该是对象形式{time:Number, field:String}')
            return
        }
        Sync.run(() => {
            const style = {}
            if (transition.time > 0) {
                style.transitionProperty = transition.field
                style.transitionDuration = transition.time + 'ms'
                style.transitionTimingFunction = 'ease-out'
            } else if (transition.time === 0) {
                style.transition = 'none'
            }
            this.updateStyle(style)
        })
    }

    /**  */
    followStatus(isFollow = true) {
        this.follow = isFollow
    }

    /** 根据 pos的最新数据 立即更新当前Item在容器中的位置 */
    updateItemLayout() {
        this.updateStyle(this._genItemStyle())
    }

    /**  @return  根据当前自身的this.pos 生成当前Item 距离父元素左边的距离, Item左边框 ---->  父元素左边框 */
    offsetLeft() {
        let marginWidth = 0
        if ((this.pos.x) > 1) marginWidth = (this.pos.x - 1) * this.margin[0]
        return ((this.pos.x - 1) * this.size[0]) + marginWidth
    }

    /**  @return  根据当前自身的this.pos 生成当前Item 距离父元素顶部边的距离, Item上边框 ---->  父元素上边框 */
    offsetTop() {
        let marginHeight = 0
        if ((this.pos.y) > 1) marginHeight = (this.pos.y - 1) * this.margin[1]
        return ((this.pos.y - 1) * this.size[1]) + marginHeight
    }

    /**  @return  获取该Item 当前的宽度 */
    nowWidth = (w) => {
        let marginWidth = 0
        const nowW = w ? w : this.pos.w
        if (nowW > 1) marginWidth = (nowW - 1) * this.margin[0]
        // console.log(this.pos.w, marginWidth);
        // if (this.pos.i === 0) console.log(this,this.pos.x);
        return (nowW * this.size[0]) + marginWidth
    }

    /**  @return  获取该Item 当前的高度 */
    nowHeight = (h) => {
        let marginHeight = 0
        const nowH = h ? h : this.pos.h
        if (nowH > 1) marginHeight = (nowH - 1) * this.margin[1]
        // console.log(this.pos.h, marginHeight);
        return (nowH * this.size[1]) + marginHeight
    }

    /**  @return   根据当前自身的this.pos 生成Item当前必须占用最小宽度的像素大小 */
    minWidth() {
        let marginWidth = 0
        if (this.pos.minW === Infinity) return Infinity
        if (this.pos.minW > 1) marginWidth = (this.pos.minW - 1) * this.margin[0]
        return (this.pos.minW * this.size[0]) + marginWidth
    }

    /**   @return  根据当前自身的this.pos 生成Item当前必须占用最小高度的像素大小 */
    minHeight = () => {
        let marginHeight = 0
        if (this.pos.minH === Infinity) return Infinity
        if (this.pos.minH > 1) marginHeight = (this.pos.minH - 1) * this.margin[1]
        return (this.pos.minH * this.size[1]) + marginHeight
    }

    /** @return  根据当前自身的this.pos 生成Item当前必须占用最大宽度的像素大小 */
    maxWidth() {
        let marginWidth = 0
        if (this.pos.maxW === Infinity) return Infinity
        marginWidth = (this.pos.maxW - 1) * this.margin[0]
        return (this.pos.maxW * this.size[0]) + marginWidth
    }

    /** @return  根据当前自身的this.pos 生成Item当前必须占用最大高度的像素大小 */
    maxHeight = () => {
        let marginHeight = 0
        if (this.pos.maxH === Infinity) return Infinity
        marginHeight = (this.pos.maxH - 1) * this.margin[1]
        return (this.pos.maxH * this.size[1]) + marginHeight
    }

    /** 是否锁定CSS 样式的渲染 不传参数返回当前的状态 ，传布尔参数将状态设置成相应的布尔值    */
    styleLock(isStyle = null) {
        if (isStyle === null) return this.__temp__.styleLock
        if (isStyle === true) return this.__temp__.styleLock = true
        if (isStyle === false) return this.__temp__.styleLock = false
    }

    _handleResize(isResize = false) {
        const handleResizeFunc = ()=>{
            const className = 'grid-item-resizable-handle'
            if (isResize && this._resizeTabEl === null) {
                const handleResizeEls = this.element.querySelectorAll('.' + className)
                if (handleResizeEls.length > 0) return;
                const resizeTabEl = document.createElement('span')
                resizeTabEl.innerHTML = '⊿'
                this.updateStyle(defaultStyle.gridResizableHandle, resizeTabEl)
                this.element.appendChild(resizeTabEl)
                resizeTabEl.classList.add(className)
                this._resizeTabEl = resizeTabEl
            } else if (this.element && isResize === false) {
                for (let i = 0; i < this.element.children.length; i++) {
                    const node = this.element.children[i]
                    if (node.className.includes(className)) {
                        this.element.removeChild(node)
                        this._resizeTabEl = null
                    }
                }
            }
        }
        if (this.element) handleResizeFunc()
        else Sync.run(handleResizeFunc)
    }

    /** 创建拖Item关闭按钮 */
    _closeBtn(isDisplayBtn = false) {
        const closeBtnFunc = ()=>{
            const className = 'grid-item-close-btn'
            if (isDisplayBtn && this._closeEl === null) {
                const _closeEl = document.createElement('div')
                this.updateStyle(defaultStyle.gridItemCloseBtn, _closeEl)
                this._closeEl = _closeEl
                _closeEl.classList.add(className)
                this.element.appendChild(_closeEl)
                _closeEl.innerHTML = defaultStyle.gridItemCloseBtn.innerHTML
            }
            if (this._closeEl !== null && !isDisplayBtn) {
                for (let i = 0; i < this.element.children.length; i++) {
                    const node = this.element.children[i]
                    if (node.className.includes(className)) {
                        this.element.removeChild(node)
                        this._closeEl = null
                    }
                }
            }
        }
        if (this.element) closeBtnFunc()
        else Sync.run(closeBtnFunc)
    }

    /** 创建拖动时防止经过某个Item且触发Item里面元素遮罩，已弃用 */
    _mask_(isMask = false) {
        if (isMask) {
            const maskEl = document.createElement('div')
            this.updateStyle({
                backgroundColor: 'transparent',
                height: this.element.clientHeight + 'px',
                width: this.element.clientWidth + 'px',
                position: 'absolute',
                left: '0',
                top: '0',
            }, maskEl)
            this.__temp__.maskEl = maskEl
            this.element.appendChild(maskEl)
            maskEl.classList.add('grid-item-mask')

        }
        if (this.__temp__.maskEl !== null && !isMask) {
            try {  // 和Container联动的话在Container可能已经被清除掉了，这里只是尝试再次清理
                this.element.removeChild(this.__temp__.maskEl)
            } catch (e) {
            }
        }
    }

    /** 做Item的大小信息限制 */
    _itemSizeLimitCheck() {
        const pos = this.pos
        let realW = pos.w
        let realH = pos.h
        // 宽度
        if (pos.minW >= pos.maxW && pos.maxW >= pos.w && pos.maxW !== Infinity) realW = pos.maxW
        else if (pos.w > pos.maxW && pos.maxW !== Infinity) realW = pos.maxW
        else if (pos.w < pos.minW) realW = pos.minW

        // 高度
        if (pos.minH >= pos.maxH && pos.maxH >= pos.h && pos.maxH !== Infinity) realH = pos.maxH
        else if (pos.h > pos.maxH && pos.maxH !== Infinity) realH = pos.maxH
        else if (pos.h < pos.minH) realH = pos.minH

        this.pos.w = realW
        this.pos.h = realH
    }

    /** 生成该ITEM的栅格放置位置样式  */
    _genItemStyle = () => {
        // console.log(this.offsetLeft(),this.offsetTop());
        if (this.styleLock()) return {}
        //   三种布局方案，都实现了grid布局 //
        return {
            width: this.nowWidth() + 'px',
            height: this.nowHeight() + 'px',

            // gridColumn: `${this.pos.x} / span ${this.pos.w}`,
            // gridRow: `${this.pos.y} / span ${this.pos.h}`,

            left: this.offsetLeft() + 'px',
            top: this.offsetTop() + 'px',

            // transform:`translate(${this.offsetLeft()+'px'},${this.offsetTop()+'px'})`,
        }
    }

    _genLimitSizeStyle = () => {
        if (this.styleLock()) return {}
        return {
            minWidth: this.minWidth() + 'px',
            minHeight: this.minHeight() + 'px',
            maxWidth: this.maxWidth() + 'px',
            maxHeight: this.maxHeight() + 'px',
        }

    }

}
