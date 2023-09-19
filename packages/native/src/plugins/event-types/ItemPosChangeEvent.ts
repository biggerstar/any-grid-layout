import {tempStore} from "@/global";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";

export class ItemPosChangeEvent extends BaseEvent {
  public readonly lastX: number    // 未改变之前的x
  public readonly lastY: number    // 未改变之前的y
  public readonly lastW: number    // 未改变之前的w
  public readonly lastH: number    // 未改变之前的h
  constructor(opt) {
    super(opt);
    const {fromItem, lastResizeW, lastResizeH, lastDragX, lastDragY} = tempStore
    if (!fromItem) return
    this.lastW = lastResizeW || fromItem.pos.w
    this.lastH = lastResizeH || fromItem.pos.h
    if (fromItem.pos.x && fromItem.pos.y) {
      this.lastX = lastDragX || fromItem.pos.x
      this.lastY = lastDragY || fromItem.pos.y
    }
  }
}
