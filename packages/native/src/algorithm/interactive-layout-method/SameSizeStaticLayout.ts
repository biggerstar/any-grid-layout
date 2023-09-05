import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {tempStore} from "@/events";
import {autoSetSizeAndMargin} from "@/algorithm/common";

/**
 * 静态布局
 * 只允许某方向相同宽或高的Item互换
 * left,right方向 如果h一样且相邻便允许互换
 * top,bottom方向 如果w一样便且相邻允许互换
 * TODO 不要用于生产环境，需要继续优化
 * */
export class SameSizeStaticLayout extends Layout {
  public name = 'static'
  protected static = true
  public wait = 120

  public top() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem((toItem) => {
      if (dragItem.pos.y - toItem.pos.y > toItem.pos.h) return;
      if (toItem.pos.w > dragItem.pos.w || (toItem.pos.x !== dragItem.pos.x)) return  // 大小不一样忽略
      dragItem.pos.y = toItem.pos.y
      toItem.pos.y += dragItem.pos.h
    })
  }

  public bottom() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem((toItem) => {
      if (toItem.pos.y - dragItem.pos.y > dragItem.pos.h) return;
      if (toItem.pos.w > dragItem.pos.w || (toItem.pos.x !== dragItem.pos.x)) return
      toItem.pos.y = dragItem.pos.y
      dragItem.pos.y += toItem.pos.h
    })
  }

  public left() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem((toItem) => {
      if (dragItem.pos.x - toItem.pos.x > toItem.pos.w) return;
      if (toItem.pos.h > dragItem.pos.h || (toItem.pos.y !== dragItem.pos.y)) return
      dragItem.pos.x = toItem.pos.x
      toItem.pos.x += dragItem.pos.w
    })
  }

  public right() {
    const {dragItem} = tempStore
    if (!dragItem) return
    this.patchDiffCoverItem((toItem) => {
      if (toItem.pos.x - dragItem.pos.x > dragItem.pos.w) return;
      if (toItem.pos.h > dragItem.pos.h || (toItem.pos.y !== dragItem.pos.y)) return
      toItem.pos.x = dragItem.pos.x
      dragItem.pos.x += toItem.pos.w
    })
  }

  public blank() {
    this.moveToBlank()
  }

  public async layout(items: Item[], options: any) {
    const manager = this.manager
    const container = manager.container
    return this.throttle(() => {
      this.patchDirection()
      autoSetSizeAndMargin(container, true)
      container.engine.reset()
      return true
    })
  }
}
