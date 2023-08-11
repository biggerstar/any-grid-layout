// noinspection JSUnusedGlobalSymbols

import {merge} from "@/utils/tool";
import {defaultStyle} from "@/default/style/defaultStyle";
import {TempStore} from "@/utils/TempStore";
import {ItemPos} from "@/main/item/ItemPos";
import {Sync} from "@/utils/Sync";
import {EditEvent} from "@/events/EditEvent";
import {Container} from "@/main/container/Container";
import {ItemLayoutOption, MarginOrSizeDesc} from "@/types";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";

//---------------------------------------------------------------------------------------------//
const tempStore = TempStore.store

//---------------------------------------------------------------------------------------------//

/** 栅格成员, 所有对 DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 * @param {Element} el 传入的原生Element
 * @param {Object} pos 一个包含Item位置信息的对象
 * */
export class Item extends ItemGeneralImpl {
  [key: string]: any

  //----------------内部需要的参数---------------------//
  public i: number   //  每次重新布局给的自动正整数编号,对应的是Item的len
  public element: HTMLElement
  public container: Container   // 挂载在哪个container上
  public tagName: string = 'div'
  public classList: string[] = []
  public attr: string[] = []
  public autoOnce: boolean
  public edit: boolean  // 该Item是否正在被编辑(只读)
  public nested: boolean = false
  public parentElement: HTMLElement

  //----------------vue专用---------------------//
  public _VueEvents: any = {}   // 用于 vue 携带的内置事件
  //----------------保持状态所用参数---------------------//
  private _mounted: boolean = false
  private _resizeTabEl: null | HTMLElement = null
  private _closeEl: null | HTMLElement = null
  public __temp__: Record<any, any> = {
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
    resizeLock: false,
    dragging: false,
    clientWidth: 0,
    clientHeight: 0,
    isDelayLoadAnimation: false,  // 是否延迟附加动画效果，否则当item一个个加入时会有初始加载过程的变化动画，可保留，但个人觉得不好看
    resized: {
      w: 1,
      h: 1
    }
  }

  //-------------------------getter---------------------------
  /**
   * Item间距 [左右, 上下]
   * */
  public get margin(): MarginOrSizeDesc {  //
    return this.container.getConfig('margin')
  }

  /**
   * Item宽高 [宽度, 高度]
   * */
  public get size(): MarginOrSizeDesc {  //
    return this.container.getConfig('size')
  }

  //----------------------------------------------------------
  constructor(itemOption: ItemLayoutOption) {
    super()
    if (itemOption.el instanceof Element) {
      this.el = itemOption.el
      this.element = itemOption.el
    }
    merge(this, itemOption)
    this.pos = new ItemPos(itemOption.pos)
    this.pos.belongItem = this
    this._itemSizeLimitCheck()
  }

  /** 让draggable，resize，close，edit 等支持getter 和 setter 直接复制控制 item 的对应行为状态 */
  private _define() {
    const self = this
    let draggable = this.draggable
    let resize = this.resize
    let close = this.close
    let edit = draggable || resize || close
    // console.log( draggable, resize, close)
    let transition = this.transition
    Object.defineProperties(<object>this, {
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
          if (v === false) transition['time'] = 0
          if (typeof v === 'number') transition['time'] = v
          if (typeof v === 'object') {
            if (v.time && v.time !== transition['time']) transition['time'] = v.time
            if (v.field && v.field !== transition['field']) transition['field'] = v.field
          }
          self.animation(transition)
        }
      },
    })
  }


  /** 导出当前Item的配置，忽略和默认配置一样的字段
   * @param otherFieldList {Array} 要导出的除了默认以外其他存在的字段
   * @param banFieldList {Array} 要禁止导出的字段
   * */
  public exportConfig = (otherFieldList = [], banFieldList = []) => {
    const item = this
    const exposeConfig: Record<any, any> = {}
    let exposePos: Record<any, any>
    exposePos = item.pos.export(otherFieldList)

    if (banFieldList.includes('x')) delete exposePos.x
    if (banFieldList.includes('y')) delete exposePos.y

    exposeConfig['pos'] = exposePos
    Array.from(['static', 'draggable', 'resize', 'close']).forEach((field => {
      if (item[field] !== false) exposeConfig[field] = item[field]
    }))
    Array.from(['follow', 'dragOut', 'resizeOut', 'exchange']).forEach((field => {
      if (item[field] !== true) exposeConfig[field] = item[field]
    }))
    if (item.name) exposeConfig.name = item.name
    if (typeof item.type === 'string') exposeConfig.type = item.type
    //transition 特殊导出
    let transition: Record<any, any> = {}
    if (item.transition['field'] !== 'top,left,width,height') {
      transition.field = item.transition['field']
      if (item.transition['time'] !== 180) transition.time = item.transition['time']
      exposeConfig.transition = transition
    } else {
      if (item.transition['time'] !== 180) {
        exposeConfig.transition = item.transition['time']
      }
    }
    // exposeConfig.el = this.element
    //transition 特殊导出结束
    return exposeConfig
  }

  /** 渲染, 直接渲染添加到 Container 中 */
  public mount() {
    const _mountedFun = () => {
      this._define()
      if (this._mounted) return
      if (this.container.platform === 'native') {
        if (!this.element) this.element = document.createElement(this.tagName)
        this.container.contentElement.appendChild(this.element)
      }
      this.attr = <any>Array.from(this.element.attributes)
      this.element.classList.add(this.className)
      this.classList = Array.from(this.element.classList)
      this.updateStyle(defaultStyle.gridItem)
      this.updateItemLayout()
      //--------------开启编辑和动画------------------
      this._handleResize(this.resize)
      this._closeBtn(this.close)
      this._edit(this.edit)
      this.animation(this.transition)
      //--------------------------------------------
      this.__temp__.w = this.pos.w
      this.__temp__.h = this.pos.h
      this.element['_gridItem_'] = this
      this.element['_isGridItem_'] = true
      this._mounted = true
      this.container.eventManager._callback_('itemMounted', this)
    }
    if (this.container.platform === 'vue') _mountedFun()
    else Sync.run(_mountedFun)
  }


  /** 自身调用从container中移除,未删除Items中的占位,若要删除可以遍历删除或者直接调用clear清除全部Item,或者使用isForce参数设为true
   * @param {Boolean} isForce 是否移除element元素的同时移除掉现有加载的items列表中的对应item
   * */
  public unmount(isForce = false) {
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
        this.container.eventManager._error_('ItemAlreadyRemove', '该Item对应的element未在文档中挂载，可能已经被移除', <any>this)
      }
    })
    if (isForce) this.remove()
    this._mounted = false
  }

  /** 将自己从Items列表中移除
   * @param {Boolean}  force  是否强力删除Dom节点，true为删除引用，false为不删除引用只删除Item占位
   * */
  public remove(force = false) {
    this.container.engine.remove(this)
    if (force) {
      this.unmount()
    }
  }

  /** 为该Item开启编辑模式,这里代码和Container重复是因为可能单独开Item编辑模式
   *  @param {Boolean}  isEdit    是否开启编辑模式
   * */
  private _edit(isEdit = false) {
    if (this.edit) {
      if (!this.__temp__.editNumUsing) {
        EditEvent.startEvent(null, this)
        this.__temp__.editNumUsing = true
        tempStore.editItemNum++   // 未占用editNum 进行占用
      }
    } else if (!this.edit) {
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
  public animation(transition) {
    if (typeof transition !== "object") {
      console.log('参数应该是对象形式{time:Number, field:String}')
      return
    }
    Sync.run({
      func: () => {
        const style = <CSSStyleDeclaration>{}
        if (transition.time > 0) {
          style.transitionProperty = transition.field
          style.transitionDuration = transition.time + 'ms'
          style.transitionTimingFunction = 'ease-out'
        } else if (transition.time === 0) {
          style.transition = 'none'
        }
        this.updateStyle(style)
      },
      rule: () => this.__temp__.isDelayLoadAnimation
    })
    this.__temp__.isDelayLoadAnimation = true
  }

  /**  */
  public followStatus(isFollow = true) {
    this.follow = isFollow
  }

  /** 根据 pos的最新数据 立即更新当前Item在容器中的位置 */
  public updateItemLayout() {
    this.updateStyle(this._genItemStyle())
  }

  /**  @return  根据当前自身的this.pos 生成当前Item 距离父元素左边的距离, Item左边框 ---->  父元素左边框 */
  public offsetLeft() {
    let marginWidth = 0
    if ((this.pos.x) > 1) marginWidth = (this.pos.x - 1) * this.margin[0]
    return ((this.pos.x - 1) * this.size[0]) + marginWidth
  }

  /**  @return  根据当前自身的this.pos 生成当前Item 距离父元素顶部边的距离, Item上边框 ---->  父元素上边框 */
  public offsetTop() {
    let marginHeight = 0
    if ((this.pos.y) > 1) marginHeight = (this.pos.y - 1) * this.margin[1]
    return ((this.pos.y - 1) * this.size[1]) + marginHeight
  }

  /**  @return  获取该Item 当前的宽度 */
  public nowWidth = (w = null) => {
    let marginWidth = 0
    const nowW = w ? w : (this.pos.tempW ? this.pos.tempW : this.pos.w)
    if (nowW > 1) marginWidth = (nowW - 1) * this.margin[0]
    // console.log(this.pos.w, marginWidth);
    // if (this.pos.i === 0) console.log(this,this.pos.x);
    return (nowW * this.size[0]) + marginWidth
  }

  /**  @return  获取该Item 当前的高度 */
  public nowHeight = (h = null) => {
    let marginHeight = 0
    const nowH = h ? h : (this.pos.tempH ? this.pos.tempH : this.pos.h)
    if (nowH > 1) marginHeight = (nowH - 1) * this.margin[1]
    // console.log(this.pos.h, marginHeight);
    return (nowH * this.size[1]) + marginHeight
  }

  /**  @return   根据当前自身的this.pos 生成Item当前必须占用最小宽度的像素大小 */
  public minWidth() {
    let marginWidth = 0
    if (this.pos.minW === Infinity) return Infinity
    if (this.pos.minW > 1) marginWidth = (this.pos.minW - 1) * this.margin[0]
    return (this.pos.minW * this.size[0]) + marginWidth
  }

  /**   @return  根据当前自身的this.pos 生成Item当前必须占用最小的高度像素大小 */
  public minHeight = () => {
    let marginHeight = 0
    if (this.pos.minH === Infinity) return Infinity
    if (this.pos.minH > 1) marginHeight = (this.pos.minH - 1) * this.margin[1]
    return (this.pos.minH * this.size[1]) + marginHeight
  }

  /** @return  根据当前自身的this.pos 生成Item当前必须占用最大宽度的像素大小 */
  public maxWidth() {
    let marginWidth = 0
    if (this.pos.maxW === Infinity) return Infinity
    marginWidth = (this.pos.maxW - 1) * this.margin[0]
    return (this.pos.maxW * this.size[0]) + marginWidth
  }

  /** @return  根据当前自身的this.pos 生成Item当前必须占用最大的高度像素大小 */
  public maxHeight = () => {
    let marginHeight = 0
    if (this.pos.maxH === Infinity) return Infinity
    marginHeight = (this.pos.maxH - 1) * this.margin[1]
    return (this.pos.maxH * this.size[1]) + marginHeight
  }

  /** 是否锁定CSS 样式的渲染 不传参数返回当前的状态 ，传布尔参数将状态设置成相应的布尔值    */
  public styleLock(isStyle = null) {
    if (isStyle === null) return this.__temp__.styleLock
    if (isStyle === true) return this.__temp__.styleLock = true
    if (isStyle === false) return this.__temp__.styleLock = false
  }

  /**  手动生成resize元素，可以将resize字段设置成false，然后在被Item包裹的子元素中将某个要指定为resize按钮的标签
   * 的class设置成grid-item-resizable-handle也能将该元素当成作为resize的触发按钮 */
  private _handleResize(isResize = false) {
    const handleResizeFunc = () => {
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
      } else if (this.element && !isResize) {
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

  /**  手动生成close关闭按钮，可以将close字段设置成false，然后在被Item包裹
   * 的子元素中将某个要指定为close按钮的标签的class设置成grid-item-close-btn也能将该元素当成作为close的触发按钮 */

  private _closeBtn(isDisplayBtn = false) {
    const closeBtnFunc = () => {
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
  public _mask_(isMask = false) {
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
  private _itemSizeLimitCheck() {
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
  private _genItemStyle = () => {
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

  public _genLimitSizeStyle = () => {
    if (this.styleLock()) return {}
    const minWidth = this.minWidth()
    const minHeight = this.minHeight()
    const maxWidth = this.maxWidth()
    const maxHeight = this.maxHeight()
    return {
      maxWidth: maxWidth + 'px',
      maxHeight: maxHeight + 'px',
      minWidth: Math.min(minWidth, maxWidth) + 'px',
      minHeight: Math.min(minHeight, maxHeight) + 'px',
    }

  }

}

