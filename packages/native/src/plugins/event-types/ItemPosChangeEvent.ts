import {tempStore} from "@/global";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";
import {CustomItemPos} from "@/types";

export class ItemPosChangeEvent extends BaseEvent {
  /**
   * pos变化类型，是尺寸还是位置变化
   * */
  public readonly type: 'size' | 'position'
  public readonly oldX: number    // 未改变之前的x，可能和原来相同
  public readonly oldY: number    // 未改变之前的y，可能和原来相同
  public readonly oldW: number    // 未改变之前的w，可能和原来相同
  public readonly oldH: number    // 未改变之前的h，可能和原来相同
  constructor(opt: any) {
    super(opt);
    const {fromItem, lastPosX, lastPosY, lastPosW, lastPosH} = tempStore
    if (!fromItem) return
    const {w, h, x, y} = <Required<CustomItemPos>>fromItem.pos
    this.item = fromItem
    this.oldW = w
    this.oldH = h
    this.oldX = x
    this.oldY = y
    if (lastPosW !== w || lastPosH !== h) {
      this.type = 'size'
      tempStore.lastPosW = w
      tempStore.lastPosH = h
    }
    if (lastPosX !== x || lastPosY !== y) {
      this.type = 'position'
      tempStore.lastPosX = x
      tempStore.lastPosY = y
    }
  }
}
