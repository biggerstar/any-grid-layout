import {ItemLayoutEvent} from "@/plugins";

/**
 * container大小改变事件对象
 * */
export class ContainerSizeChangeEvent extends ItemLayoutEvent {
  public readonly isColChanged: boolean
  public readonly isRowChanged: boolean
  public readonly oldCol?: number
  public readonly oldRow?: number
  public readonly curCol: number
  public readonly curRow: number

  constructor(opt) {
    super(opt);
    const container = this.container
    const temp = container.__ownTemp__
    this.oldCol = temp.oldCol
    this.oldRow = temp.oldRow
    this.curCol = this.col
    this.curRow = this.row
    this.isColChanged = this.oldCol !== this.curCol
    this.isRowChanged = this.oldRow !== this.curRow
  }
}
