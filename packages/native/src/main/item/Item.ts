import {Container} from "@/main/container/Container";
import {CustomItem} from "@/types";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPos} from "@/main";
import {isString} from "is-what";
import {grid_item_content} from "@/constant";
import {getContainerConfigs, updateStyle} from "@/utils";


/** 栅格成员, 所有对 DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 * @param {Element} el 传入的原生Element
 * @param {Object} pos 一个包含Item位置信息的对象
 * */
export class Item extends ItemGeneralImpl {
  //----------------内部需要的参数---------------------//
  public i: number   //  每次重新布局给的自动正整数编号,对应的是Item的len
  public element: HTMLElement
  public container: Container   // 挂载在哪个container上
  public contentElement: HTMLElement
  public declare pos: ItemPos
  //----------------保持状态所用参数---------------------//
  public customOptions: CustomItem
  private readonly _default: CustomItem
  private _mounted: boolean = false
  public __temp__: Record<any, any> = {}

  //----------------------------------------------------------
  constructor(itemOption: CustomItem) {
    super();
    if (itemOption instanceof Item) {
      return itemOption  // 如果传入的已经是Item实例，则直接返回
    }
    if (itemOption.el instanceof Element) {
      this.element = this.el = itemOption.el
    }
    this.customOptions = itemOption
    this.pos = new ItemPos(itemOption.pos)
    this._default = Object.freeze(new ItemGeneralImpl())
  }

  /**
   * 渲染, 直接渲染添加到 Container 中
   * */
  public mount() {
    if (this._mounted) {
      return
    }
    if (this.container.platform === 'native') {
      this.element = document.createElement('div')
      if (isString(this.el)) {
        this.contentElement = <HTMLElement>document.querySelector(this.el)
      } else if (this.el) {
        this.contentElement = this.el.isConnected ? <HTMLElement>document.adoptNode(this.el) : <HTMLElement>this.el
      }
      if (!this.contentElement) {
        this.contentElement = document.createElement("div")
      }
      this.contentElement.classList.add(grid_item_content)
      if (this.id && isString(this.id)) {
        this.contentElement.id = this.id
      }
      this.element.appendChild(this.contentElement)
      this.container.contentElement.appendChild(this.element)
    }
    this.element.classList.add(this.className)
    this.updateItemLayout()
    //--------------------------------------------
    this.element._gridItem_ = this
    this.element._isGridItem_ = true
    this._mounted = true
    this.container.bus.emit('itemMounted', {item: this})
  }

  /**
   * 自身调用从container中移除,未删除Items中的占位,若要删除可以遍历删除或者直接调用clear清除全部Item,或者使用isForce参数设为true
   * */
  public unmount() {
    if (this._mounted) {
      const container = this.container
      if (this.element.isConnected) {
        container.contentElement.removeChild(this.element)
      }
      this.remove()
      container.layoutManager.unmark(this.pos)
      this._mounted = false
      container.bus.emit('itemUnmounted', {item: this})
    } else {
      this.container.bus.emit('error', {
        type: 'ItemAlreadyRemoved',
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
      // position:'none',
      // transform: `translate3d(${this.offsetLeft() + 'px'},${this.offsetTop() + 'px'},0)`,
    }, this.element)
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器左边的距离, Item左边框 ---->  父元素左边框
   * */
  public offsetLeft(): number {
    const {gapX, itemWidth} = getContainerConfigs(this.container, ["gapX", "itemWidth"])
    const allGapWidth = this.pos.x > 1 ? (this.pos.x - 1) * gapX : 0
    return ((this.pos.x - 1) * itemWidth) + allGapWidth
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器顶部边的距离, Item上边框 ---->  父元素上边框
   * */
  public offsetTop(): number {
    const {gapY, itemHeight} = getContainerConfigs(this.container, ["gapY", "itemHeight"])
    const allGapHeight = this.pos.y > 1 ? (this.pos.y - 1) * gapY : 0
    return ((this.pos.y - 1) * itemHeight) + allGapHeight
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器左边的距离, Item左边框 ---->  父元素左边框
   * */
  public offsetRight(): number {
    const {gapX, itemWidth} = getContainerConfigs(this.container, ["gapX", "itemWidth"])
    const col = this.container.getConfig("col")
    return (col - this.pos.x - this.pos.w + 1) * (itemWidth + gapX)
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器顶部边的距离, Item上边框 ---->  父元素上边框
   * */
  public offsetBottom(): number {
    const {gapY, itemHeight} = getContainerConfigs(this.container, ["gapY", "itemHeight"])
    const row = this.container.getConfig("row")
    return (row - this.pos.y - this.pos.h + 1) * (itemHeight + gapY)
  }

  /**
   * @param w 栅格单位
   * @return {number}  获取该Item 当前的宽度
   * */
  public nowWidth(w?: number): number {
    const {gapX, itemWidth} = getContainerConfigs(this.container, ["gapX", "itemWidth"])
    const nowW = w ? w : this.pos.w
    const allGapWidth = nowW > 1 ? (nowW - 1) * gapX : 0
    return (nowW * itemWidth) + allGapWidth
  }

  /**
   * @param h 栅格单位
   * @return {number}  获取该Item 当前的高度
   * */
  public nowHeight(h?: number): number {
    const {gapY, itemHeight} = getContainerConfigs(this.container, ["gapY", "itemHeight"])
    const nowH = h ? h : this.pos.h
    const allGapHeight = nowH > 1 ? (nowH - 1) * gapY : 0
    return (nowH * itemHeight) + allGapHeight
  }

  /**
   * @return  {number}  根据当前自身的this.pos 生成Item当前必须占用最小宽度的像素大小
   * */
  public minWidth(): number {
    const {gapX, itemWidth} = getContainerConfigs(this.container, ["gapX", "itemWidth"])
    const allGapWidth = this.pos.minW > 1 ? (this.pos.minW - 1) * gapX : 0
    return (this.pos.minW * itemWidth) + allGapWidth
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最小的高度像素大小
   * */
  public minHeight(): number {
    const {gapY, itemHeight} = getContainerConfigs(this.container, ["gapY", "itemHeight"])
    const allGapHeight = this.pos.minH > 1 ? (this.pos.minH - 1) * gapY : 0
    return (this.pos.minH * itemHeight) + allGapHeight
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最大宽度的像素大小
   * */
  public maxWidth(): number | typeof Infinity {
    if (!isFinite(this.pos.maxW)) {
      return Infinity
    }
    const {gapX, itemWidth} = getContainerConfigs(this.container, ["gapX", "itemWidth"])
    return this.pos.maxW * itemWidth + (this.pos.maxW - 1) * gapX
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最大的高度像素大小
   * */
  public maxHeight(): number | typeof Infinity {
    if (!isFinite(this.pos.maxH)) {
      return Infinity
    }
    const {gapY, itemHeight} = getContainerConfigs(this.container, ["gapY", "itemHeight"])
    return this.pos.maxH * itemHeight + (this.pos.maxH - 1) * gapY
  }

  /**
   * 距离right方向上最近的可调整距离(包含item的width)
   * */
  public spaceRight(): number | typeof Infinity {
    const {gapX, itemWidth} = getContainerConfigs(this.container, ['gapX', 'itemWidth'])
    const manager = this.container.layoutManager
    const coverRightItems = manager.findCoverItemsFromPosition(this.container.items, {
      ...this.pos,
      w: this.container.getConfig("col") - this.pos.x + 1
    }, [this])
    if (!coverRightItems.length && this.container.autoGrowCol) {
      return Infinity
    }
    let minOffsetRight = this.offsetRight()
    coverRightItems.forEach((item) => {
      const offsetCol = item.pos.x - (this.pos.x + this.pos.w - 1) - 1
      let offsetRight: number
      if (offsetCol === 0) {
        offsetRight = itemWidth
      } else {
        offsetRight = (gapX + itemWidth) * offsetCol + itemWidth
      }
      if (minOffsetRight > offsetRight) {
        minOffsetRight = offsetRight
      }
    })
    return minOffsetRight + this.nowWidth()
  }

  /**
   * 距离bottom方向上最近的最大可调整距离(包含item的height)
   * */
  public spaceBottom(): number | typeof Infinity {
    const {gapY, itemHeight} = getContainerConfigs(this.container, ['gapY', 'itemHeight'])
    const manager = this.container.layoutManager
    const coverBottomItems = manager.findCoverItemsFromPosition(this.container.items, {
      ...this.pos,
      h: this.container.getConfig("row") - this.pos.y + 1
    }, [this])
    if (!coverBottomItems.length && this.container.autoGrowRow) {
      return Infinity
    }
    let minOffsetBottom = this.offsetBottom()
    coverBottomItems.forEach((item) => {
      const offsetRow = item.pos.y - (this.pos.y + this.pos.h - 1) - 1
      let offsetBottom: number
      if (offsetRow === 0) {
        offsetBottom = itemHeight
      } else {
        offsetBottom = (gapY + itemHeight) * offsetRow + itemHeight
      }
      if (minOffsetBottom > offsetBottom) {
        minOffsetBottom = offsetBottom
      }
    })
    return minOffsetBottom + this.nowHeight()
  }
}

