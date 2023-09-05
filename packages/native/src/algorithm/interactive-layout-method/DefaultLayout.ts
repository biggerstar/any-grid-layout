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

  public async layout(items: Item[]): Promise<boolean> {
    const {dragItem, toItem} = tempStore
    const manager = this.manager
    const container = manager.container
    if (dragItem && !toItem) return
    if (!this.allowLayout()) return
    return this.throttle(() => {
      if (dragItem) this.patchDirection()
      autoSetSizeAndMargin(container, true)
      container.engine.reset()
      const baseLine = container.getConfig("baseLine")
      let res = this.manager.analysis(this.layoutItems, this.getModifyItems(), {
        auto: this.hasAutoDirection(),
        baseline: baseLine
      })
      if (!res.isSuccess) return
      res.patch()
      this.layoutItems = manager.sortCurrentMatrixItems(this.layoutItems)
      return true
    })
  }
}
