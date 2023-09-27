import {ItemLayoutEvent} from "@/plugins";
import {isNumber} from "is-what";

/**
 * container大小改变事件对象
 * */
export class ContainerSizeChangeEvent extends ItemLayoutEvent {
  public readonly isColChanged: boolean
  public readonly isRowChanged: boolean
  public readonly preCol?: number
  public readonly preRow?: number
  public readonly curCol: number
  public readonly curRow: number

  constructor(opt) {
    super(opt);
    const container = this.container
    this.preCol = container.__ownTemp__.preCol
    this.preRow = container.__ownTemp__.preRow
    this.curCol = this.col
    this.curRow = this.row
    this.isColChanged = isNumber(this.preCol) && this.preCol !== this.curCol
    this.isRowChanged = isNumber(this.preRow) && this.preRow !== this.curRow
  }
}
