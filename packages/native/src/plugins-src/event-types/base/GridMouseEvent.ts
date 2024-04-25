import {ContainerBaseEvent} from "@/plugins-src/event-types/base/ContainerBaseEvent";

export class GridMouseBaseEvent extends ContainerBaseEvent {
  // public readonly toPos: CustomItemPos
  // public readonly startGridX: number // 克隆元素左上角位于当前网格容器左上角相对限制在容器内的栅格X位置,和resize解释一样
  // public readonly startGridY: number // 克隆元素左上角位于当前网格容器左上角相对限制在容器内的栅格Y位置,和resize解释一样
  // public readonly startRelativeX: number // 克隆元素左上角位于当前网格容器左上角相对在容器的栅格Y位置,和resize解释一样
  // public readonly startRelativeY: number // 克隆元素左上角位于当前网格容器左上角相对在容器的栅格Y位置,和resize解释一样
  // public readonly offsetGridX: number // 当前拖动位置相对源item偏移，限制在容器内
  // public readonly offsetGridY: number // 当前拖动位置相对源item偏移，限制在容器内
  // public readonly offsetRelativeX: number // 当前拖动位置相对源item偏移
  // public readonly offsetRelativeY: number // 当前拖动位置相对源item偏移
  public readonly inputEvent: MouseEvent
  public readonly offsetGridX: number
  public readonly offsetGridY: number
  public readonly offsetLeft: number
  public readonly offsetTop: number

  constructor(opt: any) {
    super(opt)
    const container = this.container
    if (container) {
      const {clientX, clientY} = opt.inputEvent
      const {
        x: offsetLeft,
        y: offsetTop
      } = container.matrixTransform.transformCoordinates(clientX + window.scrollX, clientY + window.scrollY);
      this.offsetLeft = offsetLeft - container.state.gapX + container.mountElement.scrollLeft
      this.offsetTop = offsetTop + container.mountElement.scrollTop
      this.offsetGridX = this.container.pxToGridW(this.offsetLeft, {keepSymbol: true})
      this.offsetGridY = this.container.pxToGridH(this.offsetTop, {keepSymbol: true})
    }

    // const {
    //   toItem,
    //   fromItem,
    // } = tempStore
    // const container = this.container
    // const {offsetLeft, offsetTop, scaleMultipleX, scaleMultipleY} = this.shadowItemInfo
    // const {width, height} = this.itemInfo
    // const cloneElStartWidth = Math.max(0, offsetLeft + width * (scaleMultipleX - 1))
    // const cloneElStartHeight = Math.max(0, offsetTop + height * (scaleMultipleY - 1))
    // const hasHalfItemSizeWidth = cloneElStartWidth + (this.size[0] + this.margin[0]) / 2  // Q:为何加上toHalfItemSizeWidth? A:只有克隆元素的边界进入下一个item前往的item空位超过一半的时候才会更变startX
    // const hasHalfItemSizeHeight = cloneElStartHeight + (this.size[1] + this.margin[1]) / 2  // 同上
    // this.startRelativeX = clamp(container.pxToW(hasHalfItemSizeWidth), 1, Infinity)
    // this.startRelativeY = clamp(container.pxToH(hasHalfItemSizeHeight), 1, Infinity)
    // this.startGridX = clamp(this.startRelativeX, 1, this.col - fromItem!.pos.w + 1)
    // this.startGridY = clamp(this.startRelativeY, 1, this.row - fromItem!.pos.h + 1)
    // this.toPos = {
    //   w: this.fromItem.pos.w,
    //   h: this.fromItem.pos.h,
    //   x: this.startGridX,
    //   y: this.startGridY,
    // }
    // this.toItem = toItem
    // this.offsetGridX = this.startGridX - fromItem!.pos.x
    // this.offsetGridY = this.startGridY - fromItem!.pos.y
    // this.offsetRelativeX = this.relativeX - fromItem!.pos.x
    // this.offsetRelativeY = this.relativeY - fromItem!.pos.y

  }
}
