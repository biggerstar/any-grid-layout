import {tempStore} from "@/global";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";

export class ItemPosChangeEvent extends BaseEvent {
  public readonly oldX: number    // 未改变之前的x
  public readonly oldY: number    // 未改变之前的y
  public readonly oldW: number    // 未改变之前的w
  public readonly oldH: number    // 未改变之前的h
  constructor(opt) {
    super(opt);
    const {fromItem, lastResizeW, lastResizeH, lastDragX, lastDragY} = tempStore
    if (!fromItem) return
    this.oldW = lastResizeW || fromItem.pos.w
    this.oldH = lastResizeH || fromItem.pos.h
    if (fromItem.pos.x && fromItem.pos.y) {
      this.oldX = lastDragX || fromItem.pos.x
      this.oldY = lastDragY || fromItem.pos.y
    }
  }
}
