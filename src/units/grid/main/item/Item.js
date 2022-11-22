import Sync from "@/units/grid/other/Sync.js";
import {cloneDeep, merge, parseContainer, throttle} from "@/units/grid/other/tool.js";
import ItemPos from "@/units/grid/main/item/ItemPos.js";
import DomFunctionImpl from "@/units/grid/other/DomFunctionImpl.js";
import {defaultStyle} from "@/units/grid/default/style/defaultStyle.js";
import EditEvent from '@/units/grid/events/EditEvent.js'
import TempStore from "@/units/grid/other/TempStore.js";

const tempStore = TempStore.containerStore

/** 栅格成员, 所有对 DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 * @param {Element} el 传入的原生Element
 * @param {Object} pos 一个包含Item位置信息的对象
 * */
export default class Item extends DomFunctionImpl {
    //------------实例化Item外部传进的的参数,不建议在Container中传进来--------------//
    el = ''   // 和Container不同的是，这里只能是原生的Element而不用id或者class，因为已经拿到Element传进来，没必要画蛇添足
    name = '' //  开发者直接在元素标签上使用name作为名称，后续便能直接通过该名字找到对应的Item
    transition = {
        time: 180,
        field: 'top,left,width,height'
    }     // time:动画过渡时长 ms, field: 要过渡的css字段 可通过Container.animation函数修改全部Item,通过Item.animation函数修改单个Item
    draggable = false  //  自身是否可以拖动
    resize = false     //  自身是否可以调整大小
    close = false
    follow = true      //  是否让Item在脱离Items覆盖区域的时候跟随鼠标实时移动，比如鼠标在Container空白区域或者在Container外部
    className = 'grid-item' // Item在文档中默认的类名,可以由外部传入重新自定义
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
    parentElement = null
    isEdit = false   // 该Item是否正在被编辑
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
        merge(this, itemOption)
        if (this.el instanceof Element) this.element = this.el
        this.pos = new ItemPos(itemOption)   //  只是初始化用，初始化后后面都是由ItemPosList管理,目前ItemPosList只是用于存储，也无大用
        // console.log(this.pos.static);
        this._itemSizeLimitCheck()
    }

    /** 渲染, 直接渲染添加到 Container 中*/
    mount() {
        Sync.run(() => {
            if (this._mounted) return
            // console.log(this.element);
            if (this.element === null) this.element = document.createElement(this.tagName)
            this.container.element.appendChild(this.element)
            this.classList = Array.from(this.element.classList)
            this.attr = Array.from(this.element.attributes)
            this.element.classList.add(this.className)
            this.updateStyle(defaultStyle.gridItem)
            // console.log(this._genItemStyle(),this.pos);
            this.updateStyle(this._genItemStyle())
            // console.log(this._genItemStyle());
            this.edit({
                draggable: this.draggable,
                resize: this.resize,
                close: this.close,
            })
            this.animation(this.transition)

            // this.__temp__.clientWidth = this.element.clientWidth
            // this.__temp__.clientHeight = this.element.clientHeight
            this.__temp__.w = this.pos.w
            this.__temp__.h = this.pos.h
            this.element._gridItem_ = this
            this.element._isGridItem_ = true
            this._mounted = true
            if (this.pos.static) this.element.innerHTML = this.element.innerHTML + `--
                ${this.pos.i}</br>
                ${this.pos.w},${this.pos.h}</br>
                ${this.pos.x},${this.pos.y} `
            // else this.element.innerHTML = this.element.innerHTML + '---' + this.i
        })
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
                this.container.element.removeChild(this.element)
            } else {
                console.error('该Item对应的element未在文档中挂载，可能已经被移除', this);
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
            this.container.element.removeChild(this.element)
        }
    }

    /** 为该Item开启编辑模式,这里代码和Container重复是因为可能单独开Item编辑模式
     *  @param {Object} editOption 包含 draggable(Boolean)  resize(Boolean) 表示开启或关闭哪个功能,
     *                              调用该函数不传参或者传入布尔值 true表示draggable和 resize 全部开启
     *                              传入 布尔值 false 表示全部关闭
     * */
    edit(editOption) {
        if (typeof editOption === 'object') {
            if (Object.keys(editOption).length === 0) editOption = true
        }
        if (editOption === false) {
            editOption = {draggable: false, resize: false, close: false}
        } else if (editOption === true) {
            editOption = {draggable: true, resize: true, close: true}
        }
        if (typeof editOption.draggable === "boolean") this.draggable = editOption.draggable
        if (typeof editOption.resize === "boolean") this.resize = editOption.resize
        if (typeof editOption.close === "boolean") this.close = editOption.close

        if (this._mounted) {
            if (this.draggable || this.resize || this.close) {
                if (this.isEdit === false) {
                    EditEvent.startEvent(null, this)
                    this.isEdit = true
                    if (!this.__temp__.editNumUsing) {
                        this.__temp__.editNumUsing = true
                        tempStore.editItemNum++   // 未占用editNum 进行占用
                    }
                }
            } else if (!this.draggable && !this.resize && !this.close) {
                if (this.isEdit === true) {
                    this.isEdit = false
                    if (this.__temp__.editNumUsing) {
                        tempStore.editItemNum--   // 占用了editNum 进行释放
                        this.__temp__.editNumUsing = false
                    }
                    EditEvent.removeEvent(null, this)
                }
            }
        }
        this._handleResize(editOption.resize)
        this._closeBtn(editOption.close)
    }

    /** 对该Item开启位置变化过渡动画
     *  @param {Number|Object|Boolean} transition Item移动或者大小癌变要进行变化过渡的时间，单位ms,可以传入true使用默认时间180ms,或者传入false关闭动画
     *  @param {String} fieldString 要进行变化的CSS属性字段，使用逗号
     * */
    animation(transition, fieldString = null) {
        if (typeof transition === "object") {
            const cloneObj = cloneDeep(transition)
            transition = cloneObj.time
            fieldString = cloneObj.field
        }
        Sync.run(() => {
                const style = {}
                if (typeof transition === 'number') this.transition.time = transition   // 传入数字保存
                else if (transition === true || transition === undefined) {
                    transition = this.transition.time  // 传入true 使用默认动画时长和字段
                    fieldString = this.transition.field
                }
                if (fieldString === null) fieldString = this.transition.field
                style.transitionProperty = transition ? fieldString : 'none'    //  当transition = false的时候，不会开启动画
                style.transitionDuration = transition ? transition + 'ms' : 'none'
                style.transitionTimingFunction = 'ease-out'
                this.updateStyle(style)
                if (transition !== false) {
                    this.transition = {
                        time: transition,
                        field: fieldString,
                    }
                } else this.transition = false
            }
        )
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

    _handleResize(isResize = false, msg) {
        const className = 'grid-item-resizable-handle'
        if (isResize && this._resizeTabEl === null) {
            const handleResizeEls = this.element.querySelectorAll('.' + className)
            if (handleResizeEls.length > 0) return;
            const resizeTabEl = document.createElement('span')
            resizeTabEl.innerHTML = '⊿'
            this.updateStyle(defaultStyle.gridResizableHandle, resizeTabEl)
            this.element.appendChild(resizeTabEl)
            resizeTabEl.classList.add(className, 'grid-cursor-item-resize')
            this._resizeTabEl = resizeTabEl
        } else if (isResize === false) {
            for (let i = 0; i < this.element.children.length; i++) {
                const node =  this.element.children[i]
                if(node.className.includes(className)){
                    this.element.removeChild(node)
                    this._resizeTabEl = null
                }
            }
        }
    }

    /** 创建拖Item关闭按钮 */
    _closeBtn(isDisplayBtn = false) {
        const className = 'grid-item-close-btn'
        if (isDisplayBtn && this._closeEl === null) {
            const _closeEl = document.createElement('div')
            this.updateStyle(defaultStyle.gridItemCloseBtn, _closeEl)
            this._closeEl = _closeEl
            _closeEl.classList.add(className, 'grid-cursor-item-close')
            this.element.appendChild(_closeEl)
            _closeEl.innerHTML = defaultStyle.gridItemCloseBtn.innerHTML
        }
        if (this._closeEl !== null && !isDisplayBtn) {
            for (let i = 0; i < this.element.children.length; i++) {
                const node =  this.element.children[i]
                if(node.className.includes(className)){
                    this.element.removeChild(node)
                    this._closeEl = null
                }
            }
        }
    }

    /** 创建拖动时防止经过某个Item且触发Item里面元素遮罩 */
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
    _itemSizeLimitCheck(){
        const pos = this.pos
        let realW = pos.w
        let realH = pos.h
        // 宽度
        if (pos.minW >= pos.maxW && pos.maxW >= pos.w && pos.maxW !== Infinity) realW = pos.maxW
        else if(pos.w > pos.maxW && pos.maxW !== Infinity) realW = pos.maxW
        else if(pos.w < pos.minW) realW = pos.minW

        // 高度
        if (pos.minH >= pos.maxH && pos.maxH >= pos.h && pos.maxH !== Infinity) realH = pos.maxH
        else if(pos.h > pos.maxH && pos.maxH !== Infinity) realH = pos.maxH
        else if(pos.h < pos.minH) realH = pos.minH

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

