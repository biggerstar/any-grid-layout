import {BaseEvent} from "@/plugins-src";

/**
 * container大小改变事件对象
 * */
export class ContainerSizeChangeEvent extends BaseEvent {
  public readonly col: number
  public readonly row: number
  public readonly isColChanged: boolean
  public readonly isRowChanged: boolean
  public readonly oldCol?: number
  public readonly oldRow?: number
  public readonly curCol: number
  public readonly curRow: number

  constructor(opt:any) {
    super(opt);
    const container = this.container
    this.col = container.getConfig("col")
    this.row = container.getConfig("row")
    const temp = container.__ownTemp__
    this.oldCol = temp.oldCol
    this.oldRow = temp.oldRow
    this.curCol = this.col
    this.curRow = this.row
    this.isColChanged = this.oldCol !== this.curCol
    this.isRowChanged = this.oldRow !== this.curRow
  }
}
