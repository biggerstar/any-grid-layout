import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {LayoutOptions, MoveDirection} from "@/types";

/**
 * 默认布局
 * 优点: 通过一系列优化，能支持在固定行宽的情况下基本能移动到所有位置，体验感是最好的
 * */
export class DefaultLayout extends Layout {
  public options: Required<LayoutOptions>
  public name = 'default'
  protected wait = 30

  public defaultDirection(name) {
    const {toItem, dragItem} = this.options
    if (!toItem) return
    this.manager.exchange(this.layoutItems, dragItem, toItem)
  }

  public anyDirection(name: MoveDirection) {
    const {dragItem, x, y} = this.options
    // console.log(name);
    this.addModifyItems(this.createModifyPosInfo(dragItem, {
      x,
      y
    }))
  }

  public top() {
    const {dragItem} = this.options
    this.patchDiffCoverItem((item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        y: item.pos.y + dragItem.pos.h
      }))
    }, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        y: item.pos.y + item.pos.h
      }))
    })
  }

  public bottom() {
    const {dragItem} = this.options
    this.patchDiffCoverItem((item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        y: item.pos.y - dragItem.pos.h
      }))
    }, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        y: item.pos.y - item.pos.h
      }))
    })
  }


  public right() {
    const {dragItem} = this.options
    this.patchDiffCoverItem((item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        x: item.pos.x - dragItem.pos.w
      }))
    }, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        x: item.pos.x - item.pos.w
      }))
    })
  }

  public left() {
    const {dragItem,} = this.options
    this.patchDiffCoverItem((item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        x: item.pos.x + dragItem.pos.w
      }))
    }, (item) => {
      this.addModifyItems(this.createModifyPosInfo(item, {
        x: item.pos.x + item.pos.w
      }))
    })
  }

  public async layout(items: Item[], options: LayoutOptions): Promise<boolean> {
    const {
      distance,
      speed,
      toItem,
      dragItem,
    } = options
    const mouseOverContainer = this.manager.container
    if (!mouseOverContainer || !dragItem) return
    if (distance < 8 || speed < 20) return
    return this.throttle(() => {
      if (toItem && this.isAnimation(toItem)) return;  // 检测是否在动画中，如果还在动画且完成距离较长，退出该次执行
      this.patchDirection()
      const res = this.manager.analysisCanMove(this.layoutItems, this.getModifyItems())
      if (!res.isCanMove) {
        return  // TODO 报预布局时容器溢出错误，后面封装到Layout中
      }
      res.patch()
      this.manager.getCurrentMatrixSortItems(this.layoutItems)
      return true
    })
  }
}
