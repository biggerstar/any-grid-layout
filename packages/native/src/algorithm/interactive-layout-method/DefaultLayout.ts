import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {MoveDirection} from "@/types";
import {tempStore} from "@/events";
import {autoSetSizeAndMargin} from "@/algorithm/common";

/**
 * 默认布局
 * 优点: 通过一系列优化，能支持在固定行宽的情况下基本能移动到所有位置，体验感是最好的
 * */
export class DefaultLayout extends Layout {
  public name = 'default'
  public wait = 120

  public defaultDirection(name) {
    const {toItem, dragItem} = tempStore
    if (!toItem || !dragItem) return
    this.manager.exchange(this.layoutItems, dragItem, toItem)
  }

  public anyDirection(name: MoveDirection) {
    const {dragItem, gridX: x, gridY: y} = tempStore
    if (!dragItem) return
    this.addModifyItems(this.createModifyPosInfo(dragItem, {
      x,
      y
    }))
  }

  public top() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem(null, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        y: item.pos.y + dragItem.pos.h
      }))
    })
  }

  public bottom() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem(null, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        y: item.pos.y - dragItem.pos.h
      }))
    })
  }


  public right() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem(null, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        x: item.pos.x - dragItem.pos.w
      }))
    })
  }

  public left() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem(null, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        x: item.pos.x + dragItem.pos.w
      }))
    })
  }

  public init() {
    const manager = this.manager
    const container = manager.container
    const engine = container.engine
    autoSetSizeAndMargin(container, true)
    engine.reset()
    const res = manager.analysis(engine.items)
    res.patch()
    this.layoutItems = res.successItems
    return res
  }

  public async layout(items: Item[]): Promise<boolean> {
    const {toItem, dragItem} = tempStore
    const manager = this.manager
    const container = manager.container
    return this.throttle(() => {
      if (toItem) console.log(this.isAnimation(toItem))
      if (toItem && this.isAnimation(toItem)) return;  // 检测是否在动画中，如果还在动画且完成距离较长，退出该次执行
      if (dragItem) this.patchDirection()
      autoSetSizeAndMargin(container, true)
      container.engine.reset()
      const baseLine = container.getConfig("baseLine")
      let res = this.manager.analysis(this.layoutItems, this.getModifyItems(), {
        auto: true,
        baseline: baseLine
      })
      if (!res.isSuccess) return
      // this.layoutItems = manager.getCurrentMatrixSortItems()
      res.patch()
      return true
    })
  }
}
