import {Sync} from "@/utils/Sync";
import {Container} from "@/main/container/Container";
import {CustomItem, MarginOrSizeDesc} from "@/types";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPos} from "@/main";
import equal from 'fast-deep-equal'
import {isString} from "is-what";
import {
  grid_item_close_btn,
  grid_item_close_text,
  grid_item_content,
  grid_item_resizable_handle,
  grid_item_resize_text
} from "@/constant";
import {updateStyle} from "@/utils";


/** 栅格成员, 所有对 DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 * @param {Element} el 传入的原生Element
 * @param {Object} pos 一个包含Item位置信息的对象
 * */

export class Item extends ItemGeneralImpl {
  //----------------内部需要的参数---------------------//
  public i: number   //  每次重新布局给的自动正整数编号,对应的是Item的len
  public element: HTMLElement
  public container: Container   // 挂载在哪个container上
  public tagName: string = 'div'
  public classList: string[] = []
  public parentElement: HTMLElement
  public contentElement: HTMLElement
  public pos: ItemPos
  //----------------保持状态所用参数---------------------//
  public customOptions: ItemGeneralImpl
  public readonly _default: ItemGeneralImpl
  private _mounted: boolean = false
  private _resizeTabEl?: HTMLElement
  private _closeEl?: HTMLElement
  public __temp__: Record<any, any> = {
    isDelayLoadAnimation: false,  // 是否延迟附加动画效果，否则当item一个个加入时会有初始加载过程的变化动画，可保留，但个人觉得不好看
  }

  //-------------------------getter---------------------------
  /**
   * Item间距 [左右, 上下]
   * */
  public get margin(): MarginOrSizeDesc {  //
    return this.container.getConfig('margin') as MarginOrSizeDesc
  }

  /**
   * Item宽高 [宽度, 高度]
   * */
  public get size(): MarginOrSizeDesc {  //
    return this.container.getConfig('size') as MarginOrSizeDesc
  }

  //----------------------------------------------------------
  constructor(itemOption: CustomItem | Item) {
    super()
    if (itemOption instanceof Item) return itemOption  // 如果已经是item，则直接返回
    if (itemOption.el instanceof Element) this.element = this.el = itemOption.el
    this.customOptions = itemOption
    this._default = new ItemGeneralImpl()
    this._define(itemOption)
  }

  /**
   * 用于代理中转用户配置和支持获取默认配置
   * 对item 所有操作只要键值在 ItemGeneralImpl 中的，则会根据一定规则同步到当前item状态到container.layout中
   * 若当前值和 ItemGeneralImpl 中默认值一样，则不会同步，保证用户配置最简化
   * */
  private _define(itemOption) {
    const self = this
    const _default = this._default
    const _customOptions = itemOption
    const pos = new ItemPos(itemOption.pos)
    const get = (k: keyof ItemGeneralImpl) => {
      if (k === 'pos') return pos
      return _customOptions.hasOwnProperty(k) ? _customOptions[k] : _default[k]
    }
    const set = (k: keyof ItemGeneralImpl, v: any) => {
      if (k === 'pos') return  // 不允许更改pos
      !equal(_customOptions[k], _default[k]) ? _customOptions[k] = v : null
    }

    for (const k in _default) {
      Object.defineProperty(<object>this, k, {
        get: () => get(<any>k),      /* 优先获取用户配置,没有的话则获取item默认配置 */
        set: (v) => set(<any>k, v)   /* 如果该值等于默认值，则不需要同步到用户配置上  */
      })
    }

    Object.defineProperties(<object>this, {
      draggable: {
        get: () => get('draggable'),
        set: (v) => set('draggable', Boolean(v))
      },
      resize: {
        get: () => get('resize'),
        set: (v) => set('resize', Boolean(v)) || self._handleResize(v)
      },
      close: {
        get: () => get('close'),
        set: (v) => set('close', Boolean(v)) || self._closeBtn(v)
      },
      transition: {
        get: () => get('transition'),
        set(v) {
          const transition = get('transition')
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

  /**
   * 渲染, 直接渲染添加到 Container 中
   * */
  public mount() {
    const _mountedFun = () => {
      if (this._mounted) return
      if (this.container.platform === 'native') {
        this.element = document.createElement(this.tagName)
        if (isString(this.el)) {
          this.contentElement = <HTMLElement>document.querySelector(this.el)
        } else if (this.el) {
          this.contentElement = this.el.isConnected ? <HTMLElement>document.adoptNode(this.el) : <HTMLElement>this.el
        }
        if (!this.contentElement) this.contentElement = document.createElement("div")
        this.contentElement.classList.add(grid_item_content)
        if (this.id && isString(this.id)) this.contentElement.id = this.id
        this.element.appendChild(this.contentElement)
        this.container.contentElement.appendChild(this.element)
      }
      this.element.classList.add(this.className)
      this.classList = Array.from(this.element.classList)
      this.updateItemLayout()
      //--------------开启编辑和动画------------------
      this._handleResize(this.resize)
      this._closeBtn(this.close)
      this.animation(this.transition)
      //--------------------------------------------
      this.__temp__.w = this.pos.w
      this.__temp__.h = this.pos.h
      this.element['_gridItem_'] = this
      this.element['_isGridItem_'] = true
      this._mounted = true
      this.container.bus.emit('itemMounted', {
        target: this
      })
    }
    _mountedFun()
  }


  /**
   * 自身调用从container中移除,未删除Items中的占位,若要删除可以遍历删除或者直接调用clear清除全部Item,或者使用isForce参数设为true
   * */
  public unmount() {
    if (this._mounted) {
      const container = this.container
      container.contentElement.removeChild(this.element)
      this.remove()
      container.layoutManager.unmark(this.pos)
      container.bus.emit('itemUnmounted')
      this._mounted = false
    } else {
      this.container.bus.emit('error', {
        type: 'ItemAlreadyRemove',
        message: '该Item对应的element未在文档中挂载，可能已经被移除',
        from: this
      })
    }
  }

  /**
   * 将自身在item列表中移除，不会移除dom元素
   * */
  public remove() {
    this.container.removeItem(this)
  }

  /**
   * 对该Item开启位置变化过渡动画
   * @param {Object} transition  Item移动或者大小要进行变化过渡的时间，单位ms,可以传入true使用默认时间180ms,或者传入false关闭动画
   * */
  public animation(transition) {
    if (typeof transition !== "object") {
      this.container.bus.emit('warn', {
        message: '参数应该是对象形式{ time: Number, field: String }'
      })
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
        updateStyle(style,this.element)
      },
      rule: () => this.__temp__.isDelayLoadAnimation
    })
    this.__temp__.isDelayLoadAnimation = true
  }


  /** 根据 pos的最新数据 立即更新当前Item在容器中的位置 */
  public updateItemLayout() {
    //   三种布局方案，都能实现grid布局，性能最好的是定位法 //
    updateStyle({
      // 定位法
      width: this.nowWidth() + 'px',
      height: this.nowHeight() + 'px',
      left: this.offsetLeft() + 'px',
      top: this.offsetTop() + 'px',

      // grid布局
      // gridColumn: `${this.pos.x} / span ${this.pos.w}`,
      // gridRow: `${this.pos.y} / span ${this.pos.h}`,

      // transform
      // transform:`translate(${this.offsetLeft()+'px'},${this.offsetTop()+'px'})`,
    },this.element)
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离父元素左边的距离, Item左边框 ---->  父元素左边框
   * */
  public offsetLeft() {
    const marginWidth = this.pos.x > 1 ? (this.pos.x - 1) * this.margin[0] : 0
    return ((this.pos.x - 1) * this.size[0]) + marginWidth
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离父元素顶部边的距离, Item上边框 ---->  父元素上边框
   * */
  public offsetTop() {
    const marginHeight = this.pos.y > 1 ? (this.pos.y - 1) * this.margin[1] : 0
    return ((this.pos.y - 1) * this.size[1]) + marginHeight
  }

  /**
   * @return {number} px像素转栅格单位 w
   * */
  public pxToW = (pxNum: number) => {
    if (this.margin[0] >= Math.abs(pxNum)) return 1
    else return Math.ceil(Math.abs(pxNum) / (this.margin[0] + this.size[0]))
  }

  /**
   * @return {number} px像素转栅格单位 h
   * */
  public pxToH = (pxNum: number) => {
    if (this.margin[1] >= Math.abs(pxNum)) return 1
    else return Math.ceil(Math.abs(pxNum) / (this.margin[1] + this.size[1]))
  }

  /**
   * @param w 栅格单位
   * @return {number}  获取该Item 当前的宽度
   * */
  public nowWidth = (w?: number) => {
    const nowW = w ? w : this.pos.w
    const marginWidth = nowW > 1 ? (nowW - 1) * this.margin[0] : 0
    return (nowW * this.size[0]) + marginWidth
  }

  /**
   * @param h 栅格单位
   * @return {number}  获取该Item 当前的高度
   * */
  public nowHeight = (h?: number) => {
    const nowH = h ? h : this.pos.h
    const marginHeight = nowH > 1 ? (nowH - 1) * this.margin[1] : 0
    return (nowH * this.size[1]) + marginHeight
  }

  /**
   * @return  {number}  根据当前自身的this.pos 生成Item当前必须占用最小宽度的像素大小
   * */
  public minWidth() {
    const marginWidth = this.pos.minW > 1 ? (this.pos.minW - 1) * this.margin[0] : 0
    return (this.pos.minW * this.size[0]) + marginWidth
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最小的高度像素大小
   * */
  public minHeight = () => {
    const marginHeight = this.pos.minH > 1 ? (this.pos.minH - 1) * this.margin[1] : 0
    return (this.pos.minH * this.size[1]) + marginHeight
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最大宽度的像素大小
   * */
  public maxWidth() {
    if (!isFinite(this.pos.maxW)) return Infinity
    return this.pos.maxW * this.size[0] + (this.pos.maxW - 1) * this.margin[0]
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最大的高度像素大小
   * */
  public maxHeight = () => {
    if (!isFinite(this.pos.maxH)) return Infinity
    return this.pos.maxH * this.size[1] + (this.pos.maxH - 1) * this.margin[1]
  }

  /**
   * 手动生成resize元素，可以将resize字段设置成false
   * q: 如何自定义resize按钮?
   * a: Item元素包裹下，创建一个包含class名为grid-item-resizable-handle的元素即可，用户点击该元素将会被判定为resize动作
   * */
  private _handleResize(isResize = false) {
    const handleResizeFunc = () => {
      if (isResize && !this._resizeTabEl) {
        const handleResizeEls = this.element.querySelectorAll('.' + grid_item_resizable_handle)
        if (handleResizeEls.length > 0) return;
        const resizeTabEl = document.createElement('span')
        resizeTabEl.innerHTML = grid_item_resize_text
        this.element.appendChild(resizeTabEl)
        resizeTabEl.classList.add(grid_item_resizable_handle)
        this._resizeTabEl = resizeTabEl
      } else if (this.element && !isResize) {
        for (let i = 0; i < this.element.children.length; i++) {
          const node = this.element.children[i]
          if (node.className.includes(grid_item_resizable_handle)) {
            this.element.removeChild(node)
          }
        }
      }
    }
    this.element ? handleResizeFunc() : Sync.run(handleResizeFunc)
  }

  /**
   * 手动生成close关闭按钮，可以将close字段设置成false
   * q: 如何自定义close按钮?
   * a: Item元素包裹下，创建一个包含class名为grid-item-close-handle的元素即可，用户点击该元素将会被判定为close动作
   * */
  private _closeBtn(isDisplayBtn = false) {
    const closeBtnFunc = () => {
      if (isDisplayBtn && !this._closeEl) {
        const _closeEl = document.createElement('div')
        this._closeEl = _closeEl
        _closeEl.classList.add(grid_item_close_btn)
        _closeEl.innerHTML = grid_item_close_text
        this.element.appendChild(_closeEl)
      }
      if (this._closeEl && !isDisplayBtn) {
        for (let i = 0; i < this.element.children.length; i++) {
          const node = this.element.children[i]
          if (node.className.includes(grid_item_close_btn)) {
            this.element.removeChild(node)
          }
        }
      }
    }
    this.element ? closeBtnFunc() : Sync.run(closeBtnFunc)
  }
}

