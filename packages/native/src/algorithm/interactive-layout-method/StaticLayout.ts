import {Layout} from "@/algorithm/interface/Layout";
import {Item} from "@/main";
import {autoSetSizeAndMargin} from "@/algorithm/common";
import {tempStore} from "@/events";

/**
 * 纯静态布局
 * 只能移动到容器空白处
 * 使用该布局请尽量指定col和rol,否则在进行窗口大小resize之后将会打乱布局,如果指定了col或者row，那么Item将不受影响
 * */
export class StaticLayout extends Layout {
  public name = 'static'
  public wait = 120
  protected static = true

  public blank() {
    this.moveToBlank()
  }

  public async layout(items: Item[], options: any) {
    const {dragItem} = tempStore
    const manager = this.manager
    const container = manager.container
    return this.throttle(() => {
      if (dragItem) {   //drag
        this.patchDirection()
      } else if (!dragItem) {  // resize window
        autoSetSizeAndMargin(container, true)
        container.engine.reset()
        const baseLine = container.getConfig("baseLine")
        const isAuto = this.hasAutoDirection()
        const res = manager.analysis(this.layoutItems, null, {
          baseLine,
          auto: isAuto
        })
        if (!res.isSuccess) return
        res.patch()
        this.layoutItems = manager.sortCurrentMatrixItems(this.layoutItems)
      }
      return true
    })
  }
}
