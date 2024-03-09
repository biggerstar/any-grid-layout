import {BaseEvent} from "@/plugins";
import {tempStore} from "@/global";

export class GridClickEvent extends BaseEvent {
  /**
   * 点击的是容器还是item
   * */
  public type: 'container' | 'item'
  /**
   * 类型有 'drag' | 'resize' | 'close' | null
   * 表示当前点击意图
   * */
  public action: typeof tempStore.handleMethod

  constructor(opt:any) {
    super(opt);
    const {handleMethod, toItem} = tempStore
    this.action = handleMethod
    this.type = toItem ? "item" : "container"
    this.item = toItem
  }
}

