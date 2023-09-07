import {Layout} from "@/algorithm/interface/Layout";
import {MoveDirection} from "@/types";
import {tempStore} from "@/events";
import {autoSetSizeAndMargin} from "@/algorithm/common";
import {createModifyPosInfo} from "@/algorithm/common/tool";

/**
 * 默认布局
 * 优点: 通过一系列优化，能支持在固定行宽的情况下基本能移动到所有位置，体验感是最好的
 * */
export class DefaultLayout {
  public name = 'default'

  public async layout(): Promise<boolean> {
    const {dragItem, toItem, isDragging, isResizing, newResizeW, newResizeH} = tempStore
    const manager = this.manager
    const container = manager.container
    return this.throttle(() => {
      autoSetSizeAndMargin(container, true)

      return true
    })
  }
}
