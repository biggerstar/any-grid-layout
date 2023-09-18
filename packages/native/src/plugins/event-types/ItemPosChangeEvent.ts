import {tempStore} from "@/global";
import {BaseEvent} from "@/plugins/event-types/BaseEvent";

export class ItemPosChangeEvent extends BaseEvent {
  public lastX: number    // 未改变之前的x
  public lastY: number    // 未改变之前的y
  public lastW: number    // 未改变之前的w
  public lastH: number    // 未改变之前的h
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
