import {BaseEvent} from "@/plugins";

/**
 * container大小改变事件对象
 * */
export class ContainerSizeChangeEvent extends BaseEvent {
  preCol: number
  preRow: number
  curCol: number
  curRow: number

  constructor(opt) {
    super(opt);
    const container = this.container
    this.preCol = container.__ownTemp__.preCol
    this.preRow = container.__ownTemp__.preRow
    this.curCol = container.getConfig("col")
    this.curRow = container.getConfig("row")
  }
}
