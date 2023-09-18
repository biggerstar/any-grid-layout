import {ItemLayoutEvent} from "@/plugins";
import {isNumber} from "is-what";

/**
 * container大小改变事件对象
 * */
export class ContainerSizeChangeEvent extends ItemLayoutEvent {
  public isColChanged: boolean
  public isRowChanged: boolean
  public preCol?: number
  public preRow?: number
  public curCol: number
  public curRow: number

  constructor(opt) {
    super(opt);
    const container = this.container
    this.preCol = container.__ownTemp__.preCol
    this.preRow = container.__ownTemp__.preRow
    this.curCol = container.getConfig("col")
    this.curRow = container.getConfig("row")
    this.isColChanged = isNumber(this.preCol) && this.preCol !== this.curCol
    this.isRowChanged = isNumber(this.preRow) && this.preRow !== this.curRow
  }
}
