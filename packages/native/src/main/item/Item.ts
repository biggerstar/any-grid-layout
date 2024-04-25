import {CustomItem} from "@/types";
import {ItemGeneralImpl} from "@/main/item/ItemGeneralImpl";
import {ItemPos} from "@/main";
import {grid_item_class_name, grid_item_content} from "@/constant";
import {updateStyle} from "@/utils";

/** 栅格成员, 所有对 DOM的操作都是安全异步执行且无返回值，无需担心获取不到document
 * @param {Element} el 传入的原生Element
 * @param {Object} pos 一个包含Item位置信息的对象
 * */
export class Item extends ItemGeneralImpl {
  //----------------内部需要的参数---------------------//
  public element: HTMLElement
  public readonly declare pos: ItemPos
  //----------------保持状态所用参数---------------------//
  public readonly customOptions: CustomItem
  public mounted: boolean = false
  public readonly __temp__: Record<any, any> = {}

  //----------------------------------------------------------
  constructor(itemOption: CustomItem) {
    super();
    if (itemOption instanceof Item) {
      return itemOption  // 如果传入的已经是Item实例，则直接返回
    }
    // if (itemOption.el instanceof Element) {
    //   this.element = this.el = itemOption.el
    // }
    if (!itemOption.container) {
      throw new Error('请指定需要挂载到的容器实例 container')
    }
    if (!itemOption.key) {
      throw new Error('您的Item成员中有成员存在 key 值为空的情况')
    }
    this.container = itemOption.container
    this.key = itemOption.key
    this.customOptions = itemOption
    delete itemOption.container
    this.pos = new ItemPos(itemOption.pos)
  }

  /**
   * 渲染, 直接渲染添加到 Container 中
   * */
  public mount() {
    if (this.mounted) {
      return
    }
    // this.element = document.createElement('div')
    // if (isString(this.el)) {
    //   this.element = <HTMLElement>document.querySelector(this.el)
    // } else if (this.el) {
    //   this.element = this.el.isConnected ? <HTMLElement>document.adoptNode(this.el) : <HTMLElement>this.el
    // }
    if (!this.element) {
      this.element = document.createElement("div")
    }
    this.element.classList.add(grid_item_content)
    this.container.element.appendChild(this.element)
    this.element.classList.add(grid_item_class_name)
    this.updateItemLayout()
    //--------------------------------------------
    this.element._gridItem_ = this
    this.element._isGridItem_ = true
    this.mounted = true
    this.container.bus.emit('itemMounted', {item: this})
  }

  /**
   * 自身调用从container中移除,未删除Items中的占位,若要删除可以遍历删除或者直接调用clear清除全部Item,或者使用isForce参数设为true
   * */
  public unmount() {
    if (this.mounted) {
      const container = this.container
      if (this.element.isConnected) {
        this.element.parentElement.removeChild(this.element)
      }
      container.layoutManager.unmark(this.pos)
      this.mounted = false
      container.bus.emit('itemUnmounted', {item: this})
    }
  }

  /** 根据 pos的最新数据 立即更新当前Item在容器中的位置 */
  public updateItemLayout() {
    const {x, y, w, h} = this.pos
    if (!x || !y || !w || !h) {
      throw new Error('您必须为要布局的Item完整设定x, y, w, h, 您若需要使用自定义布局算法，请使用 layout 事件钩子实现')
    }
    //   三种布局方案，都能实现grid布局，性能最好的是定位法 //
    updateStyle({
      // 定位法
      width: this.nowWidth() + 'px',
      height: this.nowHeight() + 'px',
      // left: this.offsetLeft() + 'px',
      // top: this.offsetTop() + 'px',

      // grid布局
      // gridColumn: `${this.pos.x} / span ${this.pos.w}`,
      // gridRow: `${this.pos.y} / span ${this.pos.h}`,

      // transform
      transform: `translate3d(${this.offsetLeft() + 'px'},${this.offsetTop() + 'px'},0)`,
    }, this.element)
  }

  // public getGridRect(){
  //   return {
  //   }
  // }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器左边的距离, Item左边框 ---->  父元素左边框
   * */
  public offsetLeft(): number {
    const {gapX, itemWidth} = this.container.state
    const allGapWidth = this.pos.x > 1 ? (this.pos.x - 1) * gapX : 0
    return ((this.pos.x - 1) * itemWidth) + allGapWidth
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器顶部边的距离, Item上边框 ---->  父元素上边框
   * */
  public offsetTop(): number {
    const {gapY, itemHeight} = this.container.state
    const allGapHeight = this.pos.y > 1 ? (this.pos.y - 1) * gapY : 0
    return ((this.pos.y - 1) * itemHeight) + allGapHeight
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器左边的距离, Item左边框 ---->  父元素左边框
   * */
  public offsetRight(): number {
    const {gapX, itemWidth} =this.container.state
    const col = this.container.state.col
    return (col - this.pos.x - this.pos.w + 1) * (itemWidth + gapX)
  }

  /**
   * @return  根据当前自身的this.pos 生成当前Item 距离容器顶部边的距离, Item上边框 ---->  父元素上边框
   * */
  public offsetBottom(): number {
    const {gapY, itemHeight} = this.container.state
    const row = this.container.state.row
    return (row - this.pos.y - this.pos.h + 1) * (itemHeight + gapY)
  }

  /**
   * @param w 栅格单位
   * @return {number}  获取该Item 当前的宽度
   * */
  public nowWidth(w?: number): number {
    const {gapX, itemWidth} = this.container.state
    const nowW = w ? w : this.pos.w
    const allGapWidth = nowW > 1 ? (nowW - 1) * gapX : 0
    return (nowW * itemWidth) + allGapWidth
  }

  /**
   * @param h 栅格单位
   * @return {number}  获取该Item 当前的高度
   * */
  public nowHeight(h?: number): number {
    const {gapY, itemHeight} = this.container.state
    const nowH = h ? h : this.pos.h
    const allGapHeight = nowH > 1 ? (nowH - 1) * gapY : 0
    return (nowH * itemHeight) + allGapHeight
  }

  /**
   * @return  {number}  根据当前自身的this.pos 生成Item当前必须占用最小宽度的像素大小
   * */
  public minWidth(): number {
    const {gapX, itemWidth} = this.container.state
    const allGapWidth = this.pos.minW > 1 ? (this.pos.minW - 1) * gapX : 0
    return (this.pos.minW * itemWidth) + allGapWidth
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最小的高度像素大小
   * */
  public minHeight(): number {
    const {gapY, itemHeight} = this.container.state
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
    const {gapX, itemWidth} = this.container.state
    return this.pos.maxW * itemWidth + (this.pos.maxW - 1) * gapX
  }

  /**
   * @return {number}  根据当前自身的this.pos 生成Item当前必须占用最大的高度像素大小
   * */
  public maxHeight(): number | typeof Infinity {
    if (!isFinite(this.pos.maxH)) {
      return Infinity
    }
    const {gapY, itemHeight} = this.container.state
    return this.pos.maxH * itemHeight + (this.pos.maxH - 1) * gapY
  }

  // /**
  //  * 距离right方向上最近的可调整距离(包含item的width)
  //  * */
  // public spaceRight(): number | typeof Infinity {
  //   const {gapX, itemWidth} = this.container.state
  //   const manager = this.container.layoutManager
  //   const coverRightItems = manager.findCoverItemsFromPosition(this.container.state.items, {
  //     ...this.pos,
  //     w: this.container.state.col - this.pos.x + 1
  //   }, [this])
  //   // if (!coverRightItems.length && this.container.autoGrowCol) {
  //   //   return Infinity
  //   // }
  //   let minOffsetRight = this.offsetRight()
  //   coverRightItems.forEach((item) => {
  //     const offsetCol = item.pos.x - (this.pos.x + this.pos.w - 1) - 1
  //     let offsetRight: number
  //     if (offsetCol === 0) {
  //       offsetRight = itemWidth
  //     } else {
  //       offsetRight = (gapX + itemWidth) * offsetCol + itemWidth
  //     }
  //     if (minOffsetRight > offsetRight) {
  //       minOffsetRight = offsetRight
  //     }
  //   })
  //   return minOffsetRight + this.nowWidth()
  // }
  //
  // /**
  //  * 距离bottom方向上最近的最大可调整距离(包含item的height)
  //  * */
  // public spaceBottom(): number | typeof Infinity {
  //   const {gapY, itemHeight} = this.container.state
  //   const manager = this.container.layoutManager
  //   const coverBottomItems = manager.findCoverItemsFromPosition(this.container.state.items, {
  //     ...this.pos,
  //     h: this.container.state.row - this.pos.y + 1
  //   }, [this])
  //   // if (!coverBottomItems.length && this.container.autoGrowRow) {
  //   //   return Infinity
  //   // }
  //   let minOffsetBottom = this.offsetBottom()
  //   coverBottomItems.forEach((item) => {
  //     const offsetRow = item.pos.y - (this.pos.y + this.pos.h - 1) - 1
  //     let offsetBottom: number
  //     if (offsetRow === 0) {
  //       offsetBottom = itemHeight
  //     } else {
  //       offsetBottom = (gapY + itemHeight) * offsetRow + itemHeight
  //     }
  //     if (minOffsetBottom > offsetBottom) {
  //       minOffsetBottom = offsetBottom
  //     }
  //   })
  //   return minOffsetBottom + this.nowHeight()
  // }
}

